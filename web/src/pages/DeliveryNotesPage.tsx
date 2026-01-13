/**
 * PAGE: Delivery Notes - Con lista
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeliveryNotesList } from '../features/delivery-notes/components/DeliveryNotesList'

export function DeliveryNotesPage() {
  const [showForm, setShowForm] = useState(false)
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
          <h1 className="text-3xl font-bold">Delivery Notes (Albaranes)</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Close Form' : '+ New Delivery Note'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create New Delivery Note</h3>
          <p>Formulario de albaranes aparecerá aquí (próximo paso)</p>
          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mt-4"
          >
            Close
          </button>
        </div>
      )}

      <DeliveryNotesList />
    </div>
  )
}
