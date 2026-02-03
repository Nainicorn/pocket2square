import galleryTemplate from './gallery.hbs?raw'
import './gallery.css'
import { publish, MSG } from '@framework/messages/messages.js'
import { contentData } from '@data/content.js'
import { getDailyCard, setDailyCard } from '@api/storage.js'
import Handlebars from 'handlebars'

const template = Handlebars.compile(galleryTemplate)

export const GalleryPage = {
  // Local state
  items: [],
  filters: { tone: 'all', tags: [] },

  render(params = {}) {
    this.items = [...contentData]

    // Get or create daily card
    const dailyCard = this._getDailyCard()
    const itemsWithDaily = dailyCard ? [dailyCard, ...this.items] : this.items

    return template({
      items: itemsWithDaily,
      hasDaily: !!dailyCard,
      dailyCard
    })
  },

  _getDailyCard() {
    const today = new Date().toISOString().split('T')[0]
    const stored = getDailyCard()

    // If stored card is from today, return it
    if (stored && stored.date === today) {
      return stored.item
    }

    // Pick a random item for today
    const randomItem = contentData[Math.floor(Math.random() * contentData.length)]
    setDailyCard({
      date: today,
      item: randomItem
    })

    return randomItem
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
    const appMain = document.getElementById('app-main')
    const gallery = appMain.querySelector('.__gallery')

    // Add shuffle animation
    if (gallery) {
      gallery.style.opacity = '0.5'
      gallery.style.transform = 'scale(0.98)'
    }

    // Fisher-Yates shuffle
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.items[i], this.items[j]] = [this.items[j], this.items[i]]
    }

    // Re-render after brief delay for animation
    setTimeout(() => {
      appMain.innerHTML = this.render()
      this._bindEvents()

      // Trigger re-layout animation
      const newGallery = appMain.querySelector('.__gallery')
      if (newGallery) {
        newGallery.style.opacity = '0'
        newGallery.style.transform = 'scale(0.98)'
        // Force reflow
        void newGallery.offsetHeight
        newGallery.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        newGallery.style.opacity = '1'
        newGallery.style.transform = 'scale(1)'
      }
    }, 100)
  },

  _cleanup() {
    // Clean up event listeners if needed
  }
}
