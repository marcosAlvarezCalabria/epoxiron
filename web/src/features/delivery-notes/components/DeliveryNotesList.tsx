/**
 * COMPONENT: DeliveryNotesList
 * Corregido para usar la estructura correcta de DeliveryNote
 */

import { useDeliveryNotes } from '../hooks/useDeliveryNotes'
import { useCustomers } from '../../customers/hooks/useCustomers'

export function DeliveryNotesList() {
  const { data: deliveryNotes, isLoading, error } = useDeliveryNotes()
  const { data: customers = [] } = useCustomers()

  if (isLoading) {
    return <div className="text-center py-4 text-gray-200">Cargando albaranes...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center py-4">Error cargando albaranes</div>
  }

  if (!deliveryNotes || deliveryNotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">No hay albaranes registrados</div>
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Cliente desconocido'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      reviewed: { 
        bg: 'bg-green-900/30', 
        text: 'text-green-400', 
        border: 'border-green-800/30', 
        label: 'Finalizado' 
      },
      pending: { 
        bg: 'bg-yellow-900/30', 
        text: 'text-yellow-400', 
        border: 'border-yellow-800/30', 
        label: 'Validado' 
      },
      draft: { 
        bg: 'bg-gray-900/30', 
        text: 'text-gray-400', 
        border: 'border-gray-800/30', 
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
                  {getCustomerName(deliveryNote.customerId)}
                </h4>
                <p className="text-sm text-gray-400">
                  Fecha: {new Date(deliveryNote.createdAt).toLocaleDateString('es-ES')}
                </p>
                <p className="text-xs text-gray-500">
                  Actualizado: {new Date(deliveryNote.updatedAt).toLocaleDateString('es-ES')}
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
              <h5 className="text-sm font-medium text-gray-300 mb-1">Items ({deliveryNote.items.length} piezas):</h5>
              <div className="text-sm text-gray-400 space-y-1">
                {deliveryNote.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <span className="flex-1">
                      <strong className="text-white">{item.name}</strong>
                      {item.racColor && <span className="text-gray-300"> - {item.racColor}</span>}
                      {item.specialColor && <span className="text-blue-300"> - {item.specialColor}</span>}
                      <span className="text-gray-500"> (Qty: {item.quantity})</span>
                    </span>
                    <span className="text-white font-medium ml-4">
                      €{item.totalPrice?.toFixed(2) || '0.00'}
                      {(!item.totalPrice || item.totalPrice === 0) && (
                        <span className="text-red-400 text-xs ml-1">Sin precio</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mostrar medidas */}
            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Medidas:</h5>
              <div className="text-sm text-gray-400 space-y-1">
                {deliveryNote.items.map((item) => (
                  <div key={`measures-${item.id}`} className="flex justify-between">
                    <span>{item.name}:</span>
                    <span className="text-gray-300">
                      {item.linearMeters && `${item.linearMeters} ml`}
                      {item.linearMeters && item.squareMeters && ' | '}
                      {item.squareMeters && `${item.squareMeters} m²`}
                      {item.thickness && ` | Grosor: ${item.thickness}mm`}
                      {!item.linearMeters && !item.squareMeters && !item.thickness && (
                        <span className="text-gray-500">Sin medidas</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Precios unitarios */}
            {deliveryNote.items.some(item => item.unitPrice) && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-300 mb-1">Precios unitarios:</h5>
                <div className="text-sm text-gray-400 space-y-1">
                  {deliveryNote.items.map((item) => (
                    item.unitPrice && (
                      <div key={`price-${item.id}`} className="flex justify-between">
                        <span>{item.name}:</span>
                        <span className="text-gray-300">€{item.unitPrice.toFixed(2)}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {deliveryNote.notes && (
              <div className="mt-3 p-2 bg-gray-900/50 rounded">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Notas:</strong> {deliveryNote.notes}
                </p>
              </div>
            )}

            {/* Avisos */}
            {deliveryNote.items.some(item => !item.totalPrice || item.totalPrice === 0) && (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-800/30 rounded">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  <span className="text-red-400 text-sm font-medium">
                    Faltan precios en {deliveryNote.items.filter(item => !item.totalPrice || item.totalPrice === 0).length} item(s)
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}