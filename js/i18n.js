document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcherContainer = document.getElementById('language-switcher-container');
  const selectedLanguage = document.getElementById('selected-language');
  const languageOptions = document.getElementById('language-options');

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

      // Update selected flag
      const selectedImg = selectedLanguage.querySelector('img');
      const flag = lang === 'en' ? 'gb' : lang;
      selectedImg.src = `https://flagcdn.com/${flag}.svg`;
      selectedImg.alt = lang === 'en' ? 'English' : 'Español';

      // Hide options
      languageOptions.style.display = 'none';
    } catch (error) {
      console.error(error);
    }
  };

  selectedLanguage.addEventListener('click', (event) => {
    event.stopPropagation();
    languageOptions.style.display = languageOptions.style.display === 'block' ? 'none' : 'block';
  });

  languageOptions.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'IMG') {
      const lang = target.getAttribute('data-lang');
      setLanguage(lang);
    }
  });

  document.addEventListener('click', () => {
    languageOptions.style.display = 'none';
  });

  // Set initial language
  setLanguage(getStoredLanguage());
});
