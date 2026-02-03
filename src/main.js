import '@css/main.css'
import '@css/animations.css'

import { registerPage, initRouter } from '@framework/router/router.js'
import { initModal } from '@components/shared/modal/modal.js'
import { initMenu } from '@components/shared/menu/menu.js'
import { initTheme } from '@api/theme.js'

// Import page objects
import { GalleryPage } from '@components/pages/gallery/gallery.js'

// Register pages
registerPage('gallery', GalleryPage)

// Initialize app when DOM is ready
function initApp() {
  initTheme()
  initModal()
  initMenu()
  initRouter('gallery')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
