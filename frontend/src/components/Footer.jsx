import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold text-xl">✝</span>
              <span className="font-serif text-white font-bold text-lg">Jesus Is Better Community</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Rooted in the Word. Growing Together in Grace.<br />
              A global community around the ministry of Pastor Rob Bugh.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sermons" className="hover:text-gold transition-colors">Sermon Library</Link></li>
              <li><Link to="/prayers" className="hover:text-gold transition-colors">Prayer Wall</Link></li>
              <li><Link to="/register" className="hover:text-gold transition-colors">Join the Community</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">About</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              <em>Jesus Is Better</em> is a ministry resource built around expository preaching and authentic Christian community — open to believers and seekers worldwide.
            </p>
            <p className="text-sm text-gray-400 mt-3">
              Pastor Rob Bugh
            </p>
          </div>
        </div>

        <div className="border-t border-navy-light pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jesus Is Better Community. All rights reserved.</p>
          <p className="italic">"For to me, to live is Christ and to die is gain." — Phil. 1:21</p>
        </div>
      </div>
    </footer>
  )
}
