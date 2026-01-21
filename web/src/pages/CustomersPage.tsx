/**
 * PAGE: CustomersPage - Gestión completa de clientes
 * Implementa las especificaciones del design.md
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../features/customers/hooks/useCustomers'

import { CustomerForm } from '../features/customers/components/CustomerForm'
import { Navbar } from '../components/layout/Navbar'

export function CustomersPage() {
  const navigate = useNavigate()
  const { data: customers, isLoading } = useCustomers()

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer()
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer()
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer()

  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

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
    if (editingCustomer) {
      // Actualizar cliente existente
      updateCustomer(
        { id: editingCustomer.id, ...customerData },
        {
          onSuccess: () => {
            toast.success('Cliente actualizado correctamente')
            handleCloseForm()
          },
          onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar cliente')
          }
        }
      )
    } else {
      // Crear nuevo cliente
      createCustomer(customerData, {
        onSuccess: () => {
          toast.success('Cliente creado correctamente')
          handleCloseForm()
        },
        onError: (error: any) => {
          if (error.message?.includes('already exists')) {
            toast.error('Ya existe un cliente con este nombre')
          } else {
            toast.error(error.message || 'Error al crear cliente')
          }
        }
      })
    }
  }

  const handleDeleteCustomer = () => {
    if (!editingCustomer) return

    if (confirm(`¿Estás seguro de que quieres eliminar al cliente "${editingCustomer.name}"?`)) {
      deleteCustomer(editingCustomer.id, {
        onSuccess: () => {
          toast.success('Cliente eliminado correctamente')
          handleCloseForm()
        },
        onError: () => {
          toast.error('Error al eliminar cliente')
        }
      })
    }
  }

  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const isFormLoading = isCreating || isUpdating || isDeleting

  return (
    <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
        <Navbar />

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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
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
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
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

          {/* Stats - Simplified */}
          <div className="px-4 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 grid grid-cols-2 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col gap-1">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Clientes</p>
                <p className="text-2xl font-bold text-white">{customers?.length || 0}</p>
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
                <>
                  {/* Desktop View: Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-black/10">
                        <tr>
                          <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
                          <th className="px-4 py-3 text-gray-400 text-sm font-bold">Email</th>
                          <th className="px-4 py-3 text-gray-400 text-sm font-bold">Teléfono</th>
                          <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {filteredCustomers.map((customer) => (
                          <tr
                            key={customer.id}
                            onClick={() => handleEditCustomer(customer)}
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-bold text-white">{customer.name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-200">
                              {(customer as any).email ? (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                  </svg>
                                  <span className="text-white text-sm truncate max-w-[150px]" title={(customer as any).email}>
                                    {(customer as any).email}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">Sin email</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-gray-200">
                              {(customer as any).phone ? (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                  </svg>
                                  <span className="text-white text-sm">
                                    {(customer as any).phone}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">Sin teléfono</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditCustomer(customer)}
                                  disabled={isFormLoading}
                                  className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors disabled:opacity-50"
                                  title="Editar cliente"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View: Cards */}
                  <div className="md:hidden grid grid-cols-1 divide-y divide-gray-700 bg-gray-800">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => handleEditCustomer(customer)}
                        className="p-4 active:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg">{customer.name}</h4>
                          <button
                            className="p-1.5 text-blue-500 bg-blue-500/10 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {/* Email */}
                          <div className="flex items-center gap-2 text-gray-300">
                            <div className="w-5 flex justify-center">
                              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                              </svg>
                            </div>
                            <span className="text-sm truncate">{(customer as any).email || 'Sin email'}</span>
                          </div>

                          {/* Phone */}
                          <div className="flex items-center gap-2 text-gray-300">
                            <div className="w-5 flex justify-center">
                              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                              </svg>
                            </div>
                            <span className="text-sm">{(customer as any).phone || 'Sin teléfono'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
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

        {/* Modal CustomerForm */}
        {showForm && (
          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleSubmitCustomer}
            onCancel={handleCloseForm}
            onDelete={editingCustomer ? handleDeleteCustomer : undefined}
            isLoading={isFormLoading}
          />
        )}

        {/* Floating Action Button */}
        <button
          onClick={handleNewCustomer}
          className="fixed bottom-6 right-6 flex w-16 h-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 focus:outline-none hover:scale-105 transition-transform active:scale-95 z-[60]"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
