/**
 * PAGE: DailySummaryPage - Control diario de albaranes
 * Reemplaza DashboardPage con funcionalidad de resumen diario
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { useDeliveryNotes, useDeleteDeliveryNote } from '../features/delivery-notes/hooks/useDeliveryNotes'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function DailySummaryPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: deliveryNotes = [] } = useDeliveryNotes()
  const { data: customers = [] } = useCustomers()
  const deleteDeliveryNote = useDeleteDeliveryNote()
  
  // Filtros
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Diálogo de confirmación para eliminar albarán
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    noteId: string
    noteName: string
  }>({
    isOpen: false,
    noteId: '',
    noteName: ''
  })

  // Filtrar albaranes
  const filteredNotes = deliveryNotes.filter(note => {
    const noteDate = note.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
    const matchesDate = !selectedDate || noteDate === selectedDate
    const matchesCustomer = !selectedCustomer || note.customerId === selectedCustomer
    const matchesStatus = !selectedStatus || note.status === selectedStatus
    
    return matchesDate && matchesCustomer && matchesStatus
  })

  // Stats del día
  const todayNotes = deliveryNotes.filter(note => {
    const today = new Date().toISOString().split('T')[0]
    const noteDate = note.createdAt?.split('T')[0] || today
    return noteDate === today
  })

  const stats = {
    total: todayNotes.length,
    borradores: todayNotes.filter(n => n.status === 'draft').length,
    validados: todayNotes.filter(n => n.status === 'pending').length,
    finalizados: todayNotes.filter(n => n.status === 'reviewed').length,
    correctos: todayNotes.filter(n => n.status === 'reviewed').length,
    sinPrecios: todayNotes.filter(n => n.items?.some(item => !item.totalPrice || item.totalPrice === 0)).length
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Cliente desconocido'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-900/30 text-gray-400 border-gray-800/30'
      case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800/30'
      case 'reviewed': return 'bg-green-900/30 text-green-400 border-green-800/30'
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador'
      case 'pending': return 'Validado'
      case 'reviewed': return 'Finalizado'
      default: return 'Desconocido'
    }
  }

  const handleMarkAsCorrect = (noteId: string) => {
    // TODO: Implementar actualización de estado a 'correct'
    console.log('Marcar como correcto:', noteId)
  }

  const getDatePreset = (preset: string) => {
    const today = new Date()
    switch (preset) {
      case 'today':
        return today.toISOString().split('T')[0]
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        return yesterday.toISOString().split('T')[0]
      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return weekStart.toISOString().split('T')[0]
      default:
        return selectedDate
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDeleteClick = (noteId: string, customerName: string) => {
    setDeleteDialog({
      isOpen: true,
      noteId,
      noteName: `${customerName} - #${noteId}`
    })
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteDeliveryNote.mutateAsync(deleteDialog.noteId)
      setDeleteDialog({ isOpen: false, noteId: '', noteName: '' })
    } catch (error) {
      console.error('Error eliminando albarán:', error)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, noteId: '', noteName: '' })
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
              className="flex items-center gap-1 text-blue-600 font-bold text-sm"
            >
              Resumen del Día
            </button>
            <button 
              onClick={() => navigate('/customers')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Clientes
            </button>
            <button 
              onClick={() => navigate('/rates')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Tarifas
            </button>
            <button 
              onClick={() => navigate('/delivery-notes')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Albaranes
            </button>
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex border-t border-gray-700 px-4 gap-6 bg-gray-800 overflow-x-auto">
          <button 
            className="flex flex-col items-center justify-center border-b-[3px] border-blue-600 text-blue-600 pb-[10px] pt-3 whitespace-nowrap"
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Resumen</p>
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
          <button 
            onClick={() => navigate('/delivery-notes')}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 pb-[10px] pt-3 whitespace-nowrap hover:text-white transition-colors"
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Albaranes</p>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pb-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-2">
          <div>
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight">
              Resumen del Día
            </h2>
            <p className="text-gray-400 text-sm">Control diario de albaranes y avisos de precios faltantes</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={() => navigate('/delivery-notes/new')}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              <span className="truncate">Nuevo Albarán</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Métricas del día */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Hoy</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Borradores</p>
              <p className="text-2xl font-bold text-gray-400">{stats.borradores}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Validados</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.validados}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Finalizados</p>
              <p className="text-2xl font-bold text-blue-400">{stats.finalizados}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Correctos</p>
              <p className="text-2xl font-bold text-green-400">{stats.correctos}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">⚠️ Sin Precios</p>
              <p className="text-2xl font-bold text-red-400">{stats.sinPrecios}</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h8v-2h-8V9h8V7h-8V5h8V3h-8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2h-8z"/>
              </svg>
              Filtros
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <button 
                    onClick={() => setSelectedDate(getDatePreset('today'))}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      selectedDate === getDatePreset('today')
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Hoy
                  </button>
                  <button 
                    onClick={() => setSelectedDate(getDatePreset('yesterday'))}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      selectedDate === getDatePreset('yesterday')
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Ayer
                  </button>
                  <button 
                    onClick={() => setSelectedDate(getDatePreset('week'))}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      selectedDate === getDatePreset('week')
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Semana
                  </button>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all focus:outline-none"
                />
              </div>

              {/* Customer Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all focus:outline-none"
                >
                  <option value="">Todos los clientes</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all focus:outline-none"
                >
                  <option value="">Todos los estados</option>
                  <option value="draft">Borrador</option>
                  <option value="pending">Validado</option>
                  <option value="reviewed">Finalizado</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setSelectedDate(new Date().toISOString().split('T')[0])
                    setSelectedCustomer('')
                    setSelectedStatus('')
                  }}
                  className="w-full h-10 bg-gray-700 text-gray-300 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Albaranes */}
        <div className="px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-black/20 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l8-4v8l-8 4z"/>
                </svg>
                Albaranes del Día
              </h3>
              <span className="text-gray-400 text-sm">{filteredNotes.length} albaranes</span>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-black/10">
                    <tr>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">ID</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Piezas</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Total</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Estado</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Avisos</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredNotes.map((note) => {
                      const hasMissingPrices = note.items?.some(item => 
                        !item.totalPrice || item.totalPrice === 0
                      ) || false
                      
                      return (
                        <tr key={note.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-bold text-white">{note.id}</p>
                              <p className="text-gray-400 text-xs">{note.createdAt?.split('T')[0]}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-white font-medium">{getCustomerName(note.customerId)}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-blue-900/30 text-blue-400 border border-blue-800/30">
                              {note.items?.length || 0} piezas
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-mono font-bold text-white">€{note.totalAmount?.toFixed(2) || '0.00'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold border ${getStatusColor(note.status)}`}>
                              {getStatusText(note.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {hasMissingPrices && (
                              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-red-900/30 text-red-400 border border-red-800/30">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                                </svg>
                                Sin precios
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => navigate(`/delivery-notes/${note.id}/edit`)}
                                className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors"
                                title="Ver/Editar albarán"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                              </button>
                              
                              {note.status === 'draft' && (
                                <button 
                                  onClick={() => handleDeleteClick(note.id, getCustomerName(note.customerId))}
                                  className="p-2 text-red-600 hover:bg-red-600/20 rounded-lg transition-colors"
                                  title="Eliminar albarán"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                  </svg>
                                </button>
                              )}
                              
                              {note.status === 'pending' && (
                                <button 
                                  onClick={() => handleMarkAsCorrect(note.id)}
                                  className="p-2 text-green-600 hover:bg-green-600/20 rounded-lg transition-colors"
                                  title="Marcar como finalizado"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l8-4v8l-8 4z"/>
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-300 mb-2">No hay albaranes para los filtros seleccionados</p>
                <p className="text-sm text-gray-500 mb-4">Prueba cambiando la fecha o eliminando filtros</p>
                <button 
                  onClick={() => navigate('/delivery-notes')}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-400 font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                  Crear el primer albarán del día
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/delivery-notes/new')}
        className="fixed bottom-6 right-6 flex w-16 h-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 focus:outline-none hover:scale-105 transition-transform active:scale-95 z-[60]"
        title="Nuevo Albarán"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      </button>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Albarán"
        message={`¿Estás seguro de que quieres eliminar el albarán "${deleteDialog.noteName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}