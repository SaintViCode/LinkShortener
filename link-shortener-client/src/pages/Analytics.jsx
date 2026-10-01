import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import api from '../api/axios'

export default function Analytics() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/links/${id}/analytics`).then(res => {
      setData(res.data)
      setLoading(false)
    })
  }, [id])

  const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <Link to="/" className="text-xl font-bold text-indigo-400">LinkShortener</Link>
        <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Link Analytics</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !data ? (
          <p className="text-gray-400">No data found.</p>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Clicks</p>
              <p className="text-5xl font-bold text-indigo-400">{data.totalClicks}</p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Clicks over time</h2>
              {data.clicksByDate.length === 0 ? (
                <p className="text-gray-500 text-sm">No click data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.clicksByDate}>
                    <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#e5e7eb' }}
                    />
                    <Line type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Clicks by device</h2>
              {data.clicksByDevice.length === 0 ? (
                <p className="text-gray-500 text-sm">No click data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.clicksByDevice}>
                    <XAxis dataKey="deviceType" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#e5e7eb' }}
                    />
                    <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                      {data.clicksByDevice.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}