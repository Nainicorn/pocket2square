import { publish, MSG } from '@framework/messages/messages.js'

const STORAGE_KEYS = {
  COLLECTIONS: 'p2s_collections',
  ITEMS: 'p2s_items',
  SAVED_ITEMS: 'p2s_saved_items',
  DAILY_CARD: 'p2s_daily_card',
  PREFERENCES: 'p2s_preferences'
}

// Collections CRUD
export function createCollection(data) {
  const collections = getCollections()
  const newCollection = {
    id: generateId(),
    name: data.name,
    description: data.description || '',
    theme: data.theme || { palette: 'sunset' },
    layout: 'gallery',
    galleryStyle: 'flat',
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  collections.push(newCollection)
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections))

  publish(MSG.COLLECTION_CREATED, newCollection)
  return newCollection
}

export function getCollections() {
  const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS)
  return data ? JSON.parse(data) : []
}

export function getCollection(id) {
  const collections = getCollections()
  return collections.find(c => c.id === id)
}

export function updateCollection(id, updates) {
  const collections = getCollections()
  const index = collections.findIndex(c => c.id === id)

  if (index !== -1) {
    collections[index] = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections))
    return collections[index]
  }
  return null
}

export function deleteCollection(id) {
  const collections = getCollections().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections))
}

// Items management
export function saveItemToCollection(itemId, collectionId) {
  const collection = getCollection(collectionId)
  if (collection && !collection.items.includes(itemId)) {
    collection.items.push(itemId)
    updateCollection(collectionId, { items: collection.items })
    publish(MSG.ITEM_SAVED, { itemId, collectionId })
  }
}

export function removeItemFromCollection(itemId, collectionId) {
  const collection = getCollection(collectionId)
  if (collection) {
    collection.items = collection.items.filter(id => id !== itemId)
    updateCollection(collectionId, { items: collection.items })
  }
}

// Daily card
export function getDailyCard() {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_CARD)
  return data ? JSON.parse(data) : null
}

export function setDailyCard(cardData) {
  localStorage.setItem(STORAGE_KEYS.DAILY_CARD, JSON.stringify(cardData))
}

// Utility
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
