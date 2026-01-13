/**
 * COMPONENT: DeliveryNoteForm
 * Actualizado para usar la nueva estructura DeliveryNote
 */

import { useState } from 'react'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import type { CreateDeliveryNoteData } from '../hooks/useDeliveryNotes'

interface DeliveryNoteFormProps {
  onSubmit: (data: CreateDeliveryNoteData) => void
  onCancel: () => void
  isLoading: boolean
}

interface FormItem {
  description: string
  color: string
  quantity: number
  linearMeters?: number
  squareMeters?: number
  thickness?: number
}

export function DeliveryNoteForm({ onSubmit, onCancel, isLoading }: DeliveryNoteFormProps) {
  const [customerId, setCustomerId] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<FormItem[]>([{ 
    description: '', 
    color: '', 
    quantity: 1 
  }])

  const { data: customers } = useCustomers()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || !date || items.some(item => !item.description || item.quantity <= 0)) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    // Convertir FormItem a estructura esperada por CreateDeliveryNoteData
    const processedItems = items
      .filter(item => item.description)
      .map(item => ({
        description: item.description,
        color: item.color,
        quantity: item.quantity,
        measurements: {
          linearMeters: item.linearMeters,
          squareMeters: item.squareMeters,
          thickness: item.thickness
        }
      }))

    onSubmit({
      customerId,
      date,
      items: processedItems,
      notes: notes.trim() || undefined
    })
  }

  const addItem = () => {
    setItems([...items, { description: '', color: '', quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof FormItem, value: string | number | undefined) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  // Helper para parseFloat seguro
  const safeParseFloat = (value: string): number | undefined => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-300 mb-2">
              Cliente *
            </label>
            <select
              id="customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-12 px-4 transition-all disabled:opacity-50"
            >
              <option value="">Seleccionar cliente</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
              Fecha de Entrega *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-12 px-4 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-300">Productos/Servicios *</label>
            <button
              type="button"
              onClick={addItem}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              + Añadir Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="Ej: Recubrimiento epoxi"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={item.color}
                    onChange={(e) => updateItem(index, 'color', e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="Ej: Azul, Verde"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Metros Lineales
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.linearMeters || ''}
                    onChange={(e) => updateItem(index, 'linearMeters', safeParseFloat(e.target.value))}
                    disabled={isLoading}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Metros Cuadrados
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.squareMeters || ''}
                    onChange={(e) => updateItem(index, 'squareMeters', safeParseFloat(e.target.value))}
                    disabled={isLoading}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Grosor (mm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.thickness || ''}
                    onChange={(e) => updateItem(index, 'thickness', safeParseFloat(e.target.value))}
                    disabled={isLoading}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Remove Item */}
              {items.length > 1 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    ✕ Eliminar Item
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="w-full rounded-xl text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 p-4 transition-all disabled:opacity-50 resize-none"
            placeholder="Información adicional sobre el albarán..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-700 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creando...' : 'Crear Albarán'}
          </button>
        </div>
      </form>
    </div>
  )
}
