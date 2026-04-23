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
    title: 'Behold, Not Just Believe',
    desc: 'The central crisis of the church is not moral failure — it is lost wonder. These messages are an invitation to see Jesus clearly again.',
  },
  {
    icon: '🙏',
    title: 'A Community of Prayer',
    desc: 'Bring your burdens. Carry others\' burdens. This is what it looks like when people actually believe Jesus is better than any other answer.',
  },
  {
    icon: '💬',
    title: 'Gospel-Centered Discussion',
    desc: 'The gospel isn\'t just the starting line — it\'s the whole race. Discuss, reflect, and press the truth deeper together.',
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
            We have stopped being<br className="hidden sm:block" />
            <span className="text-gold">astonished by Jesus.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            There is a particular kind of Christian misery that nobody talks about — the misery of someone who believes everything and still finds Jesus feels distant, obligatory, and small. This community is for that person. It was built by that person.
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
            <h2 className="section-title">Not a Program. An Invitation.</h2>
            <p className="section-subtitle">What follows is not spiritual self-improvement. It is an invitation — to behold, to savor, to be undone by the one who is, as Flavel put it, the fairest among ten thousand.</p>
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
            I have been a pastor for decades. I have preached thousands of sermons, counseled hundreds of families, buried people I loved. I believe the gospel with everything in me. And yet for too many years of my ministry, I lived as though Jesus were primarily <em className="text-gold">useful</em> — a means to a better life — rather than the most beautiful, most satisfying, most inexhaustibly glorious reality in the universe.
          </p>
          <p className="text-gray-300 text-base mb-2 leading-relaxed max-w-xl mx-auto">
            This community is my attempt to share what changed. He is better. I am still learning what that means.
          </p>
          <p className="text-gold italic text-base mb-8">— Rob Bugh</p>
          <Link to="/sermons" className="btn-secondary border-gold text-gold hover:bg-gold hover:text-white">
            Explore the Sermon Library
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="bg-cream-dark py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">
            Come to me, all who are weary and burdened.
          </h2>
          <p className="text-gray-500 mb-2 italic text-sm">Matthew 11:28</p>
          <p className="text-gray-500 mb-8 mt-4">
            That invitation has not expired. It has your name on it. Join a community learning together what it means to believe — not just affirm — that Jesus is better.
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
