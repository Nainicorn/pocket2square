import { publish, MSG } from '@framework/messages/messages.js'

const pages = {}
let currentPage = null

export function registerPage(name, pageObject) {
  pages[name] = pageObject
}

export function goTo(pageName, params = {}) {
  if (!pages[pageName]) {
    console.error(`Page "${pageName}" not found`)
    return
  }

  // Clean up current page
  if (currentPage && currentPage._cleanup) {
    currentPage._cleanup()
  }

  // Render new page
  const appMain = document.getElementById('app-main')
  const html = pages[pageName].render(params)
  appMain.innerHTML = html

  // Bind events
  pages[pageName]._bindEvents()

  // Update current page reference
  currentPage = pages[pageName]

  // Update URL (hash-based routing)
  window.location.hash = `#/${pageName}`

  // Publish navigation event
  publish(MSG.NAVIGATE, { page: pageName, params })
}

// Handle browser back/forward
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(2) // Remove '#/'
  const pageName = hash || 'gallery'
  goTo(pageName)
})

// Initialize router
export function initRouter(defaultPage = 'gallery') {
  const hash = window.location.hash.slice(2)
  goTo(hash || defaultPage)
}
