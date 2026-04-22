import React, { useState, useEffect } from 'react'
import { CATEGORIES } from '../data/prayers'

const REQUEST_CATEGORIES = CATEGORIES.filter(c => c.key !== 'ALL' && c.key !== 'ANSWERED')

export default function PrayerModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'GUIDANCE',
    anonymous: false,
  })
  const [submitting, setSubmitting] = useState(false)

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    setSubmitting(true)
    try {
      await onSubmit?.(form)
      setForm({ title: '', content: '', category: 'GUIDANCE', anonymous: false })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-serif text-navy text-2xl font-bold">Share a Prayer Request</h2>
              <p className="text-sm text-gray-500 mt-1 italic">"Do not be anxious about anything…" — Philippians 4:6</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 ml-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="A short title for your request"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-400">*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white"
              >
                {REQUEST_CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Request <span className="text-red-400">*</span></label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Share what's on your heart. Be as specific as you'd like."
                required
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.content.length} characters</p>
            </div>

            {/* Anonymous toggle */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <input
                type="checkbox"
                id="anonymous"
                name="anonymous"
                checked={form.anonymous}
                onChange={handleChange}
                className="w-4 h-4 accent-gold"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-600 cursor-pointer">
                <span className="font-semibold">Post anonymously</span>
                <span className="block text-xs text-gray-400">Your name will not be shown</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !form.title.trim() || !form.content.trim()}
                className="flex-1 bg-navy text-white font-semibold py-2.5 rounded-xl hover:bg-gold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
