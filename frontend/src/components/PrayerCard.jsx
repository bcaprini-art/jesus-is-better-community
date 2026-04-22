import React, { useState } from 'react'
import { getCategoryStyle, CATEGORIES } from '../data/prayers'

export default function PrayerCard({ prayer, onPray }) {
  const [prayed, setPrayed] = useState(false)
  const [count, setCount] = useState(prayer.prayCount)

  function handlePray() {
    if (prayed) return
    setPrayed(true)
    setCount(c => c + 1)
    onPray?.(prayer.id)
  }

  const categoryLabel = CATEGORIES.find(c => c.key === prayer.category)?.label || prayer.category
  const categoryStyle = getCategoryStyle(prayer.category)

  return (
    <div className={`card p-5 flex flex-col gap-3 ${prayer.answered ? 'border-green-200 bg-green-50/40' : ''}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyle}`}>
          {categoryLabel}
        </span>
        {prayer.answered && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Answered
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-serif text-navy font-semibold text-lg leading-snug">{prayer.title}</h3>

      {/* Excerpt */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{prayer.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        {/* Author */}
        <span className="text-xs text-gray-400 italic">
          {prayer.anonymous ? 'Anonymous' : prayer.name}
        </span>

        {/* Pray button */}
        <button
          onClick={handlePray}
          disabled={prayed}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200 ${
            prayed
              ? 'bg-gold/10 text-gold cursor-default'
              : 'bg-navy/5 text-navy hover:bg-gold hover:text-white'
          }`}
        >
          🙏 <span>{prayed ? 'Praying' : "I'm Praying"}</span>
          <span className="ml-1 text-xs font-normal opacity-70">{count}</span>
        </button>
      </div>
    </div>
  )
}
