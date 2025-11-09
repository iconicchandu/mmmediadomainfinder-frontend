import { useState } from 'react'
import { Download, X } from 'lucide-react'

interface DomainResultsProps {
  results: {
    keyword: string
    tld: string
    totalGenerated: number
    available: number
    domains: string[] | Array<{ domain: string; available: boolean }>
  }
  requestedCount: number
}

export default function DomainResults({ results, requestedCount }: DomainResultsProps) {
  const [deletedDomains, setDeletedDomains] = useState<Set<string>>(new Set())

  // Normalize domains to always have domain and available properties
  const normalizedDomains = results.domains.map(domain => {
    if (typeof domain === 'string') {
      return { domain, available: true };
    }
    return domain;
  });

  // Limit domains to the requested count
  const limitedDomains = normalizedDomains.slice(0, requestedCount)

  // Filter out deleted domains
  const visibleDomains = limitedDomains.filter(d => !deletedDomains.has(d.domain))

  // Get only available domains for bulk check (excluding deleted)
  const availableDomains = visibleDomains.filter(d => d.available)

  const handleDeleteDomain = (domain: string) => {
    setDeletedDomains(prev => new Set(prev).add(domain))
  }

  const handleBulkCheckAndBuy = () => {
    if (availableDomains.length === 0) return;
    
    // Create Namecheap Beast Mode domain finder URL with all available domains
    const domainsParam = availableDomains.map(d => encodeURIComponent(d.domain)).join(',');
    const url = `https://www.namecheap.com/domains/registration/results/?domain=${domainsParam}&type=beast`;
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleExportCSV = () => {
    if (visibleDomains.length === 0) return;
    
    // Create CSV content
    const csvHeader = 'Domain,Available\n';
    const csvRows = visibleDomains.map(d => `${d.domain},${d.available ? 'Yes' : 'No'}`).join('\n');
    const csvContent = csvHeader + csvRows;
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `domains_${results.keyword}_${results.tld}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="mt-6">
      <div className="glass-strong rounded-2xl p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h2 className="text-2xl md:text-2xl font-extrabold text-gray-700">
            Domain Results
          </h2>
          {visibleDomains.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs bg-white/20 backdrop-blur-md border-2 border-white/30 text-gray-700 font-bold rounded-lg hover:bg-white/30 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1 transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-2 glass rounded-lg">
            <span className="text-gray-700/80 font-bold">Keyword:</span>
            <span className="text-gray-700 font-bold ml-1">{results.keyword}</span>
          </div>
          <div className="px-3 py-2 glass rounded-lg">
            <span className="text-gray-700/80 font-bold">Extension:</span>
            <span className="text-gray-700 font-bold ml-1">.{results.tld}</span>
          </div>
          <div className="px-3 py-2 glass rounded-lg">
            <span className="text-gray-700/80 font-bold">Generated:</span>
            <span className="text-gray-700 font-bold ml-1">{Math.min(requestedCount, limitedDomains.length)}</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-green-300/50">
            <span className="text-gray-700/80 font-bold">Available:</span>
            <span className="text-green-700 font-extrabold ml-1 text-sm">{availableDomains.length}</span>
          </div>
        </div>
      </div>

      {visibleDomains.length === 0 ? (
        <div className="glass-strong rounded-2xl p-6 text-center">
          <p className="text-gray-700 text-sm font-semibold">
            No domains found. Try a different keyword or extension.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
            {visibleDomains.map((domainData, index) => (
              <div
                key={domainData.domain}
                className={`glass rounded-lg p-3 hover:bg-white/20 transition-all duration-300 transform  relative group ${
                  !domainData.available ? 'border-2 border-red-500' : ''
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  onClick={() => handleDeleteDomain(domainData.domain)}
                  className="absolute top-[14px] right-2 opacity-100 p-0.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center z-10"
                  title="Delete domain"
                  aria-label={`Delete ${domainData.domain}`}
                >
                  <X className="w-2 h-2" />
                </button>
                <div className="flex items-center justify-center pr-6">
                  <span className={`text-xs font-medium text-center ${
                    !domainData.available ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {domainData.domain}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass-strong rounded-2xl p-6 text-center">
            <button
              onClick={handleBulkCheckAndBuy}
              className="mx-auto px-8 py-3 text-sm bg-gradient-to-r from-red-500 to-blue-600 text-white font-extrabold rounded-xl   transition-all duration-300 shadow-xl hover:shadow-green-500/50 transform hover:scale-105 backdrop-blur-sm"
            >
              Go with {availableDomains.length} domains
            </button>
            <p className="text-xs text-white/70 mt-3 font-medium">
              Click to open Namecheap Beast Mode domain finder with all {availableDomains.length} available domains
            </p>
          </div>
        </>
      )}
    </div>
  )
}

