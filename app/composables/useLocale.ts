export function useLocale() {
  return useState<'en' | 'de'>('locale', () => {
    let lang: 'en' | 'de' = 'en';
    
    if (import.meta.server) {
      const headers = useRequestHeaders(['accept-language']);
      const acceptLanguage = headers['accept-language'];
      if (acceptLanguage) {
        // Find the first language that is either English or German
        const match = acceptLanguage.match(/(en|de)/i);
        if (match?.[1]?.toLowerCase() === 'de') {
          lang = 'de';
        }
      }
    } else {
      // Check all preferred languages in the browser
      const langs = navigator.languages || [navigator.language];
      for (const l of langs) {
        const lower = l.toLowerCase();
        if (lower.startsWith('en')) {
          lang = 'en';
          break;
        }
        if (lower.startsWith('de')) {
          lang = 'de';
          break;
        }
      }
    }
    
    return lang;
  });
}
