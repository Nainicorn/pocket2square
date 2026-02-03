import Handlebars from 'handlebars'
import { getCollection, removeItemFromCollection, updateCollection } from '@api/storage.js'
import { publish, MSG } from '@framework/messages/messages.js'
import { goTo } from '@framework/router/router.js'
import { contentData } from '@data/content.js'
import { CardDeckLayout } from '@layouts/card-deck/card-deck.js'
import template from './collection.hbs?raw'
import './collection.css'

export const CollectionPage = {
  currentCollectionId: null,
  currentLayout: 'gallery',
  layoutComponent: null,

  render(params = {}) {
    this.currentCollectionId = params.id

    const collection = getCollection(this.currentCollectionId)
    if (!collection) {
      return '<div class="__collection"><p>Collection not found</p></div>'
    }

    // Get the layout from collection or default to gallery
    this.currentLayout = collection.layout || 'gallery'

    // Map collection item IDs to actual item data
    const items = collection.items
      .map(itemId => contentData.find(item => item.id === itemId))
      .filter(item => item) // Remove undefined items

    // Render based on layout
    if (this.currentLayout === 'deck') {
      this.layoutComponent = CardDeckLayout
      return this.layoutComponent.render(items)
    }

    // Default gallery layout
    const compiled = Handlebars.compile(template)
    return compiled({
      collection,
      items,
      itemCount: items.length,
      createdDate: new Date(collection.createdAt).toLocaleDateString()
    })
  },

  _bindEvents() {
    // Handle different layouts
    if (this.currentLayout === 'deck') {
      if (this.layoutComponent) {
        this.layoutComponent._bindEvents()
      }
      return
    }

    // Gallery layout events
    const collectionEl = document.querySelector('.__collection')
    if (!collectionEl) return

    // Back button
    const backBtn = collectionEl.querySelector('.back-btn')
    if (backBtn) {
      backBtn.addEventListener('click', () => goTo('gallery'))
    }

    // Layout switcher
    const layoutBtns = collectionEl.querySelectorAll('.layout-btn')
    layoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const layout = btn.dataset.layout
        this._switchLayout(layout)
      })
    })

    // Item click to view in modal
    const cards = collectionEl.querySelectorAll('.collection-card')
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.dataset.itemId)
        const item = contentData.find(i => i.id === itemId)
        if (item) {
          publish(MSG.MODAL_OPEN, item)
        }
      })
    })

    // Delete item button
    const deleteButtons = collectionEl.querySelectorAll('.delete-item-btn')
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const itemId = parseInt(btn.dataset.itemId)
        if (confirm('Remove this item from collection?')) {
          removeItemFromCollection(itemId, this.currentCollectionId)
          // Re-render
          const appMain = document.getElementById('app-main')
          const html = this.render({ id: this.currentCollectionId })
          appMain.innerHTML = html
          this._bindEvents()
        }
      })
    })
  },

  _switchLayout(newLayout) {
    const collection = getCollection(this.currentCollectionId)
    if (collection) {
      updateCollection(this.currentCollectionId, { layout: newLayout })
      // Re-render with new layout
      const appMain = document.getElementById('app-main')
      const html = this.render({ id: this.currentCollectionId })
      appMain.innerHTML = html
      this._bindEvents()
    }
  },

  _cleanup() {
    this.currentCollectionId = null
  }
}
