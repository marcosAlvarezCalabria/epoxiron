/**
 * COMPONENT: CustomerForm - Formulario para crear/editar clientes
 * Incluye gestión de precios (tarifas) integradas
 */

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

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

  const [initialFormData, setInitialFormData] = useState<any>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize and populate form
  useEffect(() => {
    const startData = customer ? {
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
    } : {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      pricePerLinearMeter: 0,
      pricePerSquareMeter: 0,
      minimumRate: 0,
      specialPieces: []
    }

    setFormData(startData)
    setInitialFormData(startData)
  }, [customer])

  const handleCancel = () => {
    // Check if dirty
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData)

    if (isDirty) {
      if (!confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir y perder los cambios?')) {
        return
      }
    }
    onCancel()
  }

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
      newErrors.pricePerLinearMeter = 'Debe ser > 0'
    }

    if (formData.pricePerSquareMeter <= 0) {
      newErrors.pricePerSquareMeter = 'Debe ser > 0'
    }

    if (formData.minimumRate <= 0) {
      newErrors.minimumRate = 'Debe ser > 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Hay errores en el formulario. Por favor, revisa los campos en rojo.')
      return
    }

    // Check for unsaved special piece
    if (newPiece.name.trim()) {
      alert('Tienes una pieza especial escrita pero no añadida.\n\nPor favor, pulsa "Añadir" para incluirla o borra el texto si no deseas guardarla.')
      return
    }

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

    if (newPiece.price <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }

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
            onClick={handleCancel}
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
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Tarifas Base
                </h4>

                <div className="grid grid-cols-1 gap-5">
                  {[
                    { label: 'Metro Lineal', field: 'pricePerLinearMeter', color: 'blue' },
                    { label: 'Metro Cuadrado', field: 'pricePerSquareMeter', color: 'purple' },
                    { label: 'Tarifa Mínima', field: 'minimumRate', color: 'green' }
                  ].map((item) => (
                    <div key={item.field} className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className={`text-${item.color}-400 font-bold text-lg`}>€</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(formData as any)[item.field] || ''}
                        onChange={(e) => handleChange(item.field, parseFloat(e.target.value) || 0)}
                        className={`block w-full pl-10 pr-4 py-4 bg-gray-900/60 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all font-mono text-lg font-medium
                          ${(errors as any)[item.field]
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                            : `border-gray-700/50 focus:border-${item.color}-500 focus:ring-${item.color}-500/20 group-hover:border-gray-600`
                          }`}
                        placeholder="0.00"
                      />
                      <label className={`absolute -top-2 left-3 bg-gray-800 px-2 text-xs font-medium text-${item.color}-400 rounded-full border border-gray-700`}>
                        {item.label}
                      </label>

                      {(errors as any)[item.field] && (
                        <p className="absolute right-0 -bottom-5 text-red-400 text-xs font-medium">
                          {(errors as any)[item.field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Pieces */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Piezas Especiales</label>

                {/* List as Scrollable Rows */}
                <div className="flex flex-col gap-2 mb-4 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.specialPieces.length === 0 && (
                    <p className="text-gray-500 text-sm italic py-8 w-full text-center border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
                      No hay piezas especiales asignadas
                    </p>
                  )}
                  {formData.specialPieces.map((piece, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-gray-900/40 border border-gray-700/50 rounded-lg hover:bg-gray-800/60 transition-colors">
                      <span className="text-gray-200 font-medium truncate mr-2">{piece.name}</span>

                      <div className="flex items-center gap-3">
                        <span className="text-white font-mono font-bold bg-black/40 px-3 py-1 rounded-md border border-gray-700/50">
                          {piece.price.toFixed(2)} €
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSpecialPiece(i)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          title="Eliminar pieza"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
                onClick={handleCancel}
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
