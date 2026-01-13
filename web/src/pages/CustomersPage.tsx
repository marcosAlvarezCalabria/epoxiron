/**
 * PAGE: CustomersPage - Gestión completa de clientes
 * Implementa las especificaciones del design.md
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useRates } from '@/features/rates/hooks/useRates'

export function CustomersPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: customers, isLoading } = useCustomers()
  const { data: rates } = useRates()
  
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNewCustomer = () => {
    setEditingCustomer(null)
    setShowForm(true)
  }

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  const handleSubmitCustomer = (customerData: any) => {
    console.log('Guardando cliente:', customerData)
    // TODO: Implementar guardado
    handleCloseForm()
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      console.log('Eliminando cliente:', customerId)
      // TODO: Implementar eliminación
    }
  }

  const getRateName = (rateId: string) => {
    return rateId ? 'Tarifa Asignada' : 'Sin tarifa'
  }

  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

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
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Albaranes 
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            <button 
              className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:text-blue-400 transition-colors"
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
        <div className="md:hidden flex border-t border-gray-700 px-4 gap-6 bg-gray-800 overflow-x-auto">
          <button 
            onClick={() => navigate('/delivery-notes')}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 pb-[10px] pt-3 whitespace-nowrap hover:text-white transition-colors"
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Albaranes</p>
          </button>
          <button 
            className="flex flex-col items-center justify-center border-b-[3px] border-blue-600 text-blue-600 pb-[10px] pt-3 whitespace-nowrap"
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
            <h2 className="text-white tracking-tight text-2xl font-bold leading-tight">
              Gestión de Clientes
            </h2>
            <p className="text-gray-400 text-sm">Administra los clientes y sus tarifas asociadas</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={handleNewCustomer}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              <span className="truncate">Nuevo Cliente</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar cliente por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Clientes</p>
              <p className="text-2xl font-bold text-white">{customers?.length || 0}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Con Tarifa</p>
              <p className="text-2xl font-bold text-green-400">
                {customers?.filter(c => c.rateId).length || 0}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Sin Tarifa</p>
              <p className="text-2xl font-bold text-red-400">
                {customers?.filter(c => !c.rateId).length || 0}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Filtrados</p>
              <p className="text-2xl font-bold text-blue-400">{filteredCustomers.length}</p>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-black/20 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold">Lista de Clientes</h3>
              <span className="text-gray-400 text-sm">{filteredCustomers.length} clientes</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Cargando clientes...
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-black/10">
                    <tr>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Email</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Teléfono</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Tarifa Asociada</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-bold text-white">{customer.name}</p>
                            <p className="text-gray-400 text-sm">ID: {customer.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-200">
                          <span className="text-gray-400">Sin implementar</span>
                        </td>
                        <td className="px-4 py-4 text-gray-200">
                          <span className="text-gray-400">Sin implementar</span>
                        </td>
                        <td className="px-4 py-4 text-gray-200">
                          {customer.rateId ? (
                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-800/30">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                              {getRateName(customer.rateId)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-red-900/30 text-red-400 border border-red-800/30">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5l5 5 5-5L15.5 8z"/>
                              </svg>
                              Sin tarifa
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEditCustomer(customer)}
                              className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors"
                              title="Editar cliente"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="p-2 text-red-600 hover:bg-red-600/20 rounded-lg transition-colors"
                              title="Eliminar cliente"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
              <div className="p-8 text-center text-gray-400">
                {searchTerm ? (
                  <div>
                    <p className="mb-4">No se encontraron clientes con "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="text-blue-600 hover:text-blue-400"
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">No hay clientes registrados</p>
                    <button 
                      onClick={handleNewCustomer}
                      className="text-blue-600 hover:text-blue-400"
                    >
                      Crear el primer cliente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Formulario Modal Placeholder */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <p className="text-gray-400 mb-4">
              Formulario placeholder - será implementado después
            </p>
            {editingCustomer && (
              <p className="text-gray-300 text-sm mb-4">
                Editando: {editingCustomer.name}
              </p>
            )}
            <div className="flex gap-3">
              <button 
                onClick={() => handleSubmitCustomer({ name: 'Cliente Test' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar
              </button>
              <button 
                onClick={handleCloseForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={handleNewCustomer}
        className="fixed bottom-6 right-6 flex w-16 h-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 focus:outline-none hover:scale-105 transition-transform active:scale-95 z-[60]"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      </button>
    </div>
  )
}
