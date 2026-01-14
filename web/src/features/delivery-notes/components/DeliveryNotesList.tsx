/**
 * COMPONENT: DeliveryNotesList
 * 
 * 🏗️ ANALOGÍA DE CONSTRUCCIÓN:
 * Este es el "Tablero de Obra". Muestra todas las notas de entrega organizadas.
 * Antes era un tablero desordenado con mucha información pegada.
 * Ahora usa las "Fichas Técnicas" (DeliveryNoteCard) para mostrar todo ordenado.
 * Es un Contenedor (Container Component) que orquesta la visualización.
 */

import { useDeliveryNotes } from '../hooks/useDeliveryNotes'
import { DeliveryNoteCard } from './DeliveryNoteCard'
import { useNavigate } from 'react-router-dom'

export function DeliveryNotesList() {
  const { data: deliveryNotes, isLoading, error } = useDeliveryNotes()
  const navigate = useNavigate()

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Cargando albaranes...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        Error cargando los albaranes. Por favor, recarga la página.
      </div>
    )
  }

  if (!deliveryNotes || deliveryNotes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No hay albaranes registrados todavía.</p>
        <p className="text-sm text-gray-400 mt-1">Crea uno nuevo para empezar.</p>
      </div>
    )
  }

  // Manejador de click - Navegación
  const handleCardClick = (id: string) => {
    navigate(`/delivery-notes/${id}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deliveryNotes.map((note) => (
        <DeliveryNoteCard
          key={note.id}
          note={note}
          onClick={handleCardClick}
        />
      ))}
    </div>
  )
}