export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="text-2xl">🌙⭐</div>
        </div>
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">Muslim Invest</h2>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
