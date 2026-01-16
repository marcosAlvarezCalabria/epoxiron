/**
 * PAGE: RatesPage - Gestión completa de tarifas
 * Dark theme consistente con CustomersPage
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/stores/authStore'
import { useRates, useCreateRate, useUpdateRate, useDeleteRate } from '@/features/rates/hooks/useRates'
import { RateForm } from '../features/rates/components/RateForm'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

export function RatesPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: rates, isLoading } = useRates()
  const { mutate: createRate, isPending: isCreating } = useCreateRate()
  const { mutate: updateRate, isPending: isUpdating } = useUpdateRate()
  const { data: customers } = useCustomers() // Añadir esto

  const [showForm, setShowForm] = useState(false)
  const [editingRate, setEditingRate] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNewRate = () => {
    setEditingRate(null)
    setShowForm(true)
  }

  const handleEditRate = (rate: any) => {
    setEditingRate(rate)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingRate(null)
  }

  const handleSubmitRate = (rateData: any) => {
    // Map form data (legacy/view model) to Domain DTO
    const domainDTO = {
      customerId: rateData.customerId,
      pricePerLinearMeter: rateData.ratePerLinearMeter,
      pricePerSquareMeter: rateData.ratePerSquareMeter,
      minimumPrice: rateData.minimumRate,
      specialPieces: rateData.specialPieces
    }

    if (editingRate) {
      updateRate(
        { id: editingRate.id, ...domainDTO },
        {
          onSuccess: () => {
            handleCloseForm()
          }
        }
      )
    } else {
      createRate(domainDTO, {
        onSuccess: () => {
          handleCloseForm()
        }
      })
    }
  }

  const { mutate: deleteRate, isPending: isDeleting } = useDeleteRate() // Add hook

  // ...

  const handleDeleteRate = (rateId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarifa?')) {
      deleteRate(rateId)
    }
  }

  const getCustomerName = (customerId: string) => {
    if (!customers || !customerId) return 'Cliente desconocido'
    const customer = customers.find(c => c.id === customerId)
    return customer?.name || 'Cliente desconocido'
  }

  const filteredRates = rates?.filter(rate => {
    const customerName = getCustomerName(rate.customerId)
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.id.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  const isFormLoading = isCreating || isUpdating

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 px-4 flex-1 justify-center">
            <button
              onClick={() => navigate('/delivery-notes')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Albaranes
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-white transition-colors"
            >
              Clientes
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <button
              className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:text-blue-400 transition-colors"
            >
              Tarifas
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
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
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </button>
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex border-t border-gray-700 px-4 gap-6 bg-gray-800 overflow-x-auto">
          <button
            onClick={() => navigate('/delivery-notes')}
            className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-400 pb-[10px] pt-3 whitespace-nowrap hover:text-white transition-colors"
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
            className="flex flex-col items-center justify-center border-b-[3px] border-blue-600 text-blue-600 pb-[10px] pt-3 whitespace-nowrap"
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
              Gestión de Tarifas
            </h2>
            <p className="text-gray-400 text-sm">Administra las tarifas de precios para los productos</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleNewRate}
              disabled={isFormLoading}
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              <span className="truncate">Nueva Tarifa</span>
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
                placeholder="Buscar tarifa por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Tarifas</p>
              <p className="text-2xl font-bold text-white">{rates?.length || 0}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Activas</p>
              <p className="text-2xl font-bold text-green-400">{rates?.length || 0}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Filtradas</p>
              <p className="text-2xl font-bold text-blue-400">{filteredRates.length}</p>
            </div>
          </div>
        </div>

        {/* Rates List */}
        <div className="px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-black/20 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold">Lista de Tarifas</h3>
              <span className="text-gray-400 text-sm">{filteredRates.length} tarifas</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Cargando tarifas...
              </div>
            ) : filteredRates.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-black/10">
                    <tr>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">€/ml</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">€/m²</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Mínimo</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold">Estado</th>
                      <th className="px-4 py-3 text-gray-400 text-sm font-bold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredRates.map((rate) => (
                      <tr key={rate.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-bold text-white">{getCustomerName(rate.customerId)}</p>
                            <p className="text-gray-400 text-xs">Tarifa ID: {rate.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-200">
                          <span className="font-mono text-green-400">€{rate.ratePerLinearMeter.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-200">
                          <span className="font-mono text-blue-400">€{rate.ratePerSquareMeter.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-200">
                          <span className="font-mono text-purple-400">€{rate.minimumRate.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-800/30">
                            Activa
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditRate(rate)}
                              disabled={isFormLoading}
                              className="p-2 text-blue-600 hover:bg-blue-600/20 rounded-lg transition-colors disabled:opacity-50"
                              title="Editar tarifa"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteRate(rate.id)}
                              disabled={isFormLoading}
                              className="p-2 text-red-600 hover:bg-red-600/20 rounded-lg transition-colors disabled:opacity-50"
                              title="Eliminar tarifa"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
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
                    <p className="mb-4">No se encontraron tarifas con "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-blue-600 hover:text-blue-400"
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">No hay tarifas registradas</p>
                    <button
                      onClick={handleNewRate}
                      disabled={isFormLoading}
                      className="text-blue-600 hover:text-blue-400 disabled:opacity-50"
                    >
                      Crear la primera tarifa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RateForm real en lugar del placeholder */}
      {showForm && (
        <RateForm
          rate={editingRate}
          onSubmit={handleSubmitRate}
          onCancel={handleCloseForm}
          isLoading={isFormLoading}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleNewRate}
        disabled={isFormLoading}
        className="fixed bottom-6 right-6 flex w-16 h-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/40 focus:outline-none hover:scale-105 transition-transform active:scale-95 z-[60] disabled:opacity-50"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
      </button>
    </div>
  )
}
