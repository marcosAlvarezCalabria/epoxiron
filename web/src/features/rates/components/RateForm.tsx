/**
 * COMPONENT: RateForm - Formulario para crear/editar tarifas
 * Dark theme consistente con CustomerForm
 */

import { useState, useEffect } from 'react'

interface RateFormProps {
  rate?: any // Rate editando o null para nuevo
  onSubmit: (rateData: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function RateForm({ rate, onSubmit, onCancel, isLoading = false }: RateFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: ''
  })

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form when editing
  useEffect(() => {
    if (rate) {
      setFormData({
        name: rate.name || '',
        description: rate.description || '',
        notes: rate.notes || ''
      })
    }
  }, [rate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
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
      <div className="bg-gray-800 rounded-xl w-full max-w-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              {rate ? 'Editar Tarifa' : 'Nueva Tarifa'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {rate ? 'Modifica los datos de la tarifa' : 'Crea una nueva tarifa de precios'}
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
              Nombre de la Tarifa *
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
              placeholder="Ej: Tarifa Estándar, Tarifa Premium..."
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Nombre principal de la tarifa
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descripción (opcional)
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-12 px-4 transition-all disabled:opacity-50 focus:outline-none"
              placeholder="Descripción adicional sobre la tarifa..."
            />
            <p className="text-gray-500 text-xs mt-1">
              Información adicional sobre esta tarifa
            </p>
          </div>

          {/* Notes - igual que antes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notas Internas (opcional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={isLoading}
              rows={4}
              className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 p-4 transition-all disabled:opacity-50 resize-none focus:outline-none"
              placeholder="Información adicional sobre esta tarifa, condiciones especiales, etc..."
            />
            <p className="text-gray-500 text-xs mt-1">
              Notas internas que solo verá el equipo
            </p>
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
                  Las tarifas se asignan a clientes para determinar precios específicos. 
                  Después de crear la tarifa, podrás configurar precios por producto.
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
              disabled={isLoading || !formData.name.trim()}
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
