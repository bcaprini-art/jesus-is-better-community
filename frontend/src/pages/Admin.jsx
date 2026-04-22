import React, { useState } from 'react'
import { SERMONS, formatDate } from '../data/sermons'
import { PRAYERS } from '../data/prayers'
import { useAuth } from '../App'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CHART_DATA = [
  { name: 'Nov', sermons: 4, prayers: 312 },
  { name: 'Dec', sermons: 3, prayers: 428 },
  { name: 'Jan', sermons: 5, prayers: 519 },
  { name: 'Feb', sermons: 4, prayers: 487 },
  { name: 'Mar', sermons: 4, prayers: 612 },
  { name: 'Apr', sermons: 4, prayers: 703 },
]

function StatCard({ label, value, icon, sub }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
          <p className="font-serif text-navy text-3xl font-bold">{value}</p>
          {sub && <p className="text-xs text-green-600 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [announcement, setAnnouncement] = useState('')
  const [announcementSent, setAnnouncementSent] = useState(false)

  function handleAnnouncement(e) {
    e.preventDefault()
    setAnnouncementSent(true)
    setAnnouncement('')
    setTimeout(() => setAnnouncementSent(false), 3000)
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'sermons', label: 'Sermons' },
    { key: 'prayers', label: 'Prayers' },
    { key: 'announcements', label: 'Announcements' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-1">Jesus Is Better Community</p>
        <h1 className="font-serif text-navy text-4xl font-bold">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Signed in as {user?.name} · {user?.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? 'border-gold text-gold'
                : 'border-transparent text-gray-500 hover:text-navy'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Members" value="12,847" icon="👥" sub="↑ 124 this month" />
            <StatCard label="Sermons" value={SERMONS.length} icon="📖" sub="4 this month" />
            <StatCard label="Prayers" value={PRAYERS.length} icon="🙏" sub="↑ 48 this week" />
            <StatCard label="Answered" value={PRAYERS.filter(p => p.answered).length} icon="✅" sub="Praise God!" />
          </div>

          <div className="card p-6">
            <h2 className="font-serif text-navy text-xl font-bold mb-5">Activity (last 6 months)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="prayers" name="Prayers" fill="#C4922A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sermons" name="Sermons" fill="#1B2B4B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sermons */}
      {tab === 'sermons' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-serif text-navy text-xl font-bold">All Sermons</h2>
            <button className="btn-primary text-sm py-2">+ Add Sermon</button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-cream-dark text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Scripture</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SERMONS.map(s => (
                <tr key={s.id} className="hover:bg-cream-dark/50">
                  <td className="px-6 py-4 font-semibold text-navy max-w-xs">
                    <div className="truncate">{s.title}</div>
                    {s.featured && <span className="text-xs text-gold">★ Featured</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500 italic hidden md:table-cell">{s.scriptureRef}</td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{formatDate(s.publishedAt)}</td>
                  <td className="px-6 py-4 text-gray-500">{s.commentCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-navy hover:text-gold font-semibold">Edit</button>
                      <button className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Prayers */}
      {tab === 'prayers' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-serif text-navy text-xl font-bold">Prayer Requests</h2>
            <span className="text-sm text-gray-500">{PRAYERS.length} total</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-cream-dark text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prayers</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PRAYERS.map(p => (
                <tr key={p.id} className="hover:bg-cream-dark/50">
                  <td className="px-6 py-4 font-semibold text-navy max-w-xs">
                    <div className="truncate">{p.title}</div>
                    <div className="text-xs text-gray-400 font-normal">{p.anonymous ? 'Anonymous' : p.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell capitalize">{p.category.toLowerCase()}</td>
                  <td className="px-6 py-4 text-gray-500">🙏 {p.prayCount}</td>
                  <td className="px-6 py-4">
                    {p.answered
                      ? <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Answered</span>
                      : <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Active</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-xs text-green-700 hover:text-green-800 font-semibold">✓ Answered</button>
                      <button className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Announcements */}
      {tab === 'announcements' && (
        <div className="max-w-xl">
          <div className="card p-8">
            <h2 className="font-serif text-navy text-2xl font-bold mb-2">Post an Announcement</h2>
            <p className="text-sm text-gray-500 mb-6">This will appear as a banner to all community members.</p>
            <form onSubmit={handleAnnouncement} className="space-y-4">
              <textarea
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Share a message with the Jesus Is Better Community…"
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none"
              />
              <button
                type="submit"
                disabled={!announcement.trim()}
                className="bg-navy text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-gold transition-colors disabled:opacity-50"
              >
                Post Announcement
              </button>
              {announcementSent && (
                <p className="text-green-600 text-sm font-semibold">✓ Announcement posted!</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
