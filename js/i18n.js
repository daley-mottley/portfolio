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
      const option = document.createElement('div');
      option.classList.add('language-option-item');
      option.setAttribute('data-lang', lang);

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

  const setLanguage = async (lang) => {
    try {
      document.documentElement.lang = lang;
      const translations = await fetchTranslations(lang);
      updateContent(translations);
      setStoredLanguage(lang);

      // Dispatch a custom event to notify other scripts of the language change
      const event = new CustomEvent('languageChanged', { detail: { language: lang } });
      document.dispatchEvent(event);

      // Update selected language display
      const selectedContent = selectedLanguage.querySelector('.language-option-item');
      selectedContent.innerHTML = `<i class="icon-world" style="vertical-align: middle; margin-right: 0.25em;"></i> ${lang.toUpperCase()}`;

      // Hide options
      languageOptions.style.display = 'none';
      selectedLanguage.setAttribute('aria-expanded', 'false');
    } catch (error) {
      console.error(error);
    }
  };

  selectedLanguage.addEventListener('click', (event) => {
    event.stopPropagation();
    const isExpanded = languageOptions.style.display === 'block';
    languageOptions.style.display = isExpanded ? 'none' : 'block';
    selectedLanguage.setAttribute('aria-expanded', !isExpanded);
  });

  languageOptions.addEventListener('click', (event) => {
    const target = event.target.closest('.language-option-item');
    if (target) {
      const lang = target.getAttribute('data-lang');
      setLanguage(lang);
    }
  });

  document.addEventListener('click', () => {
    if (languageOptions.style.display === 'block') {
      languageOptions.style.display = 'none';
      selectedLanguage.setAttribute('aria-expanded', 'false');
    }
  });

  // Populate language options and set initial language
  populateLanguageOptions();
  setLanguage(getStoredLanguage());
});
