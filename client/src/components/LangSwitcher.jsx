'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LangSwitcher(){
  const { i18n } = useTranslation()
  const locale = (i18n.language || 'ar').startsWith('ar') ? 'ar' : 'en'
  const next = locale === 'ar' ? 'en' : 'ar'
  const onClick = () => {
    try {
      i18n.changeLanguage(next)
      // persist for reloads
      localStorage.setItem('i18nextLng', next)
      // update html dir/lang immediately
      const html = document.documentElement
      if (html) { html.lang = next; html.dir = next === 'ar' ? 'rtl' : 'ltr' }
    } catch (e) { void e; }
  }
  return (
    <button type="button" className="chip px-3 py-2 rounded-full text-sm focus-ring" onClick={onClick} aria-label="Switch language">
      {locale === 'ar' ? 'EN' : 'AR'}
    </button>
  )
}
