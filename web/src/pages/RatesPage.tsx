/**
 * PAGE: Rates - VERSIÓN SIMPLE
 */

import { useNavigate } from 'react-router-dom'

export function RatesPage() {
  const navigate = useNavigate()

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Rates Management</h1>
        </div>

        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Rate
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Rates page is working! 🎉</p>
        <p>Navigation button should take you back to dashboard.</p>
      </div>
    </div>
  )
}
