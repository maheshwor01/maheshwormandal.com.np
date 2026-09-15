import { useEffect, useRef, useState } from 'react'
import { initialAchievements } from '../data/initialAchievements'
import {
  createAchievement,
  deleteAchievement,
  fetchAchievements,
  seedAchievementsIfEmpty,
  updateAchievement,
} from '../services/achievementService'

function bannerBackground(seedText) {
  let hash = 0
  for (let i = 0; i < seedText.length; i++) hash = seedText.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `linear-gradient(135deg, hsla(${hue},70%,55%,0.35), hsla(${(hue + 60) % 360},70%,55%,0.35))`
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'certificate', label: 'Certificate' },
  { id: 'experience', label: 'Experience' },
]

export default function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [revealedCards, setRevealedCards] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [certViewOpen, setCertViewOpen] = useState(false)
  const [certViewAchievement, setCertViewAchievement] = useState(null)
  const [certViewFallback, setCertViewFallback] = useState(null)
  const [exportText, setExportText] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy to Clipboard')
  const [formError, setFormError] = useState('')
  const [modalTitle, setModalTitle] = useState('Add Achievement')
  const [form, setForm] = useState({
    id: '',
    category: 'certificate',
    date: '',
    title: '',
    org: '',
    url: '',
  })
  const [imgPreview, setImgPreview] = useState({ show: false, src: '' })
  const [pdfPreview, setPdfPreview] = useState({ show: false, name: '' })
  const pendingFile = useRef({
    data: null,
    type: null,
    fileName: null,
    file: null,
    storagePath: null,
    unchanged: false,
  })
  const fileInputRef = useRef(null)


  useEffect(() => {
    let cancelled = false

    async function loadAchievements() {
      try {
        let data = await fetchAchievements()
        if (data.length === 0) {
          data = await seedAchievementsIfEmpty(initialAchievements)
        }
        if (!cancelled) {
          setAchievements(data)
        }
      } catch (error) {
        if (!cancelled) {
          setFormError(error.message || 'Could not load achievements from local storage.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAchievements()
    return () => {
      cancelled = true
    }
  }, [])

  const resetUploadPreview = () => {
    setImgPreview({ show: false, src: '' })
    setPdfPreview({ show: false, name: '' })
    pendingFile.current = {
      data: null,
      type: null,
      fileName: null,
      file: null,
      storagePath: null,
      unchanged: false,
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const visible = achievements.filter((a) => currentFilter === 'all' || a.category === currentFilter)

  const openAchieveModal = (existingId) => {
    setFormError('')
    resetUploadPreview()

    if (existingId) {
      const a = achievements.find((x) => x.id === existingId)
      if (!a) return
      setModalTitle('Edit Achievement')
      setForm({
        id: a.id,
        category: a.category,
        date: a.date || '',
        title: a.title,
        org: a.org || '',
        url: a.url || '',
      })
      if (a.file && a.fileType === 'image') {
        pendingFile.current = {
          data: a.file,
          type: 'image',
          fileName: null,
          file: null,
          storagePath: a.storagePath,
          unchanged: true,
        }
        setImgPreview({ show: true, src: a.file })
      } else if (a.file && a.fileType === 'pdf') {
        pendingFile.current = {
          data: a.file,
          type: 'pdf',
          fileName: a.fileName || 'certificate.pdf',
          file: null,
          storagePath: a.storagePath,
          unchanged: true,
        }
        setPdfPreview({ show: true, name: a.fileName || 'certificate.pdf' })
      }
    } else {
      setModalTitle('Add Achievement')
      setForm({ id: '', category: 'certificate', date: '', title: '', org: '', url: '' })
    }
    setModalOpen(true)
  }

  const closeAchieveModal = () => setModalOpen(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
    const isImage = file.type.startsWith('image/')

    if (!isPdf && !isImage) {
      setFormError('Please choose an image (JPG/PNG) or a PDF file.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      resetUploadPreview()
      pendingFile.current = {
        data: reader.result,
        type: isPdf ? 'pdf' : 'image',
        fileName: isPdf ? file.name : null,
        file,
        storagePath: null,
        unchanged: false,
      }
      if (isPdf) {
        setPdfPreview({ show: true, name: file.name })
      } else {
        setImgPreview({ show: true, src: reader.result })
      }
    }
    reader.onerror = () => {
      setFormError('Could not read that file — please try again or use a different file.')
    }
    reader.readAsDataURL(file)
  }

  const saveAchievement = async () => {
    setFormError('')
    const title = form.title.trim()
    const org = form.org.trim()
    if (!title || !org) {
      setFormError('Please fill in both Title and Issuer / Organization.')
      return
    }

    const fields = {
      category: form.category,
      date: form.date.trim(),
      title,
      org,
      url: form.url.trim(),
    }

    const filePayload = pendingFile.current.file
      ? {
          source: pendingFile.current.file,
          type: pendingFile.current.type,
          fileName: pendingFile.current.fileName,
        }
      : null

    setSaving(true)
    try {
      if (form.id) {
        const updated = await updateAchievement(
          form.id,
          fields,
          filePayload,
          pendingFile.current.storagePath,
        )
        setAchievements((prev) => prev.map((item) => (item.id === form.id ? updated : item)))
      } else {
        const created = await createAchievement(fields, filePayload)
        setAchievements((prev) => [...prev, created])
      }
      closeAchieveModal()
    } catch (error) {
      setFormError(error.message || 'Could not save achievement. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const openCertViewer = (achievement) => {
    setCertViewAchievement(achievement)
    setCertViewFallback(null)
    setCertViewOpen(true)
  }

  const closeCertViewer = () => {
    setCertViewOpen(false)
    setCertViewAchievement(null)
    setCertViewFallback(null)
  }

  const handleDelete = async (id) => {
    if (deleteConfirm[id]) {
      const achievement = achievements.find((a) => a.id === id)
      try {
        await deleteAchievement(id, achievement?.storagePath)
        setAchievements((prev) => prev.filter((a) => a.id !== id))
        setDeleteConfirm((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      } catch (error) {
        setFormError(error.message || 'Could not delete achievement. Please try again.')
      }
      return
    }

    setDeleteConfirm((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setDeleteConfirm((prev) => {
        if (!prev[id]) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
    }, 3000)
  }

  const toggleRevealed = (id) => {
    setRevealedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const openExport = () => {
    setExportText(JSON.stringify(achievements, null, 2))
    setCopyLabel('Copy to Clipboard')
    setExportOpen(true)
  }

  const copyExport = () => {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy to Clipboard'), 1500)
    }).catch(() => {})
  }

  return (
    <>
      <section id="achievements" className="section section-alt">
        <div className="wrap">
          <div className="eyebrow">// 04 achievements</div>
          <h2 className="title">
            My <span className="accent">Achievements</span>
          </h2>
          <p className="section-lead">
            Certificates I&apos;ve earned and hands-on experience I&apos;ve picked up along the way.
          </p>

          <div className="tabs-nav" id="achieveTabsNav" role="tablist">
            {FILTER_TABS.map(({ id, label }) => (
              <button
                key={id}
                className={`tab-btn${currentFilter === id ? ' active' : ''}`}
                data-filter={id}
                role="tab"
                aria-selected={currentFilter === id}
                onClick={() => setCurrentFilter(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="achieve-manage-row">
            <button className="manage-btn" id="exportBtn" type="button" onClick={openExport}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16v16H4z" />
                <path d="M4 9h16M9 9v11" />
              </svg>
              Export
            </button>
          </div>

          {formError && !modalOpen && (
            <p
              className="form-error"
              style={{
                color: '#e05555',
                fontFamily: 'var(--mono)',
                fontSize: '0.78rem',
                margin: '0 0 14px',
              }}
            >
              {formError}
            </p>
          )}

          <div className="achieve-grid" id="achieveGrid">
            {!loading && achievements.length === 0 && (
              <div className="achieve-empty">
                No achievements added yet — use the &quot;Add Achievement&quot; tile below to add your first certificate or experience.
              </div>
            )}
            {achievements.length > 0 && visible.length === 0 && (
              <div className="achieve-empty">Nothing in this category yet.</div>
            )}

            {visible.map((a) => {
              const hasImage = a.fileType === 'image' && a.file
              const hasPdf = a.fileType === 'pdf' && a.file
              const usingFallbackFile = !a.url && (hasPdf || hasImage)
              const effectiveUrl = a.url || (usingFallbackFile ? a.file : '')
              const revealed = revealedCards[a.id]

              return (
                <div key={a.id} className={`achieve-card${revealed ? ' revealed' : ''}`} data-category={a.category} data-id={a.id}>
                  <div
                    className="achieve-banner"
                    style={hasImage ? undefined : { background: bannerBackground(a.org || a.title) }}
                    onClick={(e) => {
                      if (e.target.closest('.achieve-card-actions') || e.target.closest('.visit-cert')) return
                      toggleRevealed(a.id)
                    }}
                  >
                    {hasImage && <img className="achieve-img" src={a.file} alt={a.title} />}
                    {hasPdf && (
                      <div className="banner-pdf">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
                          <path d="M14 3v6h6" />
                        </svg>
                        <span className="banner-logo">PDF Certificate</span>
                      </div>
                    )}
                    {!hasPdf && (
                      <span className="banner-logo">
                        {a.category === 'experience' ? '💼 ' : ''}
                        {a.org || 'Achievement'}
                      </span>
                    )}
                    <div className="achieve-overlay">
                      <h3>{a.title}</h3>
                      {effectiveUrl &&
                        (usingFallbackFile ? (
                          <button type="button" className="visit-cert" data-view-file={a.id} onClick={() => openCertViewer(a)}>
                            View Certificate{' '}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                              <path d="M14 3h7v7M21 3l-9 9M5 5h6v0H5v14h14v-6" />
                            </svg>
                          </button>
                        ) : (
                          <a className="visit-cert" href={effectiveUrl} target="_blank" rel="noopener">
                            View Certificate{' '}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                              <path d="M14 3h7v7M21 3l-9 9M5 5h6v0H5v14h14v-6" />
                            </svg>
                          </a>
                        ))}
                      <div className="achieve-card-actions">
                        <button type="button" className="edit-ach" data-id={a.id} onClick={() => openAchieveModal(a.id)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger delete-ach"
                          data-id={a.id}
                          onClick={() => handleDelete(a.id)}
                        >
                          {deleteConfirm[a.id] ? 'Confirm delete?' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="achieve-meta">
                    <span className="project-tag">{a.category === 'experience' ? 'Experience' : 'Certificate'}</span>
                    <span className="achieve-date">📅 {a.date || ''}</span>
                  </div>
                </div>
              )
            })}

            <div className="add-tile" id="addAchieveTile" onClick={() => openAchieveModal()}>
              <div className="plus">+</div>
              <span>Add Achievement</span>
            </div>
          </div>
        </div>
      </section>

      <div className={`modal-backdrop${modalOpen ? ' open' : ''}`} id="achieveModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget) closeAchieveModal() }}>
        <div className="modal-box">
          <div className="modal-head">
            <h3 id="achieveModalTitle">{modalTitle}</h3>
            <button className="modal-close" id="achieveModalClose" type="button" aria-label="Close" onClick={closeAchieveModal}>
              ✕
            </button>
          </div>
          <form
            id="achieveForm"
            onSubmit={(e) => {
              e.preventDefault()
              saveAchievement()
            }}
          >
            <input type="hidden" id="achId" value={form.id} readOnly />
            <div className="form-row">
              <label htmlFor="achImageInput">Certificate / Photo (optional)</label>
              <img
                id="achImgPreview"
                className={`upload-preview${imgPreview.show ? ' show' : ''}`}
                src={imgPreview.src || undefined}
                alt="Preview"
              />
              <div className={`upload-preview pdf-preview${pdfPreview.show ? ' show' : ''}`} id="achPdfPreview">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <path d="M14 3v6h6" />
                </svg>
                <span id="achPdfName">{pdfPreview.name}</span>
              </div>
              <div className="upload-drop">
                <span className="upload-hint">
                  Click or drop an image or PDF here — leave empty to use a plain color banner
                </span>
                <input ref={fileInputRef} type="file" id="achImageInput" accept="image/*,.pdf,application/pdf" onChange={handleFileChange} />
              </div>
            </div>
            <div className="form-row form-row-inline">
              <div>
                <label htmlFor="achCategory">Type</label>
                <div className="select-row">
                  <select
                    id="achCategory"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="certificate">Certificate</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="achDate">Date</label>
                <input
                  type="text"
                  id="achDate"
                  placeholder="2026-01-15 or Jan 2026 – Present"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="achTitle">Title</label>
              <input
                type="text"
                id="achTitle"
                placeholder="e.g. Python for Data Science"
                required
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="form-row">
              <label htmlFor="achOrg">Issuer / Organization</label>
              <input
                type="text"
                id="achOrg"
                placeholder="e.g. DataCamp"
                required
                value={form.org}
                onChange={(e) => setForm((prev) => ({ ...prev, org: e.target.value }))}
              />
            </div>
            <div className="form-row">
              <label htmlFor="achUrl">Certificate / Verification Link (optional)</label>
              <input
                type="url"
                id="achUrl"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              />
            </div>
            {formError && (
              <p
                className="form-error"
                style={{
                  color: '#e05555',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.78rem',
                  margin: '-6px 0 14px',
                }}
              >
                {formError}
              </p>
            )}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" id="achCancelBtn" onClick={closeAchieveModal}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" id="achSaveBtn" disabled={saving} onClick={saveAchievement}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal-backdrop${exportOpen ? ' open' : ''}`} id="exportModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget) setExportOpen(false) }}>
        <div className="modal-box">
          <div className="modal-head">
            <h3>Export Achievements Data</h3>
            <button className="modal-close" id="exportModalClose" type="button" aria-label="Close" onClick={() => setExportOpen(false)}>
              ✕
            </button>
          </div>
          <div className="export-box">
            <textarea id="exportTextarea" readOnly value={exportText} />
          </div>
          <p className="export-note">
            Achievements are saved permanently in this browser&apos;s local storage. Use this export as a backup copy
            of your current achievement records.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn btn-primary" id="copyExportBtn" style={{ flex: 1, justifyContent: 'center' }} onClick={copyExport}>
              {copyLabel}
            </button>
          </div>
        </div>
      </div>

      <div className={`modal-backdrop${certViewOpen ? ' open' : ''}`} id="certViewModalBackdrop" onClick={(e) => { if (e.target === e.currentTarget) closeCertViewer() }}>
        <div className="modal-box cert-view-box">
          <div className="modal-head">
            <h3 id="certViewTitle">{certViewAchievement?.title || 'Certificate'}</h3>
            <button className="modal-close" id="certViewModalClose" type="button" aria-label="Close" onClick={closeCertViewer}>
              ✕
            </button>
          </div>
          <div className="cert-view-body" id="certViewBody">
            {certViewAchievement?.fileType === 'image' && certViewAchievement.file && !certViewFallback && (
              <img
                alt={certViewAchievement.title || 'Certificate'}
                src={certViewAchievement.file}
                onError={() => setCertViewFallback('image')}
              />
            )}
            {certViewAchievement?.fileType === 'pdf' && certViewAchievement.file && certViewFallback !== 'pdf' && (
              <iframe
                title={certViewAchievement.title || 'Certificate'}
                src={certViewAchievement.file}
                onError={() => setCertViewFallback('pdf')}
              />
            )}
            {certViewFallback === 'image' && (
              <div className="cert-view-fallback">
                <p>The certificate image couldn&apos;t be previewed here.</p>
              </div>
            )}
            {certViewFallback === 'pdf' && (
              <div className="cert-view-fallback">
                <p>The certificate PDF couldn&apos;t be previewed here.</p>
              </div>
            )}
            {certViewAchievement?.file && (
              <a
                className="cert-view-open-link"
                href={certViewAchievement.file}
                target="_blank"
                rel="noopener"
              >
                Open certificate in new tab ↗
              </a>
            )}
            {!certViewAchievement?.file && certViewAchievement?.url && (
              <div className="cert-view-fallback">
                <p>This certificate links to an external page.</p>
                <a href={certViewAchievement.url} target="_blank" rel="noopener">
                  Open link ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
