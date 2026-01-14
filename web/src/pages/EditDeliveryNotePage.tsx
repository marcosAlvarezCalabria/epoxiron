/**
 * PAGE: EditDeliveryNotePage - Editar albarán existente
 */

import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { useDeliveryNote } from '../features/delivery-notes/hooks/useDeliveryNotes'
import { DeliveryNoteForm } from '../features/delivery-notes/components/DeliveryNoteForm'

export function EditDeliveryNotePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user, logout } = useAuthStore()
  const { data: deliveryNote, isLoading, error } = useDeliveryNote(id!)

  const handleSuccess = (updatedDeliveryNoteId: string) => {
    navigate('/delivery-notes')
  }

  const handleCancel = () => {
    navigate('/delivery-notes')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Cargando albarán...</span>
        </div>
      </div>
    )
  }

  if (error || !deliveryNote) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">❌ Error</div>
          <div className="text-white mb-4">No se pudo cargar el albarán</div>
          <button 
            onClick={() => navigate('/delivery-notes')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Albaranes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center p-4 justify-between max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l8-4v8l-8 4z"/>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epoxiron</h2>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => navigate('/delivery-notes')} className="hover:text-white transition-colors">
              Albaranes
            </button>
            <span>/</span>
            <span className="text-blue-400">Editar #{deliveryNote.id}</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-300">
              Hola, {user?.email?.split('@')[0]}
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-6">
          <div>
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight">
              Editar Albarán #{deliveryNote.id}
            </h2>
            <p className="text-gray-400 text-sm">
              Estado: <span className={`font-medium ${
                deliveryNote.status === 'reviewed' ? 'text-green-400' :
                deliveryNote.status === 'pending' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {deliveryNote.status === 'reviewed' ? 'Finalizado' :
                 deliveryNote.status === 'pending' ? 'Validado' : 'Borrador'}
              </span>
            </p>
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
            deliveryNote={deliveryNote}
            isEditing={true}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  )
}