/**
 * PAGE: CreateDeliveryNotePage - Crear nuevo albarán
 */

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { DeliveryNoteForm } from '../features/delivery-notes/components/DeliveryNoteForm'

export function CreateDeliveryNotePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccess = (_newDeliveryNoteId: string) => {
    // Redirigir al listado o al albarán creado
    navigate('/delivery-notes')
  }

  const handleCancel = () => {
    navigate('/delivery-notes')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
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
                <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l8-4v8l-8 4z" />
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
            <span className="text-blue-400">Nuevo Albarán</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-300">
              Hola, {user?.email?.getValue().split('@')[0]}
            </div>
            <button
              onClick={handleLogout}
              className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" />
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
  )
}