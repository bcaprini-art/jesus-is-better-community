import React, { useState } from 'react'
import PrayerCard from '../components/PrayerCard'
import PrayerModal from '../components/PrayerModal'
import { PRAYERS, CATEGORIES } from '../data/prayers'
import { useAuth } from '../App'
import { Link } from 'react-router-dom'

export default function Prayers() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('ALL')
  const [sort, setSort] = useState('recent')
  const [modalOpen, setModalOpen] = useState(false)
  const [localPrayers, setLocalPrayers] = useState(PRAYERS)
  const [visible, setVisible] = useState(6)

  const filtered = localPrayers
    .filter(p => {
      if (activeTab === 'ALL') return true
      if (activeTab === 'ANSWERED') return p.answered
      return p.category === activeTab
    })
    .sort((a, b) => {
      if (sort === 'recent') return new Date(b.createdAt) - new Date(a.createdAt)
      return b.prayCount - a.prayCount
    })

  function handleSubmitPrayer(form) {
    const newPrayer = {
      id: `local-${Date.now()}`,
      title: form.title,
      content: form.content,
      category: form.category,
      anonymous: form.anonymous,
      name: form.anonymous ? 'Anonymous' : 'You',
      prayCount: 0,
      answered: false,
      createdAt: new Date().toISOString(),
    }
    setLocalPrayers(p => [newPrayer, ...p])
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-14 text-center">
        <span className="text-gold text-sm font-semibold uppercase tracking-widest block mb-3">
          Jesus Is Better Community
        </span>
        <h1 className="font-serif text-white text-4xl md:text-5xl font-bold mb-3">The Prayer Wall</h1>
        <p className="text-gray-300 text-lg italic max-w-xl mx-auto">
          "Do not be anxious about anything, but in every situation, by prayer and petition, 
          with thanksgiving, present your requests to God."
        </p>
        <p className="text-gold mt-2 text-sm">— Philippians 4:6</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <button
              onClick={() => setSort('recent')}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${sort === 'recent' ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy'}`}
            >
              Recent
            </button>
            <button
              onClick={() => setSort('prayed')}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${sort === 'prayed' ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy'}`}
            >
              Most Prayed
            </button>
          </div>

          {/* Share request button */}
          {isAuthenticated ? (
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-sm"
            >
              🙏 Share a Prayer Request
            </button>
          ) : (
            <Link to="/login" className="btn-navy text-sm">
              Sign in to Share a Request
            </Link>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => { setActiveTab(cat.key); setVisible(6) }}
              className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors border ${
                activeTab === cat.key
                  ? 'bg-navy text-white border-navy'
                  : 'border-gray-200 text-gray-600 hover:border-navy hover:text-navy'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length} {filtered.length === 1 ? 'request' : 'requests'}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl block mb-3">🙏</span>
            <p className="font-serif text-xl text-navy mb-1">No requests here yet</p>
            <p className="text-sm">Be the first to share in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, visible).map(prayer => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>
        )}

        {/* Load more */}
        {visible < filtered.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible(v => v + 6)}
              className="btn-secondary"
            >
              Load More Requests
            </button>
          </div>
        )}
      </div>

      {/* Prayer modal */}
      <PrayerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitPrayer}
      />
    </div>
  )
}
