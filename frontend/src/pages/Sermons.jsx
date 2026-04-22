import React, { useState, useMemo } from 'react'
import SermonCard from '../components/SermonCard'
import { SERMONS } from '../data/sermons'

const SERIES = ['All Series', ...Array.from(new Set(SERMONS.map(s => s.seriesName)))]

export default function Sermons() {
  const [search, setSearch] = useState('')
  const [series, setSeries] = useState('All Series')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const PER_PAGE = 6

  const filtered = useMemo(() => {
    let list = [...SERMONS]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.scriptureRef.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      )
    }
    if (series !== 'All Series') {
      list = list.filter(s => s.seriesName === series)
    }
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    } else {
      list.sort((a, b) => b.commentCount - a.commentCount)
    }
    return list
  }, [search, series, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleSearch(e) { setSearch(e.target.value); setPage(1) }
  function handleSeries(e) { setSeries(e.target.value); setPage(1) }
  function handleSort(e) { setSort(e.target.value); setPage(1) }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">Jesus Is Better Community</p>
        <h1 className="section-title text-4xl">Sermon Library</h1>
        <p className="section-subtitle">
          Verse-by-verse through God's Word with Pastor Rob Bugh.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search sermons, scripture, topics…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          />
        </div>

        {/* Series filter */}
        <select
          value={series}
          onChange={handleSeries}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
        >
          {SERIES.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={handleSort}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
        >
          <option value="newest">Newest First</option>
          <option value="discussed">Most Discussed</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-6">
        {filtered.length} {filtered.length === 1 ? 'sermon' : 'sermons'} found
        {search && <> for "<span className="text-navy">{search}</span>"</>}
      </p>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {paginated.map(s => <SermonCard key={s.id} sermon={s} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">📖</span>
          <p className="font-serif text-xl text-navy mb-1">No sermons found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-navy hover:bg-navy hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                n === page ? 'bg-navy text-white' : 'border border-gray-200 text-gray-600 hover:bg-navy hover:text-white'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-navy hover:bg-navy hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
