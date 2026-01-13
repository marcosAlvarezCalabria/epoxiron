/**
 * COMPONENT: DeliveryNotesList
 *
 * Simple list of delivery notes
 * (Styles will be updated with Figma design later)
 */

import { useDeliveryNotes, useDeleteDeliveryNote } from '../hooks/useDeliveryNotes'

export function DeliveryNotesList() {
  const { data: deliveryNotes, isLoading, error } = useDeliveryNotes()
  const { mutate: deleteDeliveryNote } = useDeleteDeliveryNote()

  if (isLoading) return <div>Loading delivery notes...</div>
  if (error) return <div>Error loading delivery notes</div>
  if (!deliveryNotes || deliveryNotes.length === 0) return <div>No delivery notes yet</div>

  return (
    <div>
      <h2>Delivery Notes List</h2>
      <ul>
        {deliveryNotes.map((note) => (
          <li key={note.id}>
            <div>
              <strong>{note.customerName}</strong>
              <span> - Date: {new Date(note.date).toLocaleDateString()}</span>
              <span> - Status: {note.status}</span>
              <span> - Total: €{note.totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={() => deleteDeliveryNote(note.id)}
              disabled={note.status !== 'draft'}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
