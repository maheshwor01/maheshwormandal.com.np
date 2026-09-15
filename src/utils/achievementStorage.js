const DELETED_IDS_KEY = 'portfolio-deleted-achievement-ids'

export function loadDeletedAchievementIds() {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : []
  } catch {
    return []
  }
}

export function persistDeletedAchievementId(id) {
  const deleted = new Set(loadDeletedAchievementIds())
  deleted.add(Number(id))
  localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...deleted]))
}

export function loadAchievementsFromStorage(initialAchievements) {
  const deleted = new Set(loadDeletedAchievementIds())
  return initialAchievements.filter((a) => !deleted.has(a.id))
}

export function getNextAchievementId(achievements, fallback = 3) {
  if (achievements.length === 0) return fallback
  return Math.max(...achievements.map((a) => a.id)) + 1
}
