import { mockNewsData } from './data.js';

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

        // Format date (e.g., 2026. 3. 16.)
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

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
                .title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary, #0f172a);
                    margin: 0 0 1rem 0;
                    line-height: 1.4;
                    word-break: keep-all;
                }
                .summary {
                    color: var(--text-secondary, #475569);
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                    word-break: keep-all;
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
            <article class="card">
                <div class="meta">
                    <span class="source">${source}</span>
                    <time datetime="${date}">${formattedDate}</time>
                </div>
                <h2 class="title">${title}</h2>
                <p class="summary">${summary}</p>
                <div>
                    <a href="${link}" class="read-more" target="_blank" rel="noopener noreferrer">
                        기사 원문 보기
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </article>
        `;
    }
}

customElements.define('news-card', NewsCard);

// Application Logic
class App {
    constructor() {
        this.newsData = mockNewsData;
        // Extract unique dates and sort them descending (newest first)
        this.uniqueDates = [...new Set(this.newsData.map(item => item.date))].sort((a, b) => new Date(b) - new Date(a));
        this.selectedDate = this.uniqueDates[0]; // Select the most recent date by default

        this.dateListEl = document.getElementById('date-list');
        this.newsFeedEl = document.getElementById('news-feed');
        this.currentDateHeadingEl = document.getElementById('current-date-heading');

        this.init();
    }

    init() {
        this.renderSidebarDates();
        this.renderNewsForDate(this.selectedDate);
    }

    renderSidebarDates() {
        this.dateListEl.innerHTML = '';
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
    }

    updateSidebarActiveState() {
        const buttons = this.dateListEl.querySelectorAll('button');
        buttons.forEach((btn, index) => {
            if (this.uniqueDates[index] === this.selectedDate) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    renderNewsForDate(date) {
        const filteredNews = this.newsData.filter(item => item.date === date);
        this.newsFeedEl.innerHTML = '';

        const dateObj = new Date(date);
        const headingDate = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
        this.currentDateHeadingEl.textContent = `${headingDate} 주요 뉴스`;

        if (filteredNews.length === 0) {
            this.newsFeedEl.innerHTML = '<p style="color: var(--text-secondary); text-align: center; width: 100%; grid-column: 1 / -1; padding: 3rem 0;">해당 날짜의 뉴스가 없습니다.</p>';
            return;
        }

        filteredNews.forEach(news => {
            const card = document.createElement('news-card');
            card.setAttribute('title', news.title);
            card.setAttribute('summary', news.summary);
            card.setAttribute('date', news.date);
            card.setAttribute('source', news.source);
            card.setAttribute('link', news.link);
            
            this.newsFeedEl.appendChild(card);
        });
        
        // Mobile UX: Scroll to top of news feed when a date is clicked
        if (window.innerWidth < 768) {
            this.currentDateHeadingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});