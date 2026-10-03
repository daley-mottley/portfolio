document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcherContainer = document.getElementById('language-switcher-container');
  const selectedLanguage = document.getElementById('selected-language');
  const languageOptions = document.getElementById('language-options');

  const languages = {
    en: { name: 'English', flag: 'gb' },
    es: { name: 'Español', flag: 'es' },
    fr: { name: 'Français', flag: 'fr' },
    de: { name: 'Deutsch', flag: 'de' },
    zh: { name: '中文', flag: 'cn' },
    ja: { name: '日本語', flag: 'jp' },
    pt: { name: 'Português', flag: 'pt' },
    fa: { name: 'فارسی', flag: 'ir' }
  };

  const populateLanguageOptions = () => {
    languageOptions.innerHTML = ''; // Clear existing options
    for (const [lang, { name, flag }] of Object.entries(languages)) {
      const option = document.createElement('li');
      option.classList.add('language-option-item');
      option.setAttribute('data-lang', lang);
      option.setAttribute('role', 'option');
      option.setAttribute('tabindex', '0');
      option.setAttribute('aria-selected', 'false');

      const img = document.createElement('img');
      img.src = `https://flagcdn.com/${flag}.svg`;
      img.alt = name;

      const span = document.createElement('span');
      span.textContent = name;

      option.appendChild(img);
      option.appendChild(span);
      languageOptions.appendChild(option);
    }
  };

  const getStoredLanguage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    return langFromUrl || localStorage.getItem('language') || 'en';
  };
  const setStoredLanguage = (lang) => localStorage.setItem('language', lang);

  const fetchTranslations = async (lang) => {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    return response.json();
  };

  const updateContent = (translations) => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        if (element.hasAttribute('placeholder-i18n')) {
          element.setAttribute('placeholder', translations[key]);
        } else if (element.tagName === 'META') {
            element.setAttribute('content', translations[key]);
        }
        else {
          element.innerHTML = translations[key];
        }
      }
    });
    // Update title separately
    if (translations.title) {
        document.title = translations.title;
    }
  };

  const toggleMenu = () => {
    const isExpanded = selectedLanguage.getAttribute('aria-expanded') === 'true';
    selectedLanguage.setAttribute('aria-expanded', !isExpanded);
    languageOptions.style.display = isExpanded ? 'none' : 'block';
    if (!isExpanded) {
        const firstOption = languageOptions.querySelector('.language-option-item');
        if (firstOption) firstOption.focus();
    }
  };

  const closeMenu = () => {
    selectedLanguage.setAttribute('aria-expanded', 'false');
    languageOptions.style.display = 'none';
  };

  const setLanguage = async (lang) => {
    try {
      document.documentElement.lang = lang;
      const translations = await fetchTranslations(lang);
      updateContent(translations);
      setStoredLanguage(lang);

      // Update ARIA label and selection state
      const langName = languages[lang]?.name || lang.toUpperCase();
      selectedLanguage.setAttribute('aria-label', `Select language. Current: ${langName}`);

      const options = languageOptions.querySelectorAll('.language-option-item');
      options.forEach(opt => {
        opt.setAttribute('aria-selected', opt.getAttribute('data-lang') === lang);
      });

      // Dispatch a custom event to notify other scripts of the language change
      const event = new CustomEvent('languageChanged', { detail: { language: lang } });
      document.dispatchEvent(event);

      // Update selected language display
      const selectedContent = selectedLanguage.querySelector('.language-option-item');
      selectedContent.innerHTML = `<i class="icon-world" style="vertical-align: middle; margin-right: 0.25em;"></i> ${lang.toUpperCase()}`;

      // Hide options
      closeMenu();
    } catch (error) {
      console.error(error);
    }
  };

  selectedLanguage.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  selectedLanguage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  });

  languageOptions.addEventListener('click', (event) => {
    const target = event.target.closest('.language-option-item');
    if (target) {
      const lang = target.getAttribute('data-lang');
      setLanguage(lang);
    }
  });

  languageOptions.addEventListener('keydown', (event) => {
    const items = Array.from(languageOptions.querySelectorAll('.language-option-item'));
    const currentIndex = items.indexOf(document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
    } else if (event.key === 'Escape') {
      closeMenu();
      selectedLanguage.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const lang = document.activeElement.getAttribute('data-lang');
      if (lang) setLanguage(lang);
      selectedLanguage.focus();
    }
  });

  document.addEventListener('click', () => {
    closeMenu();
  });

  // Populate language options and set initial language
  populateLanguageOptions();
  setLanguage(getStoredLanguage());
});
