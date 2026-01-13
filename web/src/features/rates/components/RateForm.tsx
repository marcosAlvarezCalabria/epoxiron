/**
 * COMPONENT: RateForm - Formulario para crear/editar tarifas
 * Actualizado con campos de precios por metro
 */

import { useState, useEffect } from 'react'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

interface Rate {
  id?: string
  customerId: string
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
}

interface RateFormProps {
  rate?: Rate | null
  onSubmit: (rateData: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function RateForm({ rate, onSubmit, onCancel, isLoading = false }: RateFormProps) {
  const { data: customers } = useCustomers()
  
  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    ratePerLinearMeter: '',
    ratePerSquareMeter: '',
    minimumRate: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form when editing
  useEffect(() => {
    if (rate) {
      setFormData({
        customerId: rate.customerId,
        ratePerLinearMeter: rate.ratePerLinearMeter.toString(),
        ratePerSquareMeter: rate.ratePerSquareMeter.toString(),
        minimumRate: rate.minimumRate.toString()
      })
    }
  }, [rate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = 'El cliente es obligatorio'
    }
    
    if (!formData.ratePerLinearMeter || isNaN(Number(formData.ratePerLinearMeter))) {
      newErrors.ratePerLinearMeter = 'El precio por metro lineal debe ser un número válido'
    }
    
    if (!formData.ratePerSquareMeter || isNaN(Number(formData.ratePerSquareMeter))) {
      newErrors.ratePerSquareMeter = 'El precio por metro cuadrado debe ser un número válido'
    }
    
    if (!formData.minimumRate || isNaN(Number(formData.minimumRate))) {
      newErrors.minimumRate = 'La tarifa mínima debe ser un número válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData = {
      customerId: formData.customerId,
      ratePerLinearMeter: Number(formData.ratePerLinearMeter),
      ratePerSquareMeter: Number(formData.ratePerSquareMeter),
      minimumRate: Number(formData.minimumRate)
    }

    onSubmit(submitData)
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
      <div className="bg-gray-800 rounded-xl w-full max-w-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              {rate ? 'Editar Tarifa' : 'Nueva Tarifa'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {rate ? 'Modifica los precios de la tarifa' : 'Configura una nueva tarifa de precios'}
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
          {/* Customer Selection */}
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-300 mb-2">
              Cliente *
            </label>
            <select
              id="customerId"
              value={formData.customerId}
              onChange={(e) => handleChange('customerId', e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                errors.customerId 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-700 focus:border-blue-600'
              }`}
            >
              <option value="">Selecciona un cliente</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-red-400 text-sm mt-1">{errors.customerId}</p>
            )}
          </div>

          {/* Rate Per Linear Meter */}
          <div>
            <label htmlFor="ratePerLinearMeter" className="block text-sm font-medium text-gray-300 mb-2">
              Precio por Metro Lineal (€/ml) *
            </label>
            <input
              id="ratePerLinearMeter"
              type="number"
              step="0.01"
              min="0"
              value={formData.ratePerLinearMeter}
              onChange={(e) => handleChange('ratePerLinearMeter', e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                errors.ratePerLinearMeter 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-700 focus:border-blue-600'
              }`}
              placeholder="25.50"
            />
            {errors.ratePerLinearMeter && (
              <p className="text-red-400 text-sm mt-1">{errors.ratePerLinearMeter}</p>
            )}
          </div>

          {/* Rate Per Square Meter */}
          <div>
            <label htmlFor="ratePerSquareMeter" className="block text-sm font-medium text-gray-300 mb-2">
              Precio por Metro Cuadrado (€/m²) *
            </label>
            <input
              id="ratePerSquareMeter"
              type="number"
              step="0.01"
              min="0"
              value={formData.ratePerSquareMeter}
              onChange={(e) => handleChange('ratePerSquareMeter', e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                errors.ratePerSquareMeter 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-700 focus:border-blue-600'
              }`}
              placeholder="45.00"
            />
            {errors.ratePerSquareMeter && (
              <p className="text-red-400 text-sm mt-1">{errors.ratePerSquareMeter}</p>
            )}
          </div>

          {/* Minimum Rate */}
          <div>
            <label htmlFor="minimumRate" className="block text-sm font-medium text-gray-300 mb-2">
              Tarifa Mínima (€) *
            </label>
            <input
              id="minimumRate"
              type="number"
              step="0.01"
              min="0"
              value={formData.minimumRate}
              onChange={(e) => handleChange('minimumRate', e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${
                errors.minimumRate 
                  ? 'border-red-600 focus:border-red-600' 
                  : 'border-gray-700 focus:border-blue-600'
              }`}
              placeholder="100.00"
            />
            {errors.minimumRate && (
              <p className="text-red-400 text-sm mt-1">{errors.minimumRate}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-blue-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-1">Sobre las Tarifas</p>
                <p className="text-blue-200/80">
                  Configura precios específicos por cliente. La tarifa mínima se aplica cuando el cálculo por metros es inferior.
                </p>
              </div>
            </div>
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
              disabled={isLoading || !formData.customerId || !formData.ratePerLinearMeter || !formData.ratePerSquareMeter || !formData.minimumRate}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {rate ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  {rate ? 'Actualizar Tarifa' : 'Crear Tarifa'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
