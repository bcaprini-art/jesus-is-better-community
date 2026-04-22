import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatDuration } from '../data/sermons'

export default function SermonCard({ sermon }) {
  const { id, title, scriptureRef, seriesName, publishedAt, durationSeconds, commentCount, thumbnailUrl } = sermon

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="relative bg-navy-dark aspect-video flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-navy-light opacity-60 group-hover:opacity-80 transition-opacity">
            <span className="text-5xl">✝</span>
            <span className="text-xs font-sans text-gray-400 tracking-wider uppercase">Jesus Is Better</span>
          </div>
        )}
        {/* Duration badge */}
        {durationSeconds && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
            {formatDuration(durationSeconds)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Series badge */}
        {seriesName && (
          <span className="text-xs font-semibold uppercase tracking-wide text-gold mb-2 inline-block">
            {seriesName}
          </span>
        )}

        <h3 className="font-serif text-navy font-bold text-lg leading-snug mb-1 group-hover:text-gold transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-500 italic mb-3">{scriptureRef}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-xs text-gray-400">
          <span>{formatDate(publishedAt)}</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {commentCount}
          </span>
        </div>

        <Link
          to={`/sermons/${id}`}
          className="mt-4 block text-center bg-navy text-white text-sm font-semibold py-2 rounded-lg hover:bg-gold transition-colors duration-200"
        >
          Watch Now →
        </Link>
      </div>
    </div>
  )
}
