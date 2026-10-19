    const translations = {
      en: {
        title:'Daley Mottley — AI made practical',description:'Daley Mottley helps entrepreneurs and business owners apply AI in practical ways that save time and simplify work.',
        navAbout:'About',navNotes:'AI Ready Tips ↗',navContact:'Contact ↗',eyebrow:'AI consultant · Barbados & everywhere',
        headline:'I help people<br>make AI <em>useful.</em>',intro:'Practical AI guidance for entrepreneurs and business owners who want to save time, simplify their work, and feel confident using AI.',
        primaryCta:'Let’s talk <span aria-hidden="true">↗</span>',secondaryCta:'Get AI Ready Tips <span aria-hidden="true">↗</span>',
        sideTitle:'The short version',sideCopy:'Less repetitive work. More room for the work that matters. AI made practical, one workflow at a time.',
        findMe:'Find me around the web',aboutTag:'01 / A little about my work',aboutHeadline:'Good technology should make work feel <em>lighter.</em>',
        aboutCopy:'I help entrepreneurs figure out where AI can genuinely help, then turn the useful ideas into simple workflows. I also share clear, practical tips so you can make better use of AI without needing to become a technical expert.',latestArticleLabel:'Latest from AI Ready Tips',
        aboutLink:'Read the latest article ↗',footerNote:'Made with care in Barbados.',footerContact:'Have a project in mind? Say hello ↗'
      },
      es: {
        title:'Daley Mottley — IA práctica',description:'Daley Mottley ayuda a emprendedores y empresarios a aplicar la IA de forma práctica para ahorrar tiempo y simplificar el trabajo.',
        navAbout:'Sobre mí',navNotes:'Consejos de IA ↗',navContact:'Contacto ↗',eyebrow:'Consultor de IA · Barbados y el mundo',
        headline:'Ayudo a las personas<br>a hacer útil la <em>IA.</em>',intro:'Orientación práctica sobre IA para emprendedores y empresarios que quieren ahorrar tiempo, simplificar su trabajo y usar la IA con confianza. Sin complicaciones técnicas.',
        primaryCta:'Hablemos <span aria-hidden="true">↗</span>',secondaryCta:'Recibe consejos de IA <span aria-hidden="true">↗</span>',
        sideTitle:'En pocas palabras',sideCopy:'Menos tareas repetitivas. Más tiempo para lo que importa. IA práctica, un flujo de trabajo a la vez.',
        findMe:'Encuéntrame en internet',aboutTag:'01 / Un poco sobre mi trabajo',aboutHeadline:'La buena tecnología debería hacer el trabajo más <em>fácil.</em>',
        aboutCopy:'Ayudo a emprendedores a descubrir dónde la IA puede aportar valor real y a convertir las mejores ideas en flujos de trabajo sencillos. También comparto consejos claros y prácticos para aprovechar la IA sin ser especialista en tecnología.',latestArticleLabel:'Lo más reciente de AI Ready Tips',
        aboutLink:'Lee el artículo más reciente ↗',footerNote:'Hecho con cariño en Barbados.',footerContact:'¿Tienes un proyecto? Hablemos ↗'
      }
    };
    function setLanguage(lang) {
      const copy = translations[lang] || translations.en;
      document.documentElement.lang = lang;
      document.title = copy.title;
      document.querySelector('meta[name="description"]').content = copy.description;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (copy[key]) el.textContent = copy[key];
      });
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        if (copy[key]) el.innerHTML = copy[key];
      });
      document.querySelectorAll('[data-lang]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
      try { localStorage.setItem('daley-site-language', lang); } catch (_) {}
      const url = new URL(window.location.href);
      if (lang === 'es') url.searchParams.set('lang','es'); else url.searchParams.delete('lang');
      history.replaceState({}, '', url);
    }
    document.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
    let initial = new URLSearchParams(location.search).get('lang');
    if (!initial) { try { initial = localStorage.getItem('daley-site-language'); } catch (_) {} }
    setLanguage(initial === 'es' ? 'es' : 'en');
    document.getElementById('year').textContent = new Date().getFullYear();

    async function loadLatestArticle() {
      const card = document.getElementById('latest-article');
      const title = document.getElementById('latest-article-title');
      const excerpt = document.getElementById('latest-article-excerpt');
      const link = document.getElementById('latest-article-link');
      try {
        const response = await fetch('/api/latest-article', { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Latest article request failed');
        const article = await response.json();
        if (!article.title || !article.excerpt || !article.url) throw new Error('Incomplete article data');
        title.textContent = article.title;
        excerpt.textContent = article.excerpt;
        link.href = article.url;
        card.hidden = false;
        document.querySelector(".latest-section").hidden = false;
      } catch (_) {
        // Keep the section clean if the RSS feed is temporarily unavailable.
        card.hidden = true;
      }
    }
    loadLatestArticle();


    // Send assessment submissions directly to Daley by email.
    const assessmentForm = document.getElementById('assessment-form');
    if (assessmentForm) {
      assessmentForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (!assessmentForm.reportValidity()) return;

        const submitButton = assessmentForm.querySelector('button[type="submit"], input[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';
        const status = document.getElementById('assessment-status');
        const values = new FormData(assessmentForm);
        const payload = {
          name: String(values.get('name') || '').trim(),
          email: String(values.get('email') || '').trim(),
          business: String(values.get('business') || '').trim(),
          workflow: String(values.get('workflow') || '').trim(),
          time: String(values.get('time') || '').trim(),
          challenge: String(values.get('challenge') || '').trim(),
          _subject: 'New AI Workflow Assessment Request',
          _template: 'table',
          _replyto: String(values.get('email') || '').trim()
        };

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending request…';
        }
        if (status) {
          status.hidden = false;
          status.textContent = 'Sending your request…';
          status.setAttribute('role', 'status');
        }

        try {
          const response = await fetch('https://formsubmit.co/ajax/daley.mottley@hotmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.success === 'false' || result.success === false) {
            throw new Error(result.message || 'Email service rejected the request');
          }

          assessmentForm.reset();
          if (status) {
            status.textContent = 'Thank you. Your assessment request has been sent. I’ll be in touch soon.';
            status.setAttribute('role', 'status');
          }
        } catch (_) {
          if (status) {
            status.textContent = 'Unable to send your request. Please try again.';
            status.setAttribute('role', 'alert');
          }
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText || 'Send assessment request';
          }
        }
      });
    }
