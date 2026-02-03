import '@css/main.css'
import '@css/animations.css'

import { registerPage, initRouter } from '@framework/router/router.js'
import { initModal } from '@components/shared/modal/modal.js'
import { initMenu } from '@components/shared/menu/menu.js'
import { initSaveCollectionModal } from '@components/shared/save-collection-modal/save-collection-modal.js'

// Import page objects
import { GalleryPage } from '@components/pages/gallery/gallery.js'
import { CollectionPage } from '@components/pages/collection/collection.js'

// Register pages
registerPage('gallery', GalleryPage)
registerPage('collection', CollectionPage)

// Initialize app when DOM is ready
function initApp() {
  initModal()
  initMenu()
  initSaveCollectionModal()
  initRouter('gallery')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
