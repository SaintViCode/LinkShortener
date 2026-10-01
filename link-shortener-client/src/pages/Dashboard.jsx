import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrLink, setQrLink] = useState(null)

  useEffect(() => {
    api.get('/links').then(res => {
      setLinks(res.data)
      setLoading(false)
    })
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <Link to="/" className="text-xl font-bold text-indigo-400">LinkShortener</Link>
        <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white transition">
          Logout
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Links</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : links.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-4">No links yet.</p>
            <Link to="/" className="text-indigo-400 hover:underline">Shorten your first URL</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map(link => (
              <div key={link.id} className="bg-gray-900 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 font-semibold hover:underline"
                  >
                    {link.shortUrl}
                  </a>
                  <p className="text-gray-500 text-sm mt-1 truncate">{link.originalUrl}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {link.totalClicks} click{link.totalClicks !== 1 ? 's' : ''} · Created {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigator.clipboard.writeText(link.shortUrl)}
                    className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
                  >
                    Copy
                  </button>
                  <Link
                    to={`/analytics/${link.id}`}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition"
                  >
                    Analytics
                  </Link>
                  <button
                  onClick={() => setQrLink(link.shortUrl)}
                  className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
                >
                  QR
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {qrLink && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setQrLink(null)}
  >
    <div
      className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center gap-4"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold">QR Code</h2>
      <QRCodeSVG value={qrLink} size={200} bgColor="#111827" fgColor="#ffffff" />
      <p className="text-gray-400 text-sm break-all max-w-xs text-center">{qrLink}</p>
      <button
        onClick={() => setQrLink(null)}
        className="text-sm text-gray-400 hover:text-white transition"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  )
}