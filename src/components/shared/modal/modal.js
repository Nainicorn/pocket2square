import modalTemplate from './modal.hbs?raw'
import './modal.css'
import { subscribe, publish, MSG } from '@framework/messages/messages.js'
import Handlebars from 'handlebars'

const template = Handlebars.compile(modalTemplate)

let currentItem = null

export function initModal() {
  // Subscribe to modal open events
  subscribe(MSG.MODAL_OPEN, (item) => {
    open(item)
  })

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close()
    }
  })
}

function open(item) {
  currentItem = item

  // Create modal if doesn't exist
  let modalEl = document.getElementById('modal')
  if (!modalEl) {
    modalEl = document.createElement('div')
    modalEl.id = 'modal'
    document.body.appendChild(modalEl)
  }

  modalEl.innerHTML = template({ item })
  modalEl.classList.add('active')
  document.body.style.overflow = 'hidden'

  // Bind events
  const closeBtn = modalEl.querySelector('.modal-close')
  if (closeBtn) {
    closeBtn.addEventListener('click', close)
  }

  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) close()
  })

  const saveBtn = modalEl.querySelector('.save-btn')
  if (saveBtn) {
    saveBtn.addEventListener('click', () => save(item))
  }
}

function close() {
  const modalEl = document.getElementById('modal')
  if (modalEl) {
    modalEl.classList.remove('active')
    document.body.style.overflow = ''
    publish(MSG.MODAL_CLOSE)
  }
}

function save(item) {
  // Save logic
  publish(MSG.ITEM_SAVED, item)
  // Heartbeat animation
  const saveBtn = document.querySelector('#modal .save-btn')
  if (saveBtn) {
    saveBtn.classList.add('saved')
  }
}
