import React, { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    time: '',
    place: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const payload = { ...form }
      const resp = await axios.post('/api/generate', payload)
      setResult(resp.data)
    } catch (err) {
      setError(err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-2">Kundali & Horoscope Generator</h1>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm">Name</span>
            <input name="name" value={form.name} onChange={onChange} required className="mt-1 p-2 border rounded" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Date of Birth</span>
            <input name="dob" value={form.dob} onChange={onChange} type="date" required className="mt-1 p-2 border rounded" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Time of Birth</span>
            <input name="time" value={form.time} onChange={onChange} type="time" required className="mt-1 p-2 border rounded" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Birth Place</span>
            <input name="place" value={form.place} onChange={onChange} required placeholder="City, Country" className="mt-1 p-2 border rounded" />
          </label>
          <div className="md:col-span-2 flex gap-2 mt-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Generating...' : 'Generate Kundali'}</button>
          </div>
        </form>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-medium">Result for {result.name}</h2>
            <pre className="text-sm mt-2 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}