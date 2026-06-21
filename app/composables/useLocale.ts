export function useLocale() {
  return useState<'en' | 'de'>('locale', () => {
    let lang = 'en';
    if (import.meta.server) {
      const headers = useRequestHeaders(['accept-language']);
      const acceptLanguage = headers['accept-language'];
      if (acceptLanguage) {
        const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
        if (preferred === 'de') {
          lang = 'de';
        }
      }
    } else {
      if (navigator.language.toLowerCase().startsWith('de')) {
        lang = 'de';
      }
    }
    return lang as 'en' | 'de';
  });
}
