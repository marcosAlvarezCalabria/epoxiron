/**
 * PAGE: CreateDeliveryNotePage - Crear nuevo albarán
 */

import { useNavigate } from 'react-router-dom'
import { DeliveryNoteForm } from '../features/delivery-notes/components/DeliveryNoteForm'
import { Navbar } from '@/components/layout/Navbar'

export function CreateDeliveryNotePage() {
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccess = (_newDeliveryNoteId: string) => {
    // Redirigir al listado o al albarán creado
    navigate('/delivery-notes')
  }

  const handleCancel = () => {
    navigate('/delivery-notes')
  }

  return (
    <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
        <Navbar />

        <main className="max-w-7xl mx-auto pb-24">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-6">
            <div>
              <h2 className="text-white tracking-tight text-2xl font-bold leading-tight">
                Crear Nuevo Albarán
              </h2>
              <p className="text-gray-400 text-sm">Añade items y configura el albarán de entrega</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gray-700 text-white text-base font-medium leading-normal tracking-[0.015em] hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-4">
            <DeliveryNoteForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  )
}