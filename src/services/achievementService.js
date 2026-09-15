// Fully local achievement/certificate service. No network calls, no Firebase.
// Certificates (images/PDFs) are stored inline as data URLs inside IndexedDB
// records, so uploading, viewing, and deleting all work completely offline
// and persist across refreshes and browser restarts. Deleting a certificate
// removes its record (and therefore its file data) permanently — it is never
// re-seeded or restored afterwards.

import {
  deleteAchievementRecord,
  getAllAchievementRecords,
  hasSeededAchievements,
  markAchievementsSeeded,
  putAchievementRecord,
} from '../db/localAchievementsDb'

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function recordToAchievement(record) {
  return {
    id: record.id,
    category: record.category,
    date: record.date || '',
    title: record.title,
    org: record.org || '',
    url: record.url || '',
    file: record.file || null,
    fileUrl: record.file || null,
    storagePath: null,
    fileType: record.fileType || null,
    fileName: record.fileName || null,
    sortOrder: record.sortOrder ?? 0,
  }
}

function readBlobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('Could not read the selected file.'))
    reader.readAsDataURL(blob)
  })
}

async function toDataUrl(source) {
  if (typeof source === 'string') return source
  if (source instanceof Blob) return readBlobAsDataUrl(source)
  throw new Error('Unsupported certificate file source.')
}

function sanitizeFileName(name) {
  return (name || 'certificate').replace(/[^\w.-]+/g, '_')
}

async function buildFileFields(filePayload) {
  if (!filePayload?.source || !filePayload?.type) {
    return { file: null, fileType: null, fileName: null }
  }

  const dataUrl = await toDataUrl(filePayload.source)
  const fileName =
    filePayload.type === 'pdf' ? sanitizeFileName(filePayload.fileName || 'certificate.pdf') : null

  return { file: dataUrl, fileType: filePayload.type, fileName }
}

export async function fetchAchievements() {
  const records = await getAllAchievementRecords()
  return records.map(recordToAchievement)
}

export async function seedAchievementsIfEmpty(initialAchievements) {
  const alreadySeeded = await hasSeededAchievements()
  if (alreadySeeded) {
    // Achievements were seeded at some point before (even if every one of
    // them has since been deleted). Never bring deleted certificates back.
    return fetchAchievements()
  }

  for (const item of initialAchievements) {
    const record = {
      id: generateId(),
      category: item.category,
      date: item.date || '',
      title: item.title,
      org: item.org || '',
      url: item.url || '',
      file: item.file || null,
      fileType: item.fileType || null,
      fileName: item.fileName || null,
      sortOrder: item.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await putAchievementRecord(record)
  }

  await markAchievementsSeeded()
  return fetchAchievements()
}

export async function createAchievement(fields, filePayload) {
  const existing = await getAllAchievementRecords()
  const nextSortOrder = existing.reduce((max, record) => Math.max(max, record.sortOrder ?? 0), 0) + 1
  const fileFields = await buildFileFields(filePayload)

  const record = {
    id: generateId(),
    category: fields.category,
    date: fields.date,
    title: fields.title,
    org: fields.org,
    url: fields.url,
    ...fileFields,
    sortOrder: nextSortOrder,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  await putAchievementRecord(record)
  return recordToAchievement(record)
}

export async function updateAchievement(id, fields, filePayload) {
  const existing = await getAllAchievementRecords()
  const current = existing.find((record) => record.id === id)
  if (!current) {
    throw new Error('Could not find that achievement to update.')
  }

  let fileFields = {
    file: current.file ?? null,
    fileType: current.fileType ?? null,
    fileName: current.fileName ?? null,
  }

  if (filePayload?.source && filePayload?.type) {
    // Overwriting the record's file field permanently discards the old file
    // data — there is nothing left referencing it anywhere else.
    fileFields = await buildFileFields(filePayload)
  }

  const record = {
    ...current,
    category: fields.category,
    date: fields.date,
    title: fields.title,
    org: fields.org,
    url: fields.url,
    ...fileFields,
    updatedAt: Date.now(),
  }

  await putAchievementRecord(record)
  return recordToAchievement(record)
}

export async function deleteAchievement(id) {
  // Permanently removes the record (metadata + inline file data) from
  // IndexedDB. There is no soft-delete and no re-seed path, so it can never
  // reappear after a refresh or a browser restart.
  await deleteAchievementRecord(id)
}
