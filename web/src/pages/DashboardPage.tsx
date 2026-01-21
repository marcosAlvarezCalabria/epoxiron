/**
 * PAGE: Dashboard - Diseño profesional dark theme
 * Responsive para mobile y desktop con navegación moderna
 */

import { useAuthStore } from '@/features/auth/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useDeliveryNotes } from '../features/delivery-notes/hooks/useDeliveryNotes'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { Navbar } from '@/components/layout/Navbar'

export function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: deliveryNotes } = useDeliveryNotes()
  const { data: customers } = useCustomers()

  // Filter for TODAY's notes only
  const todayStr = new Date().toLocaleDateString('es-ES')

  const todaysNotes = deliveryNotes?.filter(note => {
    const noteDate = new Date(note.date).toLocaleDateString('es-ES')
    return noteDate === todayStr
  }) || []

  // Calculate stats based on TODAY
  const countToday = todaysNotes.length
  const pendingToday = todaysNotes.filter(note => note.status === 'validated').length
  const totalPiecesToday = todaysNotes.reduce((total, note) =>
    total + note.items.reduce((sum, item) => sum + item.quantity, 0), 0
  )
  const billingToday = todaysNotes.reduce((total, note) => total + (note.totalAmount || 0), 0)

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  function getStatusBadge(_status: string): import("react").ReactNode {
    throw new Error('Function not implemented.')
  }

  // ... helper function getStatusBadge ...

  return (
    <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto pb-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-2">
          <div>
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight capitalize">
              {currentDate}
            </h2>
            <p className="text-gray-400 text-sm">Resumen de actividad diaria</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/delivery-notes/new')}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              <span className="truncate">Nuevo albarán</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Updated to use TODAY's data */}
        <div className="px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 my-4 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Albaranes Hoy</p>
              <p className="text-2xl font-bold text-white">{countToday}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Pendientes</p>
              <p className="text-2xl font-bold text-red-400">{pendingToday}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Piezas Hoy</p>
              <p className="text-2xl font-bold text-white">{totalPiecesToday}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Facturación Hoy</p>
              <p className="text-2xl font-bold text-green-400">{billingToday.toFixed(2)}€</p>
            </div>
          </div>
        </div>

        {/* Delivery Notes Table */}
        <div className="flex items-center justify-between px-4 pb-4 pt-4">
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Últimos Albaranes
          </h3>
          <button
            onClick={() => navigate('/delivery-notes')}
            className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
          >
            Ver todos
          </button>
        </div>

        <div className="px-4 overflow-x-auto">
          <div className="min-w-[600px] bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Nº</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Fecha</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Estado</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Cant. Total</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-right">Importe</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {deliveryNotes && deliveryNotes.length > 0 ? (
                  deliveryNotes.slice(0, 5).map((note) => (
                    <tr
                      key={note.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/delivery-notes/${note.id}`)}
                    >
                      <td className="px-4 py-4 font-bold text-white">{note.number || note.id}</td>
                      <td className="px-4 py-4 text-gray-300">
                        {new Date(note.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-4 text-gray-200">{note.customerName}</td>
                      <td className="px-4 py-4">{getStatusBadge(note.status)}</td>
                      <td className="px-4 py-4 text-center text-gray-200">
                        {note.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-white">
                        {(note.totalAmount || 0).toFixed(2)}€
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation() // Evitar que se active el click de la fila
                            navigate(`/delivery-notes/${note.id}`)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No hay albaranes registrados.
                      <button
                        onClick={() => navigate('/delivery-notes')}
                        className="text-blue-600 hover:text-blue-400 ml-1"
                      >
                        Crear el primero
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/delivery-notes')}
        className="fixed bottom-6 right-6 flex w-16 h-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 focus:outline-none hover:scale-105 transition-transform active:scale-95 z-[60]"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
      </button>
    </div>
  )
}
