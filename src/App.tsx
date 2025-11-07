import { useState } from 'react'
import axios from 'axios'
import DomainSearch from './components/DomainSearch'
import DomainResults from './components/DomainResults'
import LoadingSpinner from './components/LoadingSpinner'

interface DomainResult {
  keyword: string
  tld: string
  totalGenerated: number
  available: number
  domains: string[]
}

function App() {
  const [results, setResults] = useState<DomainResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (keyword: string, tld: string) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await axios.get<DomainResult>("https://mmmediadomainfinder.onrender.com/api/domains", {
        params: { keyword, tld }
      })
      setResults(response.data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch domains. Please check your API credentials and try again.'
      setError(errorMessage)
      console.error('Error fetching domains:', err)
      console.error('Error response:', err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Scrollable content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 py-6 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center">
                <img src="https://image.s10.sfmc-content.com/lib/fe2b1171706405797d1375/m/1/2fb6e6f2-244e-41a0-b20a-9049947429c9.png" alt="Logo" className="w-12 mr-2" />
                <h1 className="text-3xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-2xl">
                  Domain Finder
                </h1>
              </div>
              <p className="text-white/90 text-sm md:text-base font-light max-w-2xl mx-auto drop-shadow-lg mt-2">
                Generate professional, brandable domain names instantly
              </p>
              <p className="text-white/70 text-xs md:text-sm font-light max-w-xl mx-auto mt-1 drop-shadow">
                Brand Name Generator + Domain Finder
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            <DomainSearch onSearch={handleSearch} disabled={loading} />

            {loading && (
              <div className="mt-6 flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {error && (
              <div className="mt-6 max-w-2xl mx-auto">
                <div className="glass-strong border-2 border-red-400/50 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h3 className="text-base font-bold text-white mb-1">Error</h3>
                      <p className="text-xs text-white/90">{error}</p>
                      {error.includes('credentials') && (
                        <p className="text-xs mt-2 text-white/70">
                          💡 Tip: Make sure your .env file in the backend folder contains all required API credentials.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {results && !loading && (
              <DomainResults results={results} />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-4 px-4 text-center glass-light border-t border-white/10">
          <p className="text-white/90 text-xs font-medium">
            Made with <span className="text-red-300 animate-pulse">❤️</span> by{' '}
            <span className="text-white font-bold">Chandu</span>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

