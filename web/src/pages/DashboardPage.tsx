/**
 * PAGE: Dashboard - Diseño profesional dark theme
 * Responsive para mobile y desktop con navegación moderna
 */

import { useAuthStore } from '@/features/auth/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useDeliveryNotes } from '../features/delivery-notes/hooks/useDeliveryNotes'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

export function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: deliveryNotes } = useDeliveryNotes()
  const { data: customers } = useCustomers()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Calculate stats
  const todayDeliveryNotes = deliveryNotes?.length || 0
  const pendingNotes = deliveryNotes?.filter(note => note.status === 'pending').length || 0
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
      reviewed: { 
        bg: 'bg-green-900/30', 
        text: 'text-green-400', 
        border: 'border-green-800/30', 
        icon: 'check_circle', 
        label: 'Revisado' 
      },
      pending: { 
        bg: 'bg-amber-900/30', 
        text: 'text-amber-400', 
        border: 'border-amber-800/30', 
        icon: 'schedule', 
        label: 'Pendiente' 
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
          {config.icon === 'check_circle' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>}
          {config.icon === 'schedule' && <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>}
          {config.icon === 'edit' && <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>}
        </svg>
        {config.label}
      </span>
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 px-4 flex-1 justify-center">
            <button 
              onClick={() => navigate('/delivery-notes')}
              className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:text-blue-400 transition-colors"
            >
              Albaranes 
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/customers')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Clientes 
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <button 
              onClick={() => navigate('/rates')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Tarifas 
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <button className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </button>
            <button 
              onClick={handleLogout}
              className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex border-t border-gray-700 px-4 gap-6 bg-gray-800 overflow-x-auto">
          <button 
            onClick={() => navigate('/delivery-notes')}
            className="flex flex-col items-center justify-center border-b-[3px] border-blue-600 text-blue-600 pb-[10px] pt-3 whitespace-nowrap"
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Albaranes</p>
          </button>
          <button 
            onClick={() => navigate('/customers')}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 pb-[10px] pt-3 whitespace-nowrap hover:text-white transition-colors"
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Clientes</p>
          </button>
          <button 
            onClick={() => navigate('/rates')}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 pb-[10px] pt-3 whitespace-nowrap hover:text-white transition-colors"
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Tarifas</p>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-2">
          <div>
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight capitalize">
              {currentDate}
            </h2>
            <p className="text-gray-400 text-sm">Panel de control del taller - {user?.email}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={() => navigate('/delivery-notes')}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
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
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Piezas</p>
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
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Piezas</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-right">Importe</th>
                  <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {deliveryNotes && deliveryNotes.length > 0 ? (
                  deliveryNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-white">#{note.id}</td>
                      <td className="px-4 py-4 text-gray-200">{note.customerName}</td>
                      <td className="px-4 py-4">{getStatusBadge(note.status)}</td>
                      <td className="px-4 py-4 text-center text-gray-200">
                        {note.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-white">
                        {note.totalAmount.toFixed(2)}€
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => navigate('/delivery-notes')}
                          className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
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
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      </button>
    </div>
  )
}
