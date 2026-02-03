import Handlebars from 'handlebars'
import { getCollection, removeItemFromCollection } from '@api/storage.js'
import { publish, MSG } from '@framework/messages/messages.js'
import { goTo } from '@framework/router/router.js'
import { contentData } from '@data/content.js'
import template from './collection.hbs?raw'
import './collection.css'

export const CollectionPage = {
  currentCollectionId: null,

  render(params = {}) {
    this.currentCollectionId = params.id

    const collection = getCollection(this.currentCollectionId)
    if (!collection) {
      return '<div class="__collection"><p>Collection not found</p></div>'
    }

    // Map collection item IDs to actual item data
    const items = collection.items
      .map(itemId => contentData.find(item => item.id === itemId))
      .filter(item => item) // Remove undefined items

    const compiled = Handlebars.compile(template)
    return compiled({
      collection,
      items,
      itemCount: items.length,
      createdDate: new Date(collection.createdAt).toLocaleDateString()
    })
  },

  _bindEvents() {
    const collectionEl = document.querySelector('.__collection')
    if (!collectionEl) return

    // Back button
    const backBtn = collectionEl.querySelector('.back-btn')
    if (backBtn) {
      backBtn.addEventListener('click', () => goTo('gallery'))
    }

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

  _cleanup() {
    this.currentCollectionId = null
  }
}
