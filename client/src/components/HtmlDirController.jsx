import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function HtmlDirController() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const apply = () => {
      const dir = i18n.dir();
      document.documentElement.dir = dir;
      document.documentElement.lang = i18n.language;
    };
    apply();
    i18n.on('languageChanged', apply);
    return () => i18n.off('languageChanged', apply);
  }, [i18n]);
  return null;
}
