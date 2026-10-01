import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Home() {
  const { isAuthenticated, logout } = useAuth()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')

  const handleShorten = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await api.post('/links', { 
      originalUrl: url,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
    })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <span className="text-xl font-bold text-indigo-400">LinkShortener</span>
        <div className="flex gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
              <button onClick={logout} className="text-gray-300 hover:text-white transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition">Sign in</Link>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-4 py-24">
        <h1 className="text-5xl font-bold text-center mb-4">Shorten your links</h1>
        <p className="text-gray-400 text-center mb-10 max-w-md">
          Paste a long URL and get a short link instantly. Create an account to track clicks and analytics.
        </p>

        <form onSubmit={handleShorten} className="w-full max-w-2xl flex gap-3">
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
          type="datetime-local"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-400"
        />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        {result && (
          <div className="mt-6 bg-gray-900 rounded-xl p-6 w-full max-w-2xl">
            <p className="text-gray-400 text-sm mb-2">Your short link:</p>
            <div className="flex items-center gap-3">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 font-semibold text-lg hover:underline break-all"
              >
                {result.shortUrl}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(result.shortUrl)}
                className="ml-auto text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-3 break-all">Original: {result.originalUrl}</p>
            {result.expiresAt && (
            <p className="text-yellow-500 text-sm mt-1">
              Expires: {new Date(result.expiresAt).toLocaleString()}
            </p>
          )}
          </div>
        )}
      </main>
    </div>
  )
}