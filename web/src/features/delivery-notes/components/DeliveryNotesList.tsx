/**
 * COMPONENT: DeliveryNotesList
 * Actualizado para usar la nueva estructura DeliveryNote
 */

import { useDeliveryNotes } from '../hooks/useDeliveryNotes'

export function DeliveryNotesList() {
  const { data: deliveryNotes, isLoading, error } = useDeliveryNotes()

  if (isLoading) {
    return <div className="text-center py-4 text-gray-200">Cargando albaranes...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center py-4">Error cargando albaranes</div>
  }

  if (!deliveryNotes || deliveryNotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">No hay albaranes registrados</div>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      reviewed: { 
        bg: 'bg-green-900/30', 
        text: 'text-green-400', 
        border: 'border-green-800/30', 
        label: 'Revisado' 
      },
      pending: { 
        bg: 'bg-amber-900/30', 
        text: 'text-amber-400', 
        border: 'border-amber-800/30', 
        label: 'Pendiente' 
      },
      draft: { 
        bg: 'bg-blue-900/30', 
        text: 'text-blue-400', 
        border: 'border-blue-800/30', 
        label: 'Borrador' 
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <h3 className="text-lg font-semibold p-4 bg-gray-900 border-b border-gray-700 text-white">
        Lista de Albaranes
      </h3>
      <div className="divide-y divide-gray-700">
        {deliveryNotes.map((deliveryNote) => (
          <div key={deliveryNote.id} className="p-4 hover:bg-gray-700/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-white">
                  {deliveryNote.customerName}
                </h4>
                <p className="text-sm text-gray-400">
                  Fecha: {new Date(deliveryNote.date).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(deliveryNote.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">
                  Total: €{deliveryNote.totalAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">ID: #{deliveryNote.id}</p>
                <div className="mt-1">
                  {getStatusBadge(deliveryNote.status)}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Items:</h5>
              <div className="text-sm text-gray-400 space-y-1">
                {deliveryNote.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.description} - {item.color} (Qty: {item.quantity})
                    </span>
                    <span className="text-white font-medium">
                      €{item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mostrar medidas */}
            <div className="mt-2">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Medidas:</h5>
              <div className="text-sm text-gray-400 space-y-1">
                {deliveryNote.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.description}:</span>
                    <span>
                      {item.measurements.linearMeters && `${item.measurements.linearMeters} ml`}
                      {item.measurements.squareMeters && `${item.measurements.squareMeters} m²`}
                      {item.measurements.thickness && ` - Grosor: ${item.measurements.thickness}mm`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {deliveryNote.notes && (
              <div className="mt-2">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Notas:</strong> {deliveryNote.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}