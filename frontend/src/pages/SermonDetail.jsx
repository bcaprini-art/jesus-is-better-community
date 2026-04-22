import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { SERMONS, MOCK_COMMENTS, formatDate, formatDuration } from '../data/sermons'
import CommentThread from '../components/CommentThread'
import { useAuth } from '../App'

export default function SermonDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const sermon = SERMONS.find(s => s.id === id)
  const comments = MOCK_COMMENTS[id] || []

  if (!sermon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">📖</span>
        <h2 className="font-serif text-2xl text-navy mb-3">Sermon not found</h2>
        <Link to="/sermons" className="text-gold hover:text-gold-dark font-semibold">← Back to library</Link>
      </div>
    )
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: sermon.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/sermons" className="hover:text-gold transition-colors">Sermons</Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{sermon.title}</span>
      </div>

      {/* Series + Title */}
      <div className="mb-6">
        {sermon.seriesName && (
          <span className="inline-block bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
            {sermon.seriesName}
          </span>
        )}
        <h1 className="font-serif text-navy text-3xl md:text-4xl font-bold leading-tight mb-2">
          {sermon.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="italic">{sermon.scriptureRef}</span>
          <span>·</span>
          <span>{formatDate(sermon.publishedAt)}</span>
          {sermon.durationSeconds && (
            <>
              <span>·</span>
              <span>{formatDuration(sermon.durationSeconds)}</span>
            </>
          )}
          <span>·</span>
          <span>Pastor Rob Bugh</span>
        </div>
      </div>

      {/* Video */}
      <div className="mb-6 rounded-2xl overflow-hidden bg-navy-dark shadow-lg aspect-video">
        {sermon.videoUrl ? (
          <iframe
            src={sermon.videoUrl}
            title={sermon.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-navy-light opacity-40">
            <span className="text-8xl mb-3">✝</span>
            <p className="text-sm text-gray-500">Video coming soon</p>
          </div>
        )}
      </div>

      {/* Description + Share */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <p className="text-gray-600 leading-relaxed flex-1">{sermon.description}</p>
        <button
          onClick={handleShare}
          className="shrink-0 flex items-center gap-2 border border-gray-200 text-gray-500 hover:border-gold hover:text-gold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-cream-dark my-8" />

      {/* Comments */}
      <CommentThread comments={comments} sermonId={id} isAuthenticated={isAuthenticated} />

      {/* More sermons */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <Link to="/sermons" className="text-gold hover:text-gold-dark font-semibold text-sm">
          ← Browse all sermons
        </Link>
      </div>
    </div>
  )
}
