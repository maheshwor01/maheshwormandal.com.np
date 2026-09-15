// Fully local, permanent storage for achievements/certificates using IndexedDB.
// Nothing here ever talks to a network or a remote backend. Everything —
// including uploaded certificate files (stored inline as data URLs) — lives
// in the browser's IndexedDB, so it survives page refreshes AND full browser
// restarts, and disappears only when the user clears site data or explicitly
// deletes a record through this module.

const DB_NAME = 'portfolio-local-db'
const DB_VERSION = 1
const STORE_ACHIEVEMENTS = 'achievements'
const STORE_META = 'meta'
const SEEDED_KEY = 'achievements-seeded'

let dbPromise = null

function openDb() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_ACHIEVEMENTS)) {
        db.createObjectStore(STORE_ACHIEVEMENTS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open local database.'))
  })

  return dbPromise
}

function runTransaction(storeName, mode, executor) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode)
        const store = tx.objectStore(storeName)
        let result

        tx.oncomplete = () => resolve(result)
        tx.onerror = () => reject(tx.error || new Error('Local database transaction failed.'))
        tx.onabort = () => reject(tx.error || new Error('Local database transaction was aborted.'))

        try {
          result = executor(store)
        } catch (error) {
          reject(error)
        }
      }),
  )
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllAchievementRecords() {
  const records = await runTransaction(STORE_ACHIEVEMENTS, 'readonly', (store) =>
    requestToPromise(store.getAll()),
  )
  return (records || []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export async function putAchievementRecord(record) {
  await runTransaction(STORE_ACHIEVEMENTS, 'readwrite', (store) => store.put(record))
  return record
}

export async function deleteAchievementRecord(id) {
  await runTransaction(STORE_ACHIEVEMENTS, 'readwrite', (store) => store.delete(id))
}

export async function hasSeededAchievements() {
  const meta = await runTransaction(STORE_META, 'readonly', (store) =>
    requestToPromise(store.get(SEEDED_KEY)),
  )
  return Boolean(meta?.value)
}

export async function markAchievementsSeeded() {
  await runTransaction(STORE_META, 'readwrite', (store) =>
    store.put({ key: SEEDED_KEY, value: true }),
  )
}
