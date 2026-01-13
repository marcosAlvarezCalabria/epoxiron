/**
 * COMPONENT: CustomerForm - Formulario para crear/editar clientes
 * Dark theme consistente con el diseño de la app
 */

import { useState, useEffect } from 'react'
import { useRates } from '@/features/rates/hooks/useRates'

interface CustomerFormProps {
  customer?: any // Customer editando o null para nuevo
  onSubmit: (customerData: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CustomerForm({ customer, onSubmit, onCancel, isLoading = false }: CustomerFormProps) {
  const { data: rates } = useRates()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    rateId: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        rateId: customer.rateId || '',
        notes: customer.notes || ''
      })
    }
  }, [customer])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido'
    }

    if (formData.phone && !/^[+]?[0-9\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono no válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Limpiar campos vacíos
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== '')
    )

    onSubmit(cleanData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {customer ? 'Modifica los datos del cliente' : 'Añade un nuevo cliente al sistema'}
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Cliente *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                errors.name 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-700 focus:border-blue-600'
              }`}
              placeholder="Ej: Empresa SA, Juan Pérez..."
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={isLoading}
                className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                  errors.email 
                    ? 'border-red-600 focus:border-red-600' 
                    : 'border-gray-700 focus:border-blue-600'
                }`}
                placeholder="cliente@empresa.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={isLoading}
                className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                  errors.phone 
                    ? 'border-red-600 focus:border-red-600' 
                    : 'border-gray-700 focus:border-blue-600'
                }`}
                placeholder="+34 600 000 000"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Dirección
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-12 px-4 transition-all disabled:opacity-50 focus:outline-none"
              placeholder="Calle, número, ciudad..."
            />
          </div>

          {/* Remover completamente el selector de tarifas */}
          {/* Las tarifas se asignan desde la página de tarifas */}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 p-4 transition-all disabled:opacity-50 resize-none focus:outline-none"
              placeholder="Información adicional sobre el cliente..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gray-700 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
