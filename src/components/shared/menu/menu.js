import menuTemplate from './menu.hbs?raw'
import './menu.css'
import { goTo } from '@framework/router/router.js'
import { getCollections, createCollection } from '@api/storage.js'
import { subscribe, publish, MSG } from '@framework/messages/messages.js'
import Handlebars from 'handlebars'

const template = Handlebars.compile(menuTemplate)

let isOpen = false

export function initMenu() {
  const menuEl = document.getElementById('hamburgerMenu')
  renderMenu()

  // Bind hamburger button
  const hamburgerBtn = document.getElementById('hamburgerBtn')
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu)
  }

  // Close on backdrop click
  menuEl.addEventListener('click', (e) => {
    if (e.target === menuEl) {
      closeMenu()
    }
  })

  // Update menu when collections change
  subscribe(MSG.COLLECTION_CREATED, renderMenu)
}

function renderMenu() {
  const menuEl = document.getElementById('hamburgerMenu')
  const collections = getCollections()

  menuEl.innerHTML = template({ collections })

  // Bind events
  bindMenuEvents()
}

function bindMenuEvents() {
  // Collection links
  const collectionLinks = document.querySelectorAll('.__menu .collection-link')
  collectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const collectionId = link.dataset.id
      goTo('collection', { id: collectionId })
      closeMenu()
    })
  })

  // Create collection button
  const createBtn = document.querySelector('.__menu .create-collection-btn')
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const name = prompt('Collection name:')
      if (name && name.trim()) {
        createCollection({ name: name.trim() })
        renderMenu() // Refresh menu to show new collection
      }
    })
  }

  // Settings link
  const settingsLink = document.querySelector('.__menu .settings-link')
  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault()
      goTo('settings')
      closeMenu()
    })
  }
}

function toggleMenu() {
  isOpen ? closeMenu() : openMenu()
}

function openMenu() {
  const menuEl = document.getElementById('hamburgerMenu')
  menuEl.classList.add('open')
  isOpen = true
  document.body.style.overflow = 'hidden'
}

function closeMenu() {
  const menuEl = document.getElementById('hamburgerMenu')
  menuEl.classList.remove('open')
  isOpen = false
  document.body.style.overflow = ''
}
