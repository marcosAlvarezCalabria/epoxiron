/**
 * PAGE: DeliveryNotesPage - Gestión completa de albaranes
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { useDeliveryNotes, useDeleteDeliveryNote } from '../features/delivery-notes/hooks/useDeliveryNotes'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import { ConfirmDialog } from '../shared/components/ConfirmDialog'

export function DeliveryNotesPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { data: deliveryNotes = [], isLoading } = useDeliveryNotes()
  const { data: customers = [] } = useCustomers()
  const deleteDeliveryNote = useDeleteDeliveryNote()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Estados para el diálogo de confirmación
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
    const customer = customers.find(c => c.id === note.customerId)
    const customerName = customer?.name || ''
    
    const matchesSearch = searchTerm === '' || 
      note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || note.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
      case 'draft': return 'En Edición'
      case 'pending': return 'Pendiente Precios'
      case 'reviewed': return 'Finalizado'
      default: return 'Desconocido'
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

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Cargando albaranes...</span>
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 px-4 flex-1 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
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
              className="flex items-center gap-1 text-blue-600 font-bold text-sm"
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
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 pb-[10px] pt-3 whitespace-nowrap hover:text-white transition-colors"
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
            className="flex flex-col items-center justify-center border-b-[3px] border-blue-600 text-blue-600 pb-[10px] pt-3 whitespace-nowrap"
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
              Albaranes
            </h2>
            <p className="text-gray-400 text-sm">Gestión completa de albaranes de entrega</p>
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

        {/* Stats */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-white">{deliveryNotes.length}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Borradores</p>
              <p className="text-2xl font-bold text-gray-400">{deliveryNotes.filter(n => n.status === 'draft').length}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Validados</p>
              <p className="text-2xl font-bold text-yellow-400">{deliveryNotes.filter(n => n.status === 'pending').length}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Finalizados</p>
              <p className="text-2xl font-bold text-green-400">{deliveryNotes.filter(n => n.status === 'reviewed').length}</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por ID o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 pl-10 pr-4 transition-all focus:outline-none"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all focus:outline-none"
                >
                  <option value="">Todos los estados</option>
                  <option value="draft">En Edición</option>
                  <option value="pending">Pendiente Precios</option>
                  <option value="reviewed">Finalizado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Albaranes */}
        <div className="px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-black/20 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold">Todos los Albaranes</h3>
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
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Fecha</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredNotes.map((note) => (
                      <tr key={note.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-bold text-white">{note.id}</p>
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
                          <p className="font-mono font-bold text-white">
                            €{note.items?.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0).toFixed(2) || '0.00'}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold border ${getStatusColor(note.status)}`}>
                            {getStatusText(note.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gray-300 text-sm">{note.createdAt || 'Sin fecha'}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/delivery-notes/${note.id}`)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(note.id, getCustomerName(note.customerId))}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <h3 className="text-gray-400 text-lg font-medium mb-2">No hay albaranes</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {searchTerm || statusFilter 
                    ? 'No se encontraron albaranes que coincidan con los filtros aplicados.'
                    : 'Aún no has creado ningún albarán. ¡Crea tu primer albarán ahora!'
                  }
                </p>
                {!searchTerm && !statusFilter && (
                  <button 
                    onClick={() => navigate('/delivery-notes/new')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                    Crear primer albarán
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Albarán"
        message={`¿Estás seguro de que quieres eliminar el albarán "${deleteDialog.noteName}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive={true}
        isLoading={deleteDeliveryNote.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
