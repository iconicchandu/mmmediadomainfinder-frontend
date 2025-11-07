interface DomainResultsProps {
  results: {
    keyword: string
    tld: string
    totalGenerated: number
    available: number
    domains: string[]
  }
}

export default function DomainResults({ results }: DomainResultsProps) {
  const handleBulkCheckAndBuy = () => {
    if (results.domains.length === 0) return;
    
    // Create Namecheap Beast Mode domain finder URL with all available domains
    const domainsParam = results.domains.map(domain => encodeURIComponent(domain)).join(',');
    const url = `https://www.namecheap.com/domains/registration/results/?domain=${domainsParam}&type=beast`;
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleExportCSV = () => {
    if (results.domains.length === 0) return;
    
    // Create CSV content
    const csvHeader = 'Domain\n';
    const csvRows = results.domains.map(domain => domain).join('\n');
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
          {results.domains.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs bg-white/20 backdrop-blur-md border-2 border-white/30 text-gray-700 font-bold rounded-lg hover:bg-white/30 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1 transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
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
            <span className="text-gray-700 font-bold ml-1">{results.totalGenerated}</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-green-300/50">
            <span className="text-gray-700/80 font-bold">Available:</span>
            <span className="text-green-700 font-extrabold ml-1 text-sm">{results.available}</span>
          </div>
        </div>
      </div>

      {results.domains.length === 0 ? (
        <div className="glass-strong rounded-2xl p-6 text-center">
          <p className="text-gray-700 text-sm font-semibold">
            No available domains found. Try a different keyword or extension.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
            {results.domains.map((domain, index) => (
              <div
                key={domain}
                className="glass rounded-lg p-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {domain}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass-strong rounded-2xl p-6 text-center">
            <button
              onClick={handleBulkCheckAndBuy}
              className="mx-auto px-8 py-3 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-1 transition-all duration-300 shadow-xl hover:shadow-green-500/50 transform hover:scale-105 backdrop-blur-sm"
            >
              Check & Buy Now ({results.domains.length} domains)
            </button>
            <p className="text-xs text-gray-700/80 mt-3 font-medium">
              Click to open Namecheap Beast Mode domain finder with all {results.domains.length} available domains
            </p>
          </div>
        </>
      )}
    </div>
  )
}

