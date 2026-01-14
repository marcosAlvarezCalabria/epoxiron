/**
 * PAGE: DeliveryNotesPage - Gestión completa de albaranes
 * Conectado al backend con JWT authentication
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { useDeliveryNotes, useCreateDeliveryNote, useDeleteDeliveryNote } from '@/features/delivery-notes/hooks/useDeliveryNotes'
import { DeliveryNoteForm } from '@/features/delivery-notes/components/DeliveryNoteForm'
import type { CreateDeliveryNoteRequest } from '@/features/delivery-notes/types/DeliveryNote'

export function DeliveryNotesPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: deliveryNotes, isLoading } = useDeliveryNotes()
  const { mutate: createDeliveryNote, isPending: isCreating } = useCreateDeliveryNote()
  const { mutate: deleteDeliveryNote, isPending: isDeleting } = useDeleteDeliveryNote()

  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNewDeliveryNote = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleSubmitDeliveryNote = (data: CreateDeliveryNoteRequest) => {
    createDeliveryNote(data, {
      onSuccess: () => {
        handleCloseForm()
      },
      onError: (error) => {
        console.error('Error creating delivery note:', error)
        alert('Error al crear el albarán. Por favor intenta de nuevo.')
      }
    })
  }

  const handleDeleteDeliveryNote = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este albarán?')) {
      deleteDeliveryNote(id)
    }
  }

  const handleViewDeliveryNote = (id: string) => {
    navigate(`/delivery-notes/${id}`)
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
      case 'pending': return 'Pendiente'
      case 'reviewed': return 'Revisado'
      default: return 'Desconocido'
    }
  }

  const filteredNotes = deliveryNotes?.filter(note =>
    note.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const isFormLoading = isCreating

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
            <button
              onClick={() => navigate('/dashboard')}
              className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors"
              title="Dashboard"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </button>
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
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors"
              title="Dashboard"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </button>
            <button
              className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:text-blue-400 transition-colors"
            >
              Albaranes
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
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

      {/* Main Content */}
      <main className="p-4 max-w-7xl mx-auto w-full">
        {/* Search and Filters */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <h1 className="text-2xl font-bold mr-4">Gestión de Albaranes</h1>
              <span className="text-gray-400 text-sm">
                Bienvenido, {user?.name}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por cliente o ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleNewDeliveryNote}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Nuevo Albarán
              </button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Nuevo Albarán</h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-white"
                  disabled={isFormLoading}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <DeliveryNoteForm
                onSubmit={handleSubmitDeliveryNote}
                onCancel={handleCloseForm}
                isLoading={isFormLoading}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-gray-400">Cargando albaranes...</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotes.length === 0 && !searchTerm && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <p className="text-gray-400 text-lg mb-4">No hay albaranes todavía</p>
            <button
              onClick={handleNewDeliveryNote}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Crear el primer albarán
            </button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredNotes.length === 0 && searchTerm && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No se encontraron albaranes que coincidan con "{searchTerm}"</p>
          </div>
        )}

        {/* Delivery Notes Table */}
        {!isLoading && filteredNotes.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">
                        {note.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {note.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {new Date(note.date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(note.status)}`}>
                        {getStatusText(note.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {note.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {note.totalAmount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDeliveryNote(note.id)}
                        className="text-blue-600 hover:text-blue-400 transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleDeleteDeliveryNote(note.id)}
                        className="text-red-600 hover:text-red-400 transition-colors ml-4"
                        disabled={isDeleting}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
