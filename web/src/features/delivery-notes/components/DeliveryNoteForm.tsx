/**
 * COMPONENT: DeliveryNoteForm
 * Usando tipos existentes - sin duplicación
 */

import { useState } from 'react'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useCreateDeliveryNote, useUpdateDeliveryNote } from '../hooks/useDeliveryNotes'
import type { DeliveryNote, CreateDeliveryNoteRequest, DeliveryNoteItem } from '../types/DeliveryNote'

interface DeliveryNoteFormProps {
  deliveryNote?: DeliveryNote  // Para modo edición
  isEditing?: boolean
  onSuccess: (noteId: string) => void
  onCancel: () => void
}

interface FormItem {
  id?: string
  name: string
  racColor?: string
  specialColor?: string
  quantity: number
  linearMeters?: number
  squareMeters?: number
  thickness?: number
  unitPrice?: number
  totalPrice: number
  notes?: string
}

export function DeliveryNoteForm({ deliveryNote, isEditing = false, onSuccess, onCancel }: DeliveryNoteFormProps) {
  const [customerId, setCustomerId] = useState(deliveryNote?.customerId || '')
  const [notes, setNotes] = useState(deliveryNote?.notes || '')
  const [items, setItems] = useState<FormItem[]>(
    deliveryNote?.items || [{
      name: '',
      quantity: 1,
      totalPrice: 0
    }]
  )

  const { data: customers } = useCustomers()
  const createDeliveryNote = useCreateDeliveryNote()
  const updateDeliveryNote = useUpdateDeliveryNote()

  const isLoading = createDeliveryNote.isPending || updateDeliveryNote.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerId || items.some(item => !item.name || item.quantity <= 0)) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      // Convertir FormItem a DeliveryNoteItem
      const processedItems: Omit<DeliveryNoteItem, 'id'>[] = items
        .filter(item => item.name.trim())
        .map(item => ({
          name: item.name,
          description: item.name, // Usamos nombre como descripción por ahora
          quantity: item.quantity,
          color: item.racColor || item.specialColor || 'Sin color',
          measurements: {
            linearMeters: item.linearMeters,
            squareMeters: item.squareMeters,
            thickness: item.thickness
          },
          racColor: item.racColor,
          specialColor: item.specialColor,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          notes: item.notes
        }))

      if (isEditing && deliveryNote) {
        // Modo edición
        const result = await updateDeliveryNote.mutateAsync({
          id: deliveryNote.id,
          data: {
            customerId,
            date: new Date().toISOString(),
            items: processedItems.map((item, index) => ({
              ...item,
              id: deliveryNote.items[index]?.id || `new-${index}`,
            })),
            notes: notes.trim() || undefined
          }
        })
        onSuccess(result.id)
      } else {
        // Modo creación
        const createData: CreateDeliveryNoteRequest = {
          customerId,
          date: new Date().toISOString(),
          items: processedItems,
          notes: notes.trim() || undefined
        }

        const result = await createDeliveryNote.mutateAsync(createData)
        onSuccess(result.id)
      }
    } catch (error) {
      console.error('Error saving delivery note:', error)
      alert('Error guardando el albarán. Por favor inténtalo de nuevo.')
    }
  }

  const addItem = () => {
    setItems([...items, {
      name: '',
      quantity: 1,
      totalPrice: 0
    }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof FormItem, value: string | number | undefined) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Calcular totalPrice automáticamente
    if (field === 'unitPrice' || field === 'quantity') {
      const item = updatedItems[index]
      updatedItems[index].totalPrice = (item.unitPrice || 0) * item.quantity
    }

    setItems(updatedItems)
  }

  // Helper para parseFloat seguro
  const safeParseFloat = (value: string): number | undefined => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  // Calcular total del albarán
  const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer */}
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-300 mb-2">
            Cliente *
          </label>
          <select
            id="customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            disabled={isLoading || (isEditing && deliveryNote?.status !== 'draft')}
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

        {/* Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Items del Albarán *
            </label>
            <button
              type="button"
              onClick={addItem}
              disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              + Añadir Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Item *
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    required
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="Ej: Puerta principal, Ventana lateral"
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
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Unit Price & Total */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio Unitario
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateItem(index, 'unitPrice', safeParseFloat(e.target.value))}
                      disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
                      className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 pl-8 pr-3 transition-all disabled:opacity-50"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                    <input
                      type="number"
                      value={item.totalPrice?.toFixed(2) || '0.00'}
                      readOnly
                      className="w-full rounded-lg text-gray-400 bg-gray-900 border border-gray-700 h-10 pl-8 pr-3"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color RAL
                  </label>
                  <input
                    type="text"
                    value={item.racColor || ''}
                    onChange={(e) => updateItem(index, 'racColor', e.target.value)}
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="Ej: RAL 7016, RAL 9010"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color Especial
                  </label>
                  <input
                    type="text"
                    value={item.specialColor || ''}
                    onChange={(e) => updateItem(index, 'specialColor', e.target.value)}
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
                    className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                    placeholder="Ej: Azul metalizado, Verde marino"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
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
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
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
                    disabled={isLoading || (isEditing && deliveryNote?.status === 'reviewed')}
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

        {/* Total Amount - Solo en modo edición */}
        {isEditing && (
          <div className="text-right">
            <span className="text-sm font-medium text-gray-300 mr-2">
              Total:
            </span>
            <span className="text-xl font-bold text-white">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        )}

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
