/**
 * PAGE: DeliveryNoteDetailsPage - Vista individual de un albarán
 * Diseño profesional dark theme
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useDeliveryNotes, useUpdateDeliveryNote } from '../features/delivery-notes/hooks/useDeliveryNotes'

export function DeliveryNoteDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: deliveryNotes, isLoading } = useDeliveryNotes()

  const deliveryNote = deliveryNotes?.find(note => note.id === id)

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando albarán...</p>
        </div>
      </div>
    )
  }

  if (!deliveryNote) {
    return (
      <div className="bg-gray-900 min-h-screen text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Albarán no encontrado</h2>
          <p className="text-gray-400 mb-6">El albarán #{id} no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      finalized: {
        bg: 'bg-green-900/30',
        text: 'text-green-400',
        border: 'border-green-800/30',
        icon: 'check_circle',
        label: 'Finalizado'
      },
      validated: {
        bg: 'bg-amber-900/30',
        text: 'text-amber-400',
        border: 'border-amber-800/30',
        icon: 'schedule',
        label: 'Validado'
      },
      draft: {
        bg: 'bg-blue-900/30',
        text: 'text-blue-400',
        border: 'border-blue-800/30',
        icon: 'edit',
        label: 'Borrador'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          {config.icon === 'check_circle' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />}
          {config.icon === 'schedule' && <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />}
          {config.icon === 'edit' && <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />}
        </svg>
        {config.label}
      </span>
    )
  }


  const { mutateAsync: updateDeliveryNote, isPending: isUpdating } = useUpdateDeliveryNote()

  const handleValidate = async () => {
    if (!deliveryNote) return
    if (!confirm('¿Estás seguro de que deseas validar este albarán? Una vez validado, quedará bloqueado para edición.')) return

    try {
      await updateDeliveryNote({
        id: deliveryNote.id,
        data: {
          customerId: deliveryNote.customerId,
          items: deliveryNote.items, // Pass existing items
          status: 'validated'
        }
      })
      // The query invalidation in hook will refresh the page data
    } catch (error) {
      console.error('Error validating:', error)
      alert('Error al validar el albarán. Asegúrate de que tenga items y datos correctos.')
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Albarán #{deliveryNote.number}</h1>
                <p className="text-gray-400">Cliente: {deliveryNote.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(deliveryNote.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Información del Albarán</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Entrega</p>
                  <p className="text-white font-medium">
                    {new Date(deliveryNote.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Creación</p>
                  <p className="text-white font-medium">
                    {new Date(deliveryNote.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              {deliveryNote.notes && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm">Notas</p>
                  <p className="text-gray-200 mt-1">{deliveryNote.notes}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Items del Albarán</h2>
              <div className="space-y-4">
                {deliveryNote.items.map((item) => (
                  <div key={item.id} className="bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-white">{item.description}</h3>
                        <p className="text-gray-400 text-sm">Color: {item.color}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">€{item.totalPrice.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">€{(item.unitPrice || 0).toFixed(2)} x {item.quantity}</p>
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      {item.measurements.linearMeters && (
                        <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                          {item.measurements.linearMeters} ml
                        </span>
                      )}
                      {item.measurements.squareMeters && (
                        <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">
                          {item.measurements.squareMeters} m²
                        </span>
                      )}
                      {item.measurements.thickness && (
                        <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded">
                          Grosor: {item.measurements.thickness}mm
                        </span>
                      )}
                      {item.isHighThickness && (
                        <span className="bg-orange-900/30 text-orange-400 px-2 py-1 rounded border border-orange-700/50">
                          Grosor Especial (+70%)
                        </span>
                      )}
                      {item.hasPrimer && (
                        <span className="bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded border border-indigo-700/50">
                          Imprimación (x2)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Resumen</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Items</span>
                  <span className="text-white font-medium">
                    {deliveryNote.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado</span>
                  <span>{getStatusBadge(deliveryNote.status)}</span>
                </div>
                <hr className="border-gray-700" />
                <div className="flex justify-between text-lg">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold">€{deliveryNote.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Acciones</h2>
              <div className="space-y-3">
                {deliveryNote.status === 'draft' && (
                  <button
                    onClick={handleValidate}
                    disabled={isUpdating}
                    className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-900/20 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    Validar Albarán
                  </button>
                )}

                {deliveryNote.status === 'draft' && (
                  <button
                    onClick={() => navigate(`/delivery-notes/${id}/edit`)}
                    disabled={isUpdating}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Editar Albarán
                  </button>
                )}

                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                  Generar PDF
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                  Duplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}