import Handlebars from 'handlebars'
import { getCollections, createCollection, saveItemToCollection } from '@api/storage.js'
import { publish, MSG } from '@framework/messages/messages.js'
import template from './save-collection-modal.hbs?raw'
import './save-collection-modal.css'

let currentItemId = null

export function initSaveCollectionModal() {
  // Listen for save action
  document.addEventListener('save-to-collection', (e) => {
    currentItemId = e.detail.itemId
    openSaveModal()
  })

  // Close on backdrop click
  const modal = document.getElementById('save-collection-modal')
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSaveModal()
      }
    })
  }
}

export function openSaveModal() {
  const modal = document.getElementById('save-collection-modal')
  if (!modal) return

  const collections = getCollections()
  const compiled = Handlebars.compile(template)
  modal.innerHTML = compiled({
    collections,
    hasCollections: collections.length > 0
  })

  modal.classList.add('active')

  // Bind events
  bindSaveModalEvents()
}

export function closeSaveModal() {
  const modal = document.getElementById('save-collection-modal')
  if (modal) {
    modal.classList.remove('active')
    modal.innerHTML = ''
  }
  currentItemId = null
}

function bindSaveModalEvents() {
  const modal = document.getElementById('save-collection-modal')
  if (!modal) return

  // Close button
  const closeBtn = modal.querySelector('.save-modal-close')
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSaveModal)
  }

  // Collection checkboxes
  const checkboxes = modal.querySelectorAll('.collection-checkbox')
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const collectionId = e.target.dataset.collectionId
      if (e.target.checked) {
        saveItemToCollection(currentItemId, collectionId)
      }
    })
  })

  // Create new collection
  const createBtn = modal.querySelector('.create-new-collection-btn')
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const name = prompt('Collection name:')
      if (name) {
        const newCollection = createCollection({ name })
        saveItemToCollection(currentItemId, newCollection.id)
        openSaveModal() // Refresh modal
      }
    })
  }

  // Done button
  const doneBtn = modal.querySelector('.save-modal-done')
  if (doneBtn) {
    doneBtn.addEventListener('click', closeSaveModal)
  }
}

export function triggerSaveToCollection(itemId) {
  const event = new CustomEvent('save-to-collection', {
    detail: { itemId }
  })
  document.dispatchEvent(event)
}
