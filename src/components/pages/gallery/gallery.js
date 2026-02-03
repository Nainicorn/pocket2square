import galleryTemplate from './gallery.hbs?raw'
import './gallery.css'
import { publish, MSG } from '@framework/messages/messages.js'
import { contentData } from '@data/content.js'
import Handlebars from 'handlebars'

const template = Handlebars.compile(galleryTemplate)

export const GalleryPage = {
  // Local state
  items: [],
  filters: { tone: 'all', tags: [] },

  render(params = {}) {
    this.items = [...contentData]
    return template({
      items: this.items,
      hasDaily: true
    })
  },

  _bindEvents() {
    // Card click -> open modal
    const cards = document.querySelectorAll('.__gallery .gallery-card')
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const itemId = parseInt(card.dataset.id)
        const item = this.items.find(i => i.id === itemId)
        if (item) {
          publish(MSG.MODAL_OPEN, item)
        }
      })
    })

    // Shuffle button
    const shuffleBtn = document.querySelector('.__gallery .shuffle-btn')
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => this._shuffle())
    }
  },

  _shuffle() {
    // Fisher-Yates shuffle
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.items[i], this.items[j]] = [this.items[j], this.items[i]]
    }
    // Re-render
    document.getElementById('app-main').innerHTML = this.render()
    this._bindEvents()
  },

  _cleanup() {
    // Clean up event listeners if needed
  }
}
