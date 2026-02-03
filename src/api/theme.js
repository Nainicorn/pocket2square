import { publish, MSG } from '@framework/messages/messages.js'

let currentTheme = 'dark'

export function initTheme() {
  // Get stored theme or detect system preference
  const stored = localStorage.getItem('theme') || 'auto'

  if (stored === 'auto') {
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else {
    currentTheme = stored
  }

  applyTheme(currentTheme)

  // Bind toggle button
  const toggleBtn = document.getElementById('themeToggle')
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggle)
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'auto' || !localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
}

export function toggle() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', currentTheme)
  applyTheme(currentTheme)
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  currentTheme = theme

  // Update toggle button icon visibility
  const sun = document.querySelector('.theme-toggle .icon-sun')
  const moon = document.querySelector('.theme-toggle .icon-moon')

  if (sun && moon) {
    if (theme === 'light') {
      sun.style.display = 'none'
      moon.style.display = 'block'
    } else {
      sun.style.display = 'block'
      moon.style.display = 'none'
    }
  }

  // Publish theme change event
  publish(MSG.THEME_CHANGED, { theme })
}

export function getTheme() {
  return currentTheme
}
