const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser({
    customFields: {
        item: ['source']
    }
});

// Helper to get random date within a range
function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function fetchRealNews() {
    console.log("뉴스 크롤링 시작... (검색량 증가)");
    
    // Google News RSS: 인공지능 관련 최신 뉴스 (더 많은 결과를 위해 쿼리 조정 및 다중 요청 고려 가능하나, 여기선 단일 쿼리로 최대량 확보 시도)
    const url = 'https://news.google.com/rss/search?q=%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+when:30d&hl=ko&gl=KR&ceid=KR:ko';
    
    try {
        const feed = await parser.parseURL(url);
        
        // 100개까지 기사 확보 시도 (RSS 피드가 제공하는 최대 한도 내)
        let rawItems = feed.items.slice(0, 100);
        console.log(`총 ${rawItems.length}개의 기사를 가져왔습니다.`);

        const today = new Date();
        const dates = [];
        for (let i=0; i<14; i++) { // 최근 14일치 분배
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }

        let dailyNewsData = rawItems.map((item, index) => {
            let title = item.title;
            let source = "알 수 없음";
            if (title.lastIndexOf(' - ') !== -1) {
                source = title.substring(title.lastIndexOf(' - ') + 3);
                title = title.substring(0, title.lastIndexOf(' - '));
            }
            
            // 실제 발행일을 사용하되, 없거나 형식이 이상하면 최근 14일 중 하나로 임의 할당 (데이터 풍성함을 위해)
            let dateStr = "";
            if (item.pubDate) {
                const pd = new Date(item.pubDate);
                if (!isNaN(pd.getTime())) {
                    dateStr = pd.toISOString().split('T')[0];
                }
            }
            if (!dateStr) {
                dateStr = dates[index % dates.length];
            }

            return {
                id: index + 1,
                title: title.trim(),
                summary: item.contentSnippet ? item.contentSnippet.substring(0, 150) + "..." : "자세한 기사 내용은 원문 보기를 클릭하여 확인하세요.",
                date: dateStr,
                source: source.trim(),
                link: item.link
            };
        });

        // ----------------------------------------------------
        // 주간 요약 데이터 (AI를 연동하여 자동 요약하면 좋지만, 현재는 형태를 잡기 위한 하드코딩 + 동적 데이터 구조)
        // ----------------------------------------------------
        const weeklyData = [
            {
                id: "w-current",
                weekLabel: "이번 주 주요 동향 (최신)",
                title: "이번 주 AI 핵심 트렌드: 빅테크의 신모델 경쟁과 실무 도입",
                summary: "[종합 요약] 이번 주에는 주요 빅테크 기업들의 멀티모달 AI 업데이트와 더불어, 의료/금융 등 실제 산업 현장에서의 AI 도입 성과를 다룬 기사가 쏟아졌습니다. 특히 소형 언어 모델(sLLM)의 효율성이 강조되며 온디바이스 AI 시장의 경쟁이 격화되고 있습니다. 아래에서 이번 주의 핵심 기사들을 확인하세요.",
                date: dates[0]
            },
            {
                id: "w-prev1",
                weekLabel: "지난 주 주요 동향",
                title: "지난 주 AI 핵심 트렌드: 규제 법안 발효 및 AI 윤리 논쟁",
                summary: "[종합 요약] 지난 주 가장 뜨거웠던 이슈는 AI 규제였습니다. 유럽의 AI 법안 발효에 따른 글로벌 기업들의 대응 전략과 더불어, 딥페이크 악용 등 AI 윤리 문제에 대한 강력한 제재 필요성이 대두되었습니다. 보안 및 필터링 기술 관련 스타트업들의 약진이 눈에 띕니다.",
                date: dates[7]
            }
        ];

        // ----------------------------------------------------
        // 월간 요약 데이터
        // ----------------------------------------------------
        const monthlyData = [
            {
                id: "m-current",
                monthLabel: "이번 달 핵심 트렌드",
                title: "이번 달 총결산: '물리적 AI'의 부상과 AGI를 향한 발걸음",
                summary: "[종합 요약] 단순한 챗봇을 넘어 로봇 공학과 결합된 '물리적 AI'가 이번 달의 가장 큰 화두였습니다. 자율주행과 스마트 팩토리 적용 사례가 크게 늘었으며, 추론 능력이 극대화된 새로운 언어 모델들이 잇따라 발표되며 AGI(인공일반지능)에 한 걸음 더 다가섰다는 평가를 받습니다.",
                date: dates[0]
            }
        ];

        const fileContent = `// 자동으로 크롤링되어 생성된 데이터입니다.
export const mockNewsData = ${JSON.stringify(dailyNewsData, null, 4)};

export const mockWeeklyData = ${JSON.stringify(weeklyData, null, 4)};

export const mockMonthlyData = ${JSON.stringify(monthlyData, null, 4)};
`;

        fs.writeFileSync('data.js', fileContent, 'utf-8');
        console.log("뉴스 업데이트 완료! data.js 파일이 갱신되었습니다.");

    } catch (error) {
        console.error("크롤링 중 에러 발생:", error);
    }
}

fetchRealNews();