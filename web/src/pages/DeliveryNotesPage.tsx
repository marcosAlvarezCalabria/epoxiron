/**
 * PAGE: DeliveryNotesPage - Listado completo de albaranes
 */

import { useDeliveryNotes } from '../features/delivery-notes/hooks/useDeliveryNotes'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Pagination } from '@/components/ui/Pagination'
import { useState, useEffect } from 'react'

export function DeliveryNotesPage() {
  const navigate = useNavigate()
  const { data: deliveryNotes, isLoading } = useDeliveryNotes()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  // Reset page when filtering or changing items per page
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

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

  // Filter logic
  const filteredNotes = deliveryNotes?.filter(note =>
    note.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.number || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentNotes = filteredNotes.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = filteredNotes.length

  return (
    <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto pb-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-6 pb-2">
          <div>
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight">
              Gestión de Albaranes
            </h2>
            <p className="text-gray-400 text-sm">Histórico completo y gestión de entregas</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/delivery-notes/new')}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              <span className="truncate">Nuevo Albarán</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-6 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por cliente o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Delivery Notes Table */}
        <div className="px-4 overflow-x-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">

            {isLoading ? (
              <div className="p-8 text-center text-gray-400 flex-grow">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Cargando albaranes...
              </div>
            ) : filteredNotes.length > 0 ? (
              <>
                <div className="overflow-x-auto">
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
                      {currentNotes.map((note) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </>
            ) : (
              <div className="p-8 text-center text-gray-400 flex-grow">
                {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : 'No hay albaranes registrados.'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
