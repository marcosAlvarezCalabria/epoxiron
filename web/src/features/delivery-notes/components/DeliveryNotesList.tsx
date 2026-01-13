/**
 * COMPONENT: DeliveryNotesList
 *
 * Simple list of delivery notes
 * (Styles will be updated with Figma design later)
 */

import { useDeliveryNotes, useDeleteDeliveryNote, useUpdateDeliveryNoteStatus } from '../hooks/useDeliveryNotes'

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-green-100 text-green-800'
}

const statusLabels = {
  draft: 'Borrador',
  pending: 'Pendiente',
  reviewed: 'Revisado'
}

export function DeliveryNotesList() {
  const { data: deliveryNotes, isLoading, error } = useDeliveryNotes()
  const { mutate: deleteDeliveryNote } = useDeleteDeliveryNote()
  const { mutate: updateStatus } = useUpdateDeliveryNoteStatus()

  if (isLoading) return <div className="text-center py-8">⏳ Cargando albaranes...</div>
  if (error) return <div className="text-red-600 py-8">❌ Error al cargar albaranes</div>
  if (!deliveryNotes || deliveryNotes.length === 0) {
    return <div className="text-center py-8 text-gray-500">📭 No hay albaranes aún</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Listado de Albaranes</h2>
      <div className="space-y-4">
        {deliveryNotes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{note.customerName}</h3>
                <p className="text-sm text-gray-500">
                  📅 {new Date(note.date).toLocaleDateString('es-ES')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[note.status]}`}>
                {statusLabels[note.status]}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600">Piezas</p>
                <p className="font-bold">{note.items.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Total</p>
                <p className="font-bold">€{note.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">ID</p>
                <p className="font-mono text-xs">{note.id.slice(0, 8)}</p>
              </div>
            </div>

            {note.notes && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Notas:</strong> {note.notes}
              </p>
            )}

            {note.items.length > 0 && (
              <div className="mb-4 text-sm">
                <p className="font-semibold mb-2">Piezas:</p>
                <ul className="list-disc list-inside text-gray-600">
                  {note.items.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      {item.description} - {item.color} - Qty: {item.quantity}
                    </li>
                  ))}
                  {note.items.length > 3 && (
                    <li>...y {note.items.length - 3} más</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              {note.status === 'draft' && (
                <button
                  onClick={() => updateStatus({ id: note.id, status: 'pending' })}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  → Pendiente
                </button>
              )}
              {note.status === 'pending' && (
                <button
                  onClick={() => updateStatus({ id: note.id, status: 'reviewed' })}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  → Revisado
                </button>
              )}
              <button
                onClick={() => deleteDeliveryNote(note.id)}
                disabled={note.status !== 'draft'}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title={note.status !== 'draft' ? 'Solo se pueden eliminar borradores' : 'Eliminar'}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}