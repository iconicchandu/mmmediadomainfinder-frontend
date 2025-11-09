import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface DomainSearchProps {
  onSearch: (keyword: string, tld: string, count: number) => void
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
  const [count, setCount] = useState<number | ''>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (count === '' || (typeof count === 'number' && (count < 1 || count > 1000))) {
      return
    }
    const countValue = typeof count === 'number' ? count : parseInt(String(count))
    if (keyword.trim() && tld && !disabled && countValue && countValue >= 1 && countValue <= 1000) {
      onSearch(keyword.trim(), tld, countValue)
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
          
          <div className="md:w-40">
            <label htmlFor="count" className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
              Count
            </label>
            <input
              type="number"
              id="count"
              min="1"
              max="1000"
              required
              value={count}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  setCount('')
                } else {
                  const numValue = parseInt(value) || 1
                  setCount(Math.max(1, Math.min(1000, numValue)))
                }
              }}
              className="w-full px-3 py-2 text-sm bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all duration-300 shadow-lg hover:border-white/40"
              disabled={disabled}
              placeholder="How Many??"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={disabled || !keyword.trim() || count === '' || (typeof count === 'number' && count < 1)}
              className="w-full md:w-auto px-6 py-2 text-sm bg-gradient-to-r from-red-500 to-blue-600 text-white font-bold rounded-lg  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 backdrop-blur-sm"
            >
              {disabled ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Search className="w-4 h-4" />
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

