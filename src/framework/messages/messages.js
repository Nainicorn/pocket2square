// Message-driven architecture
const subscribers = {}

export function subscribe(messageType, callback) {
  if (!subscribers[messageType]) {
    subscribers[messageType] = []
  }
  subscribers[messageType].push(callback)

  // Return unsubscribe function
  return () => {
    subscribers[messageType] = subscribers[messageType].filter(cb => cb !== callback)
  }
}

export function publish(messageType, data) {
  if (subscribers[messageType]) {
    subscribers[messageType].forEach(callback => callback(data))
  }
}

// Message types
export const MSG = {
  NAVIGATE: 'NAVIGATE',
  ITEM_SAVED: 'ITEM_SAVED',
  COLLECTION_CREATED: 'COLLECTION_CREATED',
  THEME_CHANGED: 'THEME_CHANGED',
  MODAL_OPEN: 'MODAL_OPEN',
  MODAL_CLOSE: 'MODAL_CLOSE'
}
