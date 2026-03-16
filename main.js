import { mockNewsData, mockWeeklyData, mockMonthlyData } from './data.js';

// Define Web Component for News Card
class NewsCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || '제목 없음';
        const summary = this.getAttribute('summary') || '요약이 없습니다.';
        const date = this.getAttribute('date') || '';
        const source = this.getAttribute('source') || '출처 불명';
        const link = this.getAttribute('link') || '#';
        const isHighlight = this.hasAttribute('highlight');

        // Format date
        let formattedDate = '';
        if (date) {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                 formattedDate = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
            }
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: 100%;
                }
                .card {
                    background: var(--card-bg, #ffffff);
                    border-radius: var(--radius-lg, 0.75rem);
                    padding: 1.5rem;
                    box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    border: 1px solid var(--border-color, #e2e8f0);
                    box-sizing: border-box;
                    font-family: var(--font-family, 'Pretendard', sans-serif);
                }
                
                /* Highlight Style for Summaries */
                .card.highlight {
                    background: linear-gradient(to right bottom, #f8fafc, #eff6ff);
                    border: 2px solid var(--accent-color, #3b82f6);
                    box-shadow: var(--shadow-lg);
                    grid-column: 1 / -1; /* Span full width in grid */
                }

                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
                }
                .meta {
                    font-size: 0.875rem;
                    color: var(--text-secondary, #475569);
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.875rem;
                    font-weight: 500;
                }
                .source {
                    font-weight: 600;
                    color: var(--accent-color, #3b82f6);
                }
                
                .card.highlight .source {
                    color: #1d4ed8;
                    background: #dbeafe;
                    padding: 0.2rem 0.6rem;
                    border-radius: 1rem;
                    font-size: 0.8rem;
                }

                .title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary, #0f172a);
                    margin: 0 0 1rem 0;
                    line-height: 1.4;
                    word-break: keep-all;
                }
                
                .card.highlight .title {
                    font-size: 1.5rem;
                    color: #1e3a8a;
                }

                .summary {
                    color: var(--text-secondary, #475569);
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                    word-break: keep-all;
                }
                
                .card.highlight .summary {
                    font-size: 1.05rem;
                    color: #334155;
                    font-weight: 500;
                }

                .read-more {
                    display: inline-flex;
                    align-items: center;
                    color: var(--accent-color, #3b82f6);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                }
                .read-more:hover {
                    color: var(--accent-hover, #2563eb);
                }
                .read-more svg {
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-left: 0.25rem;
                    transition: transform 0.2s ease;
                }
                .read-more:hover svg {
                    transform: translateX(4px);
                }
            </style>
            <article class="card ${isHighlight ? 'highlight' : ''}">
                <div class="meta">
                    <span class="source">${source}</span>
                    <time datetime="${date}">${formattedDate}</time>
                </div>
                <h2 class="title">${title}</h2>
                <p class="summary">${summary}</p>
                ${link !== '#' && !isHighlight ? `
                <div>
                    <a href="${link}" class="read-more" target="_blank" rel="noopener noreferrer">
                        기사 원문 보기
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
                ` : ''}
            </article>
        `;
    }
}

customElements.define('news-card', NewsCard);

// Application Logic
class App {
    constructor() {
        this.newsData = mockNewsData;
        this.weeklyData = mockWeeklyData;
        this.monthlyData = mockMonthlyData;
        
        // Extract unique dates and sort them descending (newest first)
        this.uniqueDates = [...new Set(this.newsData.map(item => item.date))]
                            .filter(date => date) // Remove empty dates
                            .sort((a, b) => new Date(b) - new Date(a));
                            
        this.selectedDate = this.uniqueDates[0]; // Select the most recent date by default
        
        this.selectedWeekId = this.weeklyData[0]?.id;
        this.selectedMonthId = this.monthlyData[0]?.id;
        
        this.viewMode = 'daily'; // 'daily', 'weekly', or 'monthly'

        this.dateListEl = document.getElementById('date-list');
        this.newsFeedEl = document.getElementById('news-feed');
        this.currentDateHeadingEl = document.getElementById('current-date-heading');
        
        this.tabDailyBtn = document.getElementById('tab-daily');
        this.tabWeeklyBtn = document.getElementById('tab-weekly');
        this.tabMonthlyBtn = document.getElementById('tab-monthly');

        this.init();
    }

    init() {
        this.tabDailyBtn.addEventListener('click', () => this.switchTab('daily'));
        this.tabWeeklyBtn.addEventListener('click', () => this.switchTab('weekly'));
        if(this.tabMonthlyBtn) {
            this.tabMonthlyBtn.addEventListener('click', () => this.switchTab('monthly'));
        }
        
        this.renderView();
    }
    
    switchTab(mode) {
        if (this.viewMode === mode) return;
        this.viewMode = mode;
        
        this.tabDailyBtn.classList.remove('active');
        this.tabWeeklyBtn.classList.remove('active');
        if(this.tabMonthlyBtn) this.tabMonthlyBtn.classList.remove('active');

        if (mode === 'daily') {
            this.tabDailyBtn.classList.add('active');
        } else if (mode === 'weekly') {
            this.tabWeeklyBtn.classList.add('active');
        } else if (mode === 'monthly' && this.tabMonthlyBtn) {
            this.tabMonthlyBtn.classList.add('active');
        }
        
        this.renderView();
    }

    renderView() {
        this.renderSidebarItems();
        if (this.viewMode === 'daily') {
            this.renderNewsForDate(this.selectedDate);
        } else if (this.viewMode === 'weekly') {
            this.renderNewsForWeek(this.selectedWeekId);
        } else if (this.viewMode === 'monthly') {
            this.renderNewsForMonth(this.selectedMonthId);
        }
    }

    renderSidebarItems() {
        this.dateListEl.innerHTML = '';
        
        if (this.viewMode === 'daily') {
            this.uniqueDates.forEach(date => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
                
                button.textContent = formattedDate;
                if (date === this.selectedDate) {
                    button.classList.add('active');
                }

                button.addEventListener('click', () => {
                    this.selectedDate = date;
                    this.updateSidebarActiveState();
                    this.renderNewsForDate(date);
                });

                li.appendChild(button);
                this.dateListEl.appendChild(li);
            });
        } else if (this.viewMode === 'weekly') {
            this.weeklyData.forEach(week => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                
                button.textContent = week.weekLabel;
                if (week.id === this.selectedWeekId) {
                    button.classList.add('active');
                }

                button.addEventListener('click', () => {
                    this.selectedWeekId = week.id;
                    this.updateSidebarActiveState();
                    this.renderNewsForWeek(week.id);
                });

                li.appendChild(button);
                this.dateListEl.appendChild(li);
            });
        } else if (this.viewMode === 'monthly') {
             this.monthlyData.forEach(month => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                
                button.textContent = month.monthLabel;
                if (month.id === this.selectedMonthId) {
                    button.classList.add('active');
                }

                button.addEventListener('click', () => {
                    this.selectedMonthId = month.id;
                    this.updateSidebarActiveState();
                    this.renderNewsForMonth(month.id);
                });

                li.appendChild(button);
                this.dateListEl.appendChild(li);
            });
        }
    }

    updateSidebarActiveState() {
        const buttons = this.dateListEl.querySelectorAll('button');
        if (this.viewMode === 'daily') {
            buttons.forEach((btn, index) => {
                if (this.uniqueDates[index] === this.selectedDate) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } else if (this.viewMode === 'weekly') {
            buttons.forEach((btn, index) => {
                if (this.weeklyData[index].id === this.selectedWeekId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } else if (this.viewMode === 'monthly') {
             buttons.forEach((btn, index) => {
                if (this.monthlyData[index].id === this.selectedMonthId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    renderNewsForDate(date) {
        const filteredNews = this.newsData.filter(item => item.date === date);
        this.newsFeedEl.innerHTML = '';

        const dateObj = new Date(date);
        const headingDate = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
        this.currentDateHeadingEl.textContent = `${headingDate} 뉴스`;

        if (filteredNews.length === 0) {
            this.newsFeedEl.innerHTML = '<p style="color: var(--text-secondary); text-align: center; width: 100%; grid-column: 1 / -1; padding: 3rem 0;">해당 날짜의 뉴스가 없습니다.</p>';
            return;
        }

        // Add a daily highlight/summary card at the top (mocked for now, could be AI generated later)
        const highlightCard = document.createElement('news-card');
        highlightCard.setAttribute('title', `${headingDate} 주요 동향 브리핑`);
        highlightCard.setAttribute('summary', `오늘 수집된 총 ${filteredNews.length}건의 기사 중 가장 주목받는 이슈들을 아래에서 확인하세요.`);
        highlightCard.setAttribute('source', '에디터 데일리 브리핑');
        highlightCard.setAttribute('date', date);
        highlightCard.toggleAttribute('highlight', true);
        this.newsFeedEl.appendChild(highlightCard);

        filteredNews.forEach(news => {
            const card = document.createElement('news-card');
            card.setAttribute('title', news.title);
            card.setAttribute('summary', news.summary);
            card.setAttribute('date', news.date);
            card.setAttribute('source', news.source);
            card.setAttribute('link', news.link);
            
            this.newsFeedEl.appendChild(card);
        });
        
        if (window.innerWidth < 768 && this.newsFeedEl.children.length > 0) {
            this.currentDateHeadingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    renderNewsForWeek(weekId) {
        const week = this.weeklyData.find(w => w.id === weekId);
        this.newsFeedEl.innerHTML = '';
        
        if (!week) return;
        
        this.currentDateHeadingEl.textContent = `${week.weekLabel} 주요 뉴스`;
        
        // 1. Show the Weekly Summary Highlight Card at the top
        const highlightCard = document.createElement('news-card');
        highlightCard.setAttribute('title', week.title);
        highlightCard.setAttribute('summary', week.summary);
        highlightCard.setAttribute('date', week.date);
        highlightCard.setAttribute('source', '주간 에디터 요약');
        highlightCard.toggleAttribute('highlight', true);
        this.newsFeedEl.appendChild(highlightCard);

        // 2. Show actual news articles from the past 7 days relative to the week's date
        // (Simple filtering logic for demonstration: get approx 10 random/recent articles)
        const weekArticles = this.newsData.slice(0, 12); // Mocking weekly articles
        
        weekArticles.forEach(news => {
            const card = document.createElement('news-card');
            card.setAttribute('title', news.title);
            card.setAttribute('summary', news.summary);
            card.setAttribute('date', news.date);
            card.setAttribute('source', news.source);
            card.setAttribute('link', news.link);
            this.newsFeedEl.appendChild(card);
        });
        
        if (window.innerWidth < 768) {
            this.currentDateHeadingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    renderNewsForMonth(monthId) {
        const month = this.monthlyData.find(m => m.id === monthId);
        this.newsFeedEl.innerHTML = '';
        
        if (!month) return;
        
        this.currentDateHeadingEl.textContent = `${month.monthLabel} 주요 뉴스`;
        
        // 1. Show the Monthly Summary Highlight Card at the top
        const highlightCard = document.createElement('news-card');
        highlightCard.setAttribute('title', month.title);
        highlightCard.setAttribute('summary', month.summary);
        highlightCard.setAttribute('date', month.date);
        highlightCard.setAttribute('source', '월간 에디터 요약');
        highlightCard.toggleAttribute('highlight', true);
        this.newsFeedEl.appendChild(highlightCard);

         // 2. Show actual news articles for the month
        // (Simple filtering logic for demonstration: get approx 15 articles)
        const monthArticles = this.newsData.slice(10, 25); // Mocking monthly articles
        
        monthArticles.forEach(news => {
            const card = document.createElement('news-card');
            card.setAttribute('title', news.title);
            card.setAttribute('summary', news.summary);
            card.setAttribute('date', news.date);
            card.setAttribute('source', news.source);
            card.setAttribute('link', news.link);
            this.newsFeedEl.appendChild(card);
        });
        
        if (window.innerWidth < 768) {
            this.currentDateHeadingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});