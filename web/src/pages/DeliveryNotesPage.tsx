/**
 * PAGE: Delivery Notes
 *
 * Main page for managing delivery notes
 */

import { useState } from 'react'
import { DeliveryNoteForm } from '../features/delivery-notes/components/DeliveryNoteForm'

export function DeliveryNotesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Delivery Notes (Albaranes)</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Close Form' : 'New Delivery Note'}
        </button>
      </div>

      {showForm && (
        <DeliveryNoteForm
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* TODO: Add DeliveryNotesList component */}
    </div>
  )
}
