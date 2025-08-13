document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcher = document.getElementById('language-switcher');

  const getStoredLanguage = () => localStorage.getItem('language') || 'en';
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
      const translations = await fetchTranslations(lang);
      updateContent(translations);
      setStoredLanguage(lang);
      languageSwitcher.value = lang;
    } catch (error) {
      console.error(error);
    }
  };

  languageSwitcher.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });

  // Set initial language
  setLanguage(getStoredLanguage());
});
