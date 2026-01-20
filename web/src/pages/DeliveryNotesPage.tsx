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

  // Calculate stats
  const todayDeliveryNotes = deliveryNotes?.length || 0
  const pendingNotes = deliveryNotes?.filter(note => note.status === 'validated').length || 0
  const totalPieces = deliveryNotes?.reduce((total, note) =>
    total + note.items.reduce((sum, item) => sum + item.quantity, 0), 0
  ) || 0
  const todayBilling = deliveryNotes?.reduce((total, note) => total + (note.totalAmount || 0), 0) || 0

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
            <p className="text-gray-400 text-sm">Panel de control del taller - {user?.email?.getValue()}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/delivery-notes')}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              <span className="truncate">Nuevo albarán</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 my-4 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Albaranes Hoy</p>
              <p className="text-2xl font-bold text-white">{todayDeliveryNotes}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Pendientes</p>
              <p className="text-2xl font-bold text-red-400">{pendingNotes}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Cantidad Total</p>
              <p className="text-2xl font-bold text-white">{totalPieces}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Facturación Hoy</p>
              <p className="text-2xl font-bold text-green-400">{todayBilling.toFixed(2)}€</p>
            </div>
          </div>
        </div>

        {/* Delivery Notes Table */}
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-4">
          Lista de Albaranes
        </h3>
        <div className="px-4 overflow-x-auto">
          <div className="min-w-[600px] bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Nº</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold">Estado</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Cant. Total</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-right">Importe</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {deliveryNotes && deliveryNotes.length > 0 ? (
                  deliveryNotes.map((note) => (
                    <tr
                      key={note.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/delivery-notes/${note.id}`)}
                    >
                      <td className="px-4 py-4 font-bold text-white">{note.number || note.id}</td>
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
