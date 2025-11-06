export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="glass-strong rounded-2xl p-6">
        <p className="text-white font-bold text-sm mt-4">Searching for domains...</p>
        <div className="flex gap-1.5 mt-3 justify-center">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

