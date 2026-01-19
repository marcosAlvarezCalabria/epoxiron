/**
 * COMPONENT: CustomerForm - Formulario para crear/editar clientes
 * Incluye gestión de precios (tarifas) integradas
 */

import { useState, useEffect } from 'react'

interface SpecialPiece {
  name: string
  price: number
}

interface CustomerFormProps {
  customer?: any // Customer editando o null para nuevo
  onSubmit: (customerData: any) => void
  onCancel: () => void
  onDelete?: () => void
  isLoading?: boolean
}

export function CustomerForm({ customer, onSubmit, onCancel, onDelete, isLoading = false }: CustomerFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',

    // Pricing
    pricePerLinearMeter: 0,
    pricePerSquareMeter: 0,
    minimumRate: 0,
    specialPieces: [] as SpecialPiece[]
  })

  // State for new special piece input
  const [newPiece, setNewPiece] = useState({ name: '', price: 0 })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        notes: customer.notes || '',

        // Load existing prices or defaults
        pricePerLinearMeter: customer.pricePerLinearMeter || 0,
        pricePerSquareMeter: customer.pricePerSquareMeter || 0,
        minimumRate: customer.minimumRate || 0,
        specialPieces: customer.specialPieces ? [...customer.specialPieces] : []
      })
    }
  }, [customer])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio'
    } else if (!/^[+]?[0-9\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono no válido'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria'
    }

    if (formData.pricePerLinearMeter <= 0) {
      newErrors.pricePerLinearMeter = 'Requerido'
    }

    if (formData.pricePerSquareMeter <= 0) {
      newErrors.pricePerSquareMeter = 'Requerido'
    }

    if (formData.minimumRate <= 0) {
      newErrors.minimumRate = 'Requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Clean empty fields
    const cleanData = {
      ...formData,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined,
      notes: formData.notes.trim() || undefined
    }

    onSubmit(cleanData)
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clean error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addSpecialPiece = () => {
    if (!newPiece.name.trim()) return

    setFormData(prev => ({
      ...prev,
      specialPieces: [...prev.specialPieces, { ...newPiece }]
    }))
    setNewPiece({ name: '', price: 0 })
  }

  const removeSpecialPiece = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialPieces: prev.specialPieces.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              {customer ? 'Editar Cliente y Tarifas' : 'Nuevo Cliente'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Configura los datos del cliente y sus precios asignados
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN: Customer Data */}
            <div className="space-y-6">
              <h4 className="text-white font-bold border-b border-gray-700 pb-2">Datos Personales</h4>

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
                  className={`w-full rounded-xl text-white bg-gray-900 border h-12 px-4 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${errors.name
                    ? 'border-red-600 focus:border-red-600'
                    : 'border-gray-700 focus:border-blue-600'
                    }`}
                  placeholder="Ej: Empresa SA..."
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isLoading}
                    className={`w-full rounded-xl text-white bg-gray-900 border h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${errors.email ? 'border-red-600 focus:border-red-600' : 'border-gray-700 focus:border-blue-600'}`}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={isLoading}
                    className={`w-full rounded-xl text-white bg-gray-900 border h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${errors.phone ? 'border-red-600 focus:border-red-600' : 'border-gray-700 focus:border-blue-600'}`}
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={isLoading}
                  className={`w-full rounded-xl text-white bg-gray-900 border h-10 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600/40 ${errors.address ? 'border-red-600 focus:border-red-600' : 'border-gray-700 focus:border-blue-600'}`}
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 p-3 focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Pricing Data */}
            <div className="space-y-6">
              <h4 className="text-blue-400 font-bold border-b border-blue-900/50 pb-2">Tarifas y Precios</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Linear Meter Card */}
                <div className={`bg-gray-800 rounded-xl border p-4 flex flex-col items-center justify-center transition-all ${errors.pricePerLinearMeter ? 'border-red-500/50 bg-red-900/10' : 'border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50'}`}>
                  <div className="text-blue-400 mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Metro Lineal</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerLinearMeter || ''}
                      onChange={(e) => handleChange('pricePerLinearMeter', parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 pl-7 pr-3 text-center text-white font-bold text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.pricePerLinearMeter && <p className="text-red-400 text-xs mt-1 font-medium">{errors.pricePerLinearMeter}</p>}
                </div>

                {/* Square Meter Card */}
                <div className={`bg-gray-800 rounded-xl border p-4 flex flex-col items-center justify-center transition-all ${errors.pricePerSquareMeter ? 'border-red-500/50 bg-red-900/10' : 'border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50'}`}>
                  <div className="text-purple-400 mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4v16M16 4v16M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Metro Cuadrado</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerSquareMeter || ''}
                      onChange={(e) => handleChange('pricePerSquareMeter', parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 pl-7 pr-3 text-center text-white font-bold text-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.pricePerSquareMeter && <p className="text-red-400 text-xs mt-1 font-medium">{errors.pricePerSquareMeter}</p>}
                </div>

                {/* Minimum Rate Card */}
                <div className={`bg-gray-800 rounded-xl border p-4 flex flex-col items-center justify-center transition-all ${errors.minimumRate ? 'border-red-500/50 bg-red-900/10' : 'border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50'}`}>
                  <div className="text-green-400 mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Tarifa Mínima</label>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minimumRate || ''}
                      onChange={(e) => handleChange('minimumRate', parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 pl-7 pr-3 text-center text-white font-bold text-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.minimumRate && <p className="text-red-400 text-xs mt-1 font-medium">{errors.minimumRate}</p>}
                </div>
              </div>

              {/* Special Pieces */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Piezas Especiales</label>

                {/* List as Tags */}
                <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                  {formData.specialPieces.length === 0 && (
                    <p className="text-gray-500 text-sm italic py-2 w-full text-center border-2 border-dashed border-gray-700 rounded-lg">No hay piezas especiales asignadas</p>
                  )}
                  {formData.specialPieces.map((piece, i) => (
                    <div key={i} className="group flex items-center bg-blue-900/30 border border-blue-700/50 pl-3 pr-1 py-1 rounded-full text-sm hover:bg-blue-900/50 transition-colors">
                      <span className="text-blue-200 font-medium mr-2">{piece.name}</span>
                      <span className="bg-blue-900/80 text-blue-100 px-2 py-0.5 rounded-full text-xs font-mono border border-blue-700/50">€{piece.price}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecialPiece(i)}
                        className="ml-2 w-6 h-6 flex items-center justify-center rounded-full text-blue-400 hover:bg-blue-800 hover:text-white transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Bar */}
                <div className="flex gap-3 items-center bg-gray-900/50 p-2 rounded-lg border border-gray-700/50">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre de la pieza (Ej: Esquinera)"
                      value={newPiece.name}
                      onChange={(e) => setNewPiece(prev => ({ ...prev, name: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialPiece())}
                      className="w-full bg-gray-800 border-none rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-28 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">€</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newPiece.price || ''}
                      onChange={(e) => setNewPiece(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialPiece())}
                      className="w-full bg-gray-800 border-none rounded-md py-2 pl-6 pr-3 text-sm text-right text-white font-mono placeholder-gray-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSpecialPiece}
                    disabled={!newPiece.name.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:bg-gray-700 flex items-center gap-1"
                  >
                    <span>Añadir</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-700 justify-between">
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
              {customer && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-red-900/30 text-red-500 border border-red-800/50 px-6 py-3 rounded-lg hover:bg-red-900/50 transition-colors disabled:opacity-50 font-medium sm:mr-auto"
                >
                  Eliminar Cliente
                </button>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
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
                {isLoading ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
