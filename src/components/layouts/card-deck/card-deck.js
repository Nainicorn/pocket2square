import Handlebars from 'handlebars'
import { publish, MSG } from '@framework/messages/messages.js'
import template from './card-deck.hbs?raw'
import './card-deck.css'

const compiled = Handlebars.compile(template)

export const CardDeckLayout = {
  items: [],
  currentIndex: 0,
  isFlipped: false,

  render(items = []) {
    this.items = items
    this.currentIndex = 0
    this.isFlipped = false

    return compiled({
      items: this.items,
      currentItem: this.items[0] || null,
      currentIndex: this.currentIndex,
      totalItems: this.items.length
    })
  },

  _bindEvents() {
    const deck = document.querySelector('.__card-deck')
    if (!deck) return

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        this._nextCard()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this._previousCard()
      }
    })

    // Card flip
    const card = deck.querySelector('.deck-card')
    if (card) {
      card.addEventListener('click', () => this._toggleFlip())
    }

    // Navigation buttons
    const prevBtn = deck.querySelector('.deck-prev')
    const nextBtn = deck.querySelector('.deck-next')

    if (prevBtn) prevBtn.addEventListener('click', () => this._previousCard())
    if (nextBtn) nextBtn.addEventListener('click', () => this._nextCard())

    // Save button
    const saveBtn = deck.querySelector('.deck-save-btn')
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const item = this.items[this.currentIndex]
        if (item) {
          publish(MSG.MODAL_OPEN, item)
        }
      })
    }

    // Swipe support (touch)
    let touchStartX = 0
    deck.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
    })

    deck.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX - touchEndX

      if (diff > 50) {
        this._nextCard()
      } else if (diff < -50) {
        this._previousCard()
      }
    })
  },

  _nextCard() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++
      this.isFlipped = false
      this._updateDeck()
    }
  },

  _previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.isFlipped = false
      this._updateDeck()
    }
  },

  _toggleFlip() {
    this.isFlipped = !this.isFlipped
    const card = document.querySelector('.__card-deck .deck-card')
    if (card) {
      card.classList.toggle('flipped')
    }
  },

  _updateDeck() {
    const deck = document.querySelector('.__card-deck')
    if (!deck) return

    const item = this.items[this.currentIndex]
    const cardContent = deck.querySelector('.deck-card-content')
    const cardBack = deck.querySelector('.deck-card-back')
    const counter = deck.querySelector('.deck-counter')

    if (cardContent) {
      cardContent.innerHTML = `
        ${item.type === 'image' ? `<img src="${item.imageUrl}" alt="${item.alt}">` : `<video src="${item.imageUrl}" muted loop playsinline></video>`}
      `
    }

    if (cardBack) {
      cardBack.textContent = item.description || 'No message'
    }

    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`
    }

    // Update button states
    const prevBtn = deck.querySelector('.deck-prev')
    const nextBtn = deck.querySelector('.deck-next')

    if (prevBtn) prevBtn.disabled = this.currentIndex === 0
    if (nextBtn) nextBtn.disabled = this.currentIndex === this.items.length - 1

    // Trigger animation
    const card = deck.querySelector('.deck-card')
    if (card) {
      card.classList.add('transitioning')
      setTimeout(() => {
        card.classList.remove('transitioning')
      }, 300)
    }
  },

  _cleanup() {
    document.removeEventListener('keydown', () => {})
  }
}
