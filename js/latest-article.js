(() => {
  const fallbackUrl = 'https://aireadytips.substack.com/';
  const card = document.querySelector('#latest-article .article-card');
  const titleEl = document.getElementById('article-title');
  const excerptEl = document.getElementById('article-excerpt');
  const dateEl = document.getElementById('article-date');
  const linkEl = document.getElementById('article-link');
  if (!card || !titleEl || !excerptEl || !dateEl || !linkEl) return;

  const showFallback = () => {
    titleEl.textContent = 'AI Ready Tips';
    excerptEl.textContent = 'Practical AI tips for entrepreneurs and business owners. Visit the newsletter to explore the latest issue.';
    dateEl.textContent = 'AI READY TIPS';
    linkEl.href = fallbackUrl;
    card.setAttribute('aria-busy', 'false');
  };

  fetch('/api/latest-article', { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error('Latest article feed unavailable');
      return response.json();
    })
    .then((article) => {
      const url = new URL(article.url);
      if (url.hostname !== 'aireadytips.substack.com' || !article.title) throw new Error('Invalid article response');
      titleEl.textContent = String(article.title).replace(/\s+/g, ' ').trim();
      excerptEl.textContent = String(article.excerpt || 'Open the latest AI Ready Tips article for practical ideas you can apply to your business.').replace(/\s+/g, ' ').trim();
      excerptEl.classList.remove('article-loading');
      dateEl.textContent = article.date ? new Date(article.date).toLocaleDateString(document.documentElement.lang || 'en', { year: 'numeric', month: 'short', day: 'numeric' }) : 'AI READY TIPS';
      linkEl.href = url.href;
      card.setAttribute('aria-busy', 'false');
    })
    .catch((error) => {
      console.warn('Could not load latest AI Ready Tips article:', error);
      showFallback();
    });
})();
