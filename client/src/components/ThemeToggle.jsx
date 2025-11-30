'use client'
import React from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle(){
  const { theme, setTheme } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="chip px-3 py-2 rounded-full text-sm focus-ring"
      onClick={() => setTheme(next)}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
