import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import { PRAYERS } from '../data/prayers'
import { SERMONS, formatDate } from '../data/sermons'
import { getCategoryStyle, CATEGORIES } from '../data/prayers'

const MY_PRAYERS = PRAYERS.slice(0, 2)
const INTERCEDING_FOR = PRAYERS.slice(2, 4)

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'friend'
  const latestSermon = SERMONS[0]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Welcome */}
      <div className="mb-10">
        <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-1">Jesus Is Better Community</p>
        <h1 className="font-serif text-navy text-4xl font-bold">
          Welcome back, {firstName}. 🙏
        </h1>
        <p className="text-gray-500 mt-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          to="/sermons/1"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-gold text-xl">▶</div>
          <div>
            <p className="font-semibold text-navy text-sm group-hover:text-gold transition-colors">Watch Latest Sermon</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{latestSermon.title}</p>
          </div>
        </Link>
        <Link
          to="/prayers"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">🙏</div>
          <div>
            <p className="font-semibold text-navy text-sm group-hover:text-gold transition-colors">Prayer Wall</p>
            <p className="text-xs text-gray-400 mt-0.5">Pray for the community</p>
          </div>
        </Link>
        <Link
          to="/sermons"
          className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 rounded-xl bg-cream-dark flex items-center justify-center text-2xl">📖</div>
          <div>
            <p className="font-semibold text-navy text-sm group-hover:text-gold transition-colors">Sermon Library</p>
            <p className="text-xs text-gray-400 mt-0.5">234 messages available</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Prayer Requests */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-navy text-xl font-bold">My Prayer Requests</h2>
            <Link to="/prayers" className="text-xs text-gold hover:text-gold-dark font-semibold">+ Add request</Link>
          </div>
          {MY_PRAYERS.length === 0 ? (
            <p className="text-sm text-gray-400 italic">You haven't shared any requests yet.</p>
          ) : (
            <ul className="space-y-3">
              {MY_PRAYERS.map(p => {
                const catLabel = CATEGORIES.find(c => c.key === p.category)?.label || p.category
                const catStyle = getCategoryStyle(p.category)
                return (
                  <li key={p.id} className="flex items-start justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-navy leading-snug">{p.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catStyle}`}>{catLabel}</span>
                        <span className="text-xs text-gray-400">🙏 {p.prayCount}</span>
                      </div>
                    </div>
                    {p.answered && (
                      <span className="shrink-0 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Answered
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Interceding for */}
        <section className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-navy text-xl font-bold">Praying For</h2>
            <Link to="/prayers" className="text-xs text-gold hover:text-gold-dark font-semibold">Browse all</Link>
          </div>
          {INTERCEDING_FOR.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Start praying for others on the Prayer Wall.</p>
          ) : (
            <ul className="space-y-3">
              {INTERCEDING_FOR.map(p => (
                <li key={p.id} className="py-3 border-b border-gray-100 last:border-0">
                  <p className="font-semibold text-sm text-navy leading-snug">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent sermon activity */}
        <section className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-navy text-xl font-bold">Recent Messages</h2>
            <Link to="/sermons" className="text-xs text-gold hover:text-gold-dark font-semibold">All sermons →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERMONS.slice(0, 4).map(s => (
              <Link
                key={s.id}
                to={`/sermons/${s.id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors group"
              >
                <div className="w-16 h-12 rounded-lg bg-navy-dark flex items-center justify-center text-navy-light opacity-50 shrink-0 text-xl">✝</div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-navy group-hover:text-gold transition-colors leading-snug line-clamp-2">{s.title}</p>
                  <p className="text-xs text-gray-400 italic mt-0.5">{s.scriptureRef}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(s.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
