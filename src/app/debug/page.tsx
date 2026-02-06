'use client'

import { useEffect, useState } from 'react'
import { ExperienceData } from '@/types/experience'

export default function DebugPage() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = localStorage.getItem('experiences')
      if (data) {
        const parsed = JSON.parse(data)
        setExperiences(parsed)
      }
    } catch (err) {
      setError('Error parsing localStorage data: ' + (err as Error).message)
    }
  }, [])

  const clearAllData = () => {
    localStorage.removeItem('experiences')
    setExperiences([])
    alert('All experience data cleared!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug - Stored Experiences</h1>
        <p className="text-gray-600">
          This page shows all experience letters stored in localStorage for debugging purposes.
        </p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Stored Data</h2>
          <button
            onClick={clearAllData}
            className="btn-secondary text-red-600 hover:bg-red-50"
          >
            Clear All Data
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {experiences.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No experience letters found in localStorage.</p>
            <button
              onClick={() => window.location.href = '/create'}
              className="btn-primary mt-4"
            >
              Create Your First Experience Letter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Found {experiences.length} experience letter(s):</p>
            
            {experiences.map((exp, index) => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{exp.projectTitle}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${exp.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {exp.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>ID:</strong> <code className="bg-gray-100 px-1 rounded">{exp.id}</code></p>
                    <p><strong>User:</strong> {exp.userName}</p>
                    <p><strong>Client:</strong> {exp.clientCompany}</p>
                  </div>
                  <div>
                    <p><strong>Created:</strong> {new Date(exp.createdAt).toLocaleDateString()}</p>
                    <p><strong>Duration:</strong> {exp.startDate} to {exp.endDate}</p>
                    {exp.isVerified && exp.managerName && (
                      <p><strong>Verified by:</strong> {exp.managerName}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/verify/${exp.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Letter
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/verify/${exp.id}`)
                      alert('Link copied to clipboard!')
                    }}
                    className="text-gray-600 hover:text-gray-800 text-sm underline"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Raw Data</h3>
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(experiences, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}