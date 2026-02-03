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
  },

  _cleanup() {
    // Clean up event listeners if needed
  }
}
