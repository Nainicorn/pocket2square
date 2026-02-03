import bulletinTemplate from './bulletin-board.hbs?raw'
import './bulletin-board.css'
import Handlebars from 'handlebars'

const template = Handlebars.compile(bulletinTemplate)

export const BulletinBoardLayout = {
  items: [],
  draggingPin: null,
  dragOffset: { x: 0, y: 0 },
  containerRect: null,
  boundMouseMove: null,
  boundMouseUp: null,
  boundTouchMove: null,
  boundTouchEnd: null,

  render(items = []) {
    this.items = items

    // Load saved positions from localStorage
    const savedPositions = this._loadPositions()

    const itemsWithPositions = items.map(item => {
      if (savedPositions[item.id]) {
        return { ...item, ...savedPositions[item.id] }
      }
      return {
        ...item,
        x: Math.random() * 70 + 10,      // 10-80%
        y: Math.random() * 70 + 10,      // 10-80%
        rotation: (Math.random() - 0.5) * 20 // -10 to 10 degrees
      }
    })

    return template({
      items: itemsWithPositions
    })
  },

  _bindEvents() {
    const board = document.querySelector('.__bulletin-board')
    if (!board) return

    this.containerRect = board.getBoundingClientRect()

    // Bind pin drag events
    const pins = board.querySelectorAll('.bulletin-pin')
    pins.forEach(pin => {
      pin.addEventListener('mousedown', (e) => this._onPinMouseDown(e, board))
      pin.addEventListener('touchstart', (e) => this._onPinTouchStart(e, board))
    })

    // Bind document drag events (store references for cleanup)
    this.boundMouseMove = (e) => this._onMouseMove(e)
    this.boundMouseUp = () => this._onMouseUp()
    this.boundTouchMove = (e) => this._onTouchMove(e)
    this.boundTouchEnd = () => this._onTouchEnd()

    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseup', this.boundMouseUp)
    document.addEventListener('touchmove', this.boundTouchMove, { passive: false })
    document.addEventListener('touchend', this.boundTouchEnd)
  },

  _onPinMouseDown(e, board) {
    if (e.button !== 0) return // Only left click

    this.draggingPin = e.currentTarget
    this.draggingPin.classList.add('dragging')

    const pinRect = this.draggingPin.getBoundingClientRect()
    const boardRect = board.getBoundingClientRect()

    this.dragOffset.x = e.clientX - pinRect.left
    this.dragOffset.y = e.clientY - pinRect.top

    // Bring to front
    this.draggingPin.style.zIndex = 1000
  },

  _onPinTouchStart(e, board) {
    this.draggingPin = e.currentTarget
    this.draggingPin.classList.add('dragging')

    const pinRect = this.draggingPin.getBoundingClientRect()
    const touch = e.touches[0]

    this.dragOffset.x = touch.clientX - pinRect.left
    this.dragOffset.y = touch.clientY - pinRect.top

    // Bring to front
    this.draggingPin.style.zIndex = 1000

    e.preventDefault()
  },

  _onMouseMove(e) {
    if (!this.draggingPin) return

    const boardRect = document.querySelector('.__bulletin-board').getBoundingClientRect()
    const x = e.clientX - boardRect.left - this.dragOffset.x
    const y = e.clientY - boardRect.top - this.dragOffset.y

    this._updatePinPosition(x, y, boardRect)
  },

  _onTouchMove(e) {
    if (!this.draggingPin) return

    const boardRect = document.querySelector('.__bulletin-board').getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - boardRect.left - this.dragOffset.x
    const y = touch.clientY - boardRect.top - this.dragOffset.y

    this._updatePinPosition(x, y, boardRect)
    e.preventDefault()
  },

  _updatePinPosition(x, y, boardRect) {
    const pin = this.draggingPin
    const pinRect = pin.getBoundingClientRect()

    // Constrain within bounds
    const constrainedX = Math.max(0, Math.min(x, boardRect.width - pinRect.width))
    const constrainedY = Math.max(0, Math.min(y, boardRect.height - pinRect.height))

    pin.style.left = constrainedX + 'px'
    pin.style.top = constrainedY + 'px'
  },

  _onMouseUp() {
    if (!this.draggingPin) return
    this._savePin()
  },

  _onTouchEnd() {
    if (!this.draggingPin) return
    this._savePin()
  },

  _savePin() {
    if (!this.draggingPin) return

    const boardRect = document.querySelector('.__bulletin-board').getBoundingClientRect()
    const pinRect = this.draggingPin.getBoundingClientRect()
    const itemId = this.draggingPin.dataset.id

    // Calculate percentage position
    const xPercent = ((pinRect.left - boardRect.left) / boardRect.width) * 100
    const yPercent = ((pinRect.top - boardRect.top) / boardRect.height) * 100

    // Get current rotation
    const transform = this.draggingPin.style.transform
    const rotationMatch = transform.match(/rotate\(([-\d.]+)deg\)/)
    const rotation = rotationMatch ? parseFloat(rotationMatch[1]) : 0

    // Save to localStorage
    const positions = this._loadPositions()
    positions[itemId] = { x: xPercent, y: yPercent, rotation }
    this._savePositions(positions)

    this.draggingPin.classList.remove('dragging')
    this.draggingPin.style.zIndex = ''
    this.draggingPin = null
  },

  _loadPositions() {
    try {
      const stored = localStorage.getItem('bulletin_positions')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  },

  _savePositions(positions) {
    try {
      localStorage.setItem('bulletin_positions', JSON.stringify(positions))
    } catch (e) {
      console.warn('Failed to save bulletin positions:', e)
    }
  },

  _cleanup() {
    // Remove document event listeners
    if (this.boundMouseMove) {
      document.removeEventListener('mousemove', this.boundMouseMove)
    }
    if (this.boundMouseUp) {
      document.removeEventListener('mouseup', this.boundMouseUp)
    }
    if (this.boundTouchMove) {
      document.removeEventListener('touchmove', this.boundTouchMove)
    }
    if (this.boundTouchEnd) {
      document.removeEventListener('touchend', this.boundTouchEnd)
    }

    this.boundMouseMove = null
    this.boundMouseUp = null
    this.boundTouchMove = null
    this.boundTouchEnd = null
  }
}
