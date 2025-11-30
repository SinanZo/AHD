import { useContext } from 'react';
import { ThemeLangContext } from './useThemeAndLang.shared';

export default function useThemeAndLang() {
  const ctx = useContext(ThemeLangContext);
  if (!ctx) throw new Error('useThemeAndLang must be used within ThemeLangProvider');
  return ctx;
}
