// Mock Data for AI News
const mockNewsData = [
    {
        id: 1,
        title: "Google Announces New Multimodal Capabilities for Gemini",
        summary: "Google's latest update to the Gemini AI model introduces enhanced reasoning across text, code, images, and audio, significantly improving its performance on complex reasoning tasks.",
        date: "2026-03-16",
        source: "TechCrunch",
        link: "#"
    },
    {
        id: 2,
        title: "OpenAI Releases Next-Gen Reasoning Model",
        summary: "OpenAI has officially launched a new generation of its flagship model, focusing heavily on logical deduction and advanced problem-solving capabilities, reducing hallucinations by 40%.",
        date: "2026-03-15",
        source: "The Verge",
        link: "#"
    },
    {
        id: 3,
        title: "AI Regulation Framework Agreed Upon in EU",
        summary: "The European Union has finalized the technical details of the AI Act, setting a global precedent for regulating artificial intelligence based on risk levels.",
        date: "2026-03-14",
        source: "Reuters",
        link: "#"
    },
    {
        id: 4,
        title: "Breakthrough in AI-Driven Drug Discovery",
        summary: "Researchers have utilized a novel deep learning architecture to identify a promising candidate for treating neurodegenerative diseases in a fraction of the traditional time.",
        date: "2026-03-13",
        source: "Nature",
        link: "#"
    },
    {
        id: 5,
        title: "New Open-Source LLM Outperforms Proprietary Models",
        summary: "A community-driven AI research lab has released an open-source Large Language Model that tops the charts in several key benchmarks, challenging the dominance of closed-source models.",
        date: "2026-03-12",
        source: "Hugging Face Blog",
        link: "#"
    },
    {
        id: 6,
        title: "Robotics Startup Integrates LLMs for Natural Interaction",
        summary: "A leading robotics company demonstrated a new humanoid robot capable of fluid, unscripted conversations and complex task execution by directly integrating large language models.",
        date: "2026-03-11",
        source: "Wired",
        link: "#"
    }
];

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
        const title = this.getAttribute('title') || 'No Title';
        const summary = this.getAttribute('summary') || 'No summary available.';
        const date = this.getAttribute('date') || '';
        const source = this.getAttribute('source') || 'Unknown Source';
        const link = this.getAttribute('link') || '#';

        // Format date to a more readable format (e.g., Mar 16, 2026)
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
                    border: 1px solid var(--border-color, #e5e7eb);
                    box-sizing: border-box;
                }
                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
                }
                .meta {
                    font-size: 0.875rem;
                    color: var(--text-secondary, #6c757d);
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-weight: 500;
                }
                .title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary, #111827);
                    margin: 0 0 1rem 0;
                    line-height: 1.4;
                }
                .summary {
                    color: var(--text-secondary, #4b5563);
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }
                .read-more {
                    display: inline-flex;
                    align-items: center;
                    color: var(--accent-color, #4f46e5);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: color 0.2s ease;
                }
                .read-more:hover {
                    color: var(--accent-hover, #4338ca);
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
                        Read Full Article
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </article>
        `;
    }
}

// Register the custom element
customElements.define('news-card', NewsCard);

// Render the news feed
function renderNewsFeed() {
    const feedContainer = document.getElementById('news-feed');
    if (!feedContainer) return;

    // Clear existing content just in case
    feedContainer.innerHTML = '';

    mockNewsData.forEach(news => {
        const card = document.createElement('news-card');
        card.setAttribute('title', news.title);
        card.setAttribute('summary', news.summary);
        card.setAttribute('date', news.date);
        card.setAttribute('source', news.source);
        card.setAttribute('link', news.link);
        
        feedContainer.appendChild(card);
    });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderNewsFeed);