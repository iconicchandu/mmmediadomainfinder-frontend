import { useState } from 'react'

interface DomainSearchProps {
  onSearch: (keyword: string, tld: string) => void
  disabled: boolean
}

const TLD_OPTIONS = [
  'com', 'xyz', 'shop', 'online', 'org', 'net', 'io', 'co', 'info',
  'biz', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it', 'nl',
  'tech', 'app', 'dev', 'site', 'website', 'store', 'cloud', 'ai',
  'pro', 'me', 'tv', 'cc', 'ws', 'name', 'email', 'blog', 'news'
]

export default function DomainSearch({ onSearch, disabled }: DomainSearchProps) {
  const [keyword, setKeyword] = useState('')
  const [tld, setTld] = useState('com')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim() && tld && !disabled) {
      onSearch(keyword.trim(), tld)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1">
            <label htmlFor="keyword" className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
              Keyword
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., home warranty, car warranty"
              className="w-full px-3 py-2 text-sm bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all duration-300 shadow-lg hover:border-white/40"
              disabled={disabled}
            />
          </div>
          
          <div className="md:w-40">
            <label htmlFor="tld" className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
              Extension
            </label>
            <select
              id="tld"
              value={tld}
              onChange={(e) => setTld(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-lg text-gray-800 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all duration-300 shadow-lg hover:border-white/40"
              disabled={disabled}
            >
              {TLD_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-gray-800 text-white">
                  .{option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={disabled || !keyword.trim()}
              className="w-full md:w-auto px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 backdrop-blur-sm"
            >
              {disabled ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin text-xs">⚡</span> <span>Searching...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

