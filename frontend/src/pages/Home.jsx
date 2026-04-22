import React from 'react'
import { Link } from 'react-router-dom'
import SermonCard from '../components/SermonCard'
import { SERMONS } from '../data/sermons'

const STATS = [
  { value: '12,847', label: 'members worldwide' },
  { value: '234', label: 'sermons' },
  { value: '48,293', label: 'prayers offered' },
]

const FEATURES = [
  {
    icon: '📖',
    title: 'Expository Preaching',
    desc: 'Verse-by-verse through God\'s Word every week — with depth, clarity, and Christ at the center.',
  },
  {
    icon: '🙏',
    title: 'Prayer Community',
    desc: 'Request prayer, pray for others, and share testimonies of God\'s faithfulness.',
  },
  {
    icon: '💬',
    title: 'Sermon Discussion',
    desc: 'Reflect, respond, and grow together in community around each message.',
  },
]

export default function Home() {
  const featured = SERMONS.find(s => s.featured) || SERMONS[0]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden">
        {/* Subtle cross pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Crect x='26' y='6' width='8' height='48'/%3E%3Crect x='6' y='22' width='48' height='8'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Jesus Is Better Community
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Rooted in the Word.<br className="hidden sm:block" />
            <span className="text-gold"> Growing Together in Grace.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join Pastor Rob Bugh and a global community united around the truth that Jesus is better — 
            better than anything this world offers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sermons/1" className="btn-primary text-base">
              Watch This Week's Sermon
            </Link>
            <Link to="/register" className="btn-secondary text-base border-white text-white hover:bg-white hover:text-navy">
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="bg-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-3 divide-x divide-gold-dark">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center px-4">
                <p className="font-serif text-white text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-amber-100 text-xs md:text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Sermon ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="section-title">This Week's Message</h2>
          <Link to="/sermons" className="text-sm text-gold hover:text-gold-dark font-semibold">
            All sermons →
          </Link>
        </div>

        <div className="card flex flex-col md:flex-row overflow-hidden">
          {/* Thumbnail */}
          <div className="md:w-2/5 bg-navy-dark min-h-[220px] flex items-center justify-center">
            <div className="text-center text-navy-light opacity-40">
              <span className="text-7xl block mb-2">✝</span>
              <span className="text-xs tracking-widest uppercase text-gray-500">Jesus Is Better</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <span className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
              {featured.seriesName}
            </span>
            <h3 className="font-serif text-navy text-2xl md:text-3xl font-bold mb-2">
              {featured.title}
            </h3>
            <p className="text-sm text-gray-500 italic mb-4">{featured.scriptureRef}</p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-prose">
              {featured.description}
            </p>
            <Link to={`/sermons/${featured.id}`} className="btn-primary self-start">
              Watch Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="bg-cream-dark py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">What You'll Find Here</h2>
            <p className="section-subtitle">A community built around the Word and the people who love it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-8 text-center hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="font-serif text-navy text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent sermons grid ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="section-title">Recent Messages</h2>
          <Link to="/sermons" className="text-sm text-gold hover:text-gold-dark font-semibold">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERMONS.filter(s => !s.featured).slice(0, 3).map(sermon => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-gold text-3xl mb-4 block">✝</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">About Pastor Rob Bugh</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Pastor Rob Bugh has devoted his ministry to expository preaching — taking congregations 
            through books of the Bible, verse by verse, with depth and pastoral warmth. His teaching 
            is marked by a deep conviction that <em className="text-gold">Jesus is better</em> than 
            anything the world has to offer.
          </p>
          <p className="text-gray-400 text-base mb-8 italic">
            Broadcasting globally — for the joy of all who believe.
          </p>
          <Link to="/sermons" className="btn-secondary border-gold text-gold hover:bg-gold hover:text-white">
            Explore the Sermon Library
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="bg-cream-dark py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">
            Ready to grow together?
          </h2>
          <p className="text-gray-500 mb-8">
            Create a free account to join the prayer wall, discuss sermons, and connect with a community worldwide.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary">Create Free Account</Link>
            <Link to="/sermons" className="btn-navy">Browse Sermons</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
