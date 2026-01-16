/**
 * COMPONENT: DeliveryNoteForm
 * Integrado con sistema de tarifas para cálculo automático de precios
 */

import { useState, useEffect } from 'react'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useRateByCustomer } from '../../rates/hooks/useRates'
import { useCreateDeliveryNote, useUpdateDeliveryNote } from '../hooks/useDeliveryNotes'
import type { DeliveryNote, CreateDeliveryNoteRequest, DeliveryNoteItem } from '../types/DeliveryNote'
import { Measurements } from '../../../domain/value-objects/Measurements'
import { RAL_COLORS } from '@/constants/ralColors'

interface DeliveryNoteFormProps {
  deliveryNote?: DeliveryNote
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
  notes?: string
}

export function DeliveryNoteForm({ deliveryNote, isEditing = false, onSuccess, onCancel }: DeliveryNoteFormProps) {
  const [customerId, setCustomerId] = useState(deliveryNote?.customerId || '')
  const [notes, setNotes] = useState(deliveryNote?.notes || '')
  const [items, setItems] = useState<FormItem[]>(
    deliveryNote?.items || [{
      name: '',
      quantity: 1
    }]
  )

  const { data: customers } = useCustomers()
  const { data: customerRate, isLoading: isLoadingRate } = useRateByCustomer(customerId)
  const createDeliveryNote = useCreateDeliveryNote()
  const updateDeliveryNote = useUpdateDeliveryNote()

  const isLoading = createDeliveryNote.isPending || updateDeliveryNote.isPending

  // ...

  // Función para calcular precio de un item basado en tarifa
  const calculateItemPrice = (item: FormItem): number => {
    if (!customerRate) return 0

    try {
      // Construct Domain Value Object
      // Treat <= 0 as undefined to avoid Domain Validation errors while typing (e.g. "0.5")
      const linearMeters = item.linearMeters && item.linearMeters > 0 ? item.linearMeters : undefined
      const squareMeters = item.squareMeters && item.squareMeters > 0 ? item.squareMeters : undefined
      const thickness = item.thickness && item.thickness > 0 ? item.thickness : undefined

      const measurements = new Measurements({
        linearMeters,
        squareMeters,
        thickness
      })

      // Delegate calculation to Domain Entity
      return customerRate.calculatePrice(measurements, item.name)
    } catch (error) {
      // Silently fail for invalid inputs during typing
      return 0
    }
  }

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
          description: item.name,
          quantity: item.quantity,
          color: item.racColor || item.specialColor || 'Sin color',
          measurements: {
            linearMeters: item.linearMeters,
            squareMeters: item.squareMeters,
            thickness: item.thickness
          },
          racColor: item.racColor,
          specialColor: item.specialColor,
          // NO enviamos unitPrice ni totalPrice - el backend los calcula
          unitPrice: undefined,
          totalPrice: 0,
          notes: item.notes
        }))

      if (isEditing && deliveryNote) {
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
      quantity: 1
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
    setItems(updatedItems)
  }

  const safeParseFloat = (value: string): number | undefined => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  // Calcular total estimado (preview)
  const estimatedTotal = items.reduce((sum, item) => {
    const itemPrice = calculateItemPrice(item)
    return sum + (itemPrice * item.quantity)
  }, 0)

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
            disabled={isLoading || isEditing}
            className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
          >
            <option value="">Selecciona un cliente</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rate Info Card */}
        {customerId && (
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            {isLoadingRate ? (
              <p className="text-blue-400 text-sm">Cargando tarifa...</p>
            ) : customerRate ? (
              <div>
                <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                  </svg>
                  Tarifa del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Metros lineales</p>
                    <p className="text-white font-bold">€{customerRate.pricePerLinearMeter.toFixed(2)}/ml</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Metros cuadrados</p>
                    <p className="text-white font-bold">€{customerRate.pricePerSquareMeter.toFixed(2)}/m²</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Tarifa mínima</p>
                    <p className="text-white font-bold">€{customerRate.minimumPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-yellow-400 text-sm">
                <p className="font-bold mb-1">⚠️ Cliente sin tarifa asignada</p>
                <p className="text-yellow-300/80">Los precios se calcularán con la tarifa mínima por defecto.</p>
              </div>
            )}
          </div>
        )}

        {/* Add Item Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Items</h3>
          <button
            type="button"
            onClick={addItem}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            + Añadir Item
          </button>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const itemPrice = calculateItemPrice(item)
            const itemTotal = itemPrice * item.quantity

            return (
              <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium">Item {index + 1}</h4>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      ✕ Eliminar
                    </button>
                  )}
                </div>

                {/* Name & Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Item *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 transition-all disabled:opacity-50"
                      placeholder="Ej: Puerta principal, Ventana lateral"
                    />
                  </div>

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

                {/* Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>


                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Color RAL
                      </label>
                      <div className="relative">
                        <select
                          value={item.racColor || ''}
                          onChange={(e) => updateItem(index, 'racColor', e.target.value)}
                          disabled={isLoading}
                          className="w-full rounded-lg text-white bg-gray-800 border border-gray-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/40 h-10 px-3 appearance-none transition-all disabled:opacity-50"
                        >
                          <option value="">Seleccionar Color...</option>
                          {RAL_COLORS.map((color) => (
                            <option key={color.code} value={color.code}>
                              {color.code} - {color.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color Especial
                    </label>
                    <input
                      type="text"
                      value={item.specialColor || ''}
                      onChange={(e) => updateItem(index, 'specialColor', e.target.value)}
                      disabled={isLoading}
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

                {/* Price Preview */}
                {customerRate && (item.linearMeters || item.squareMeters) && (
                  <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-green-400 font-medium">💰 Precio calculado</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {item.linearMeters ? `${item.linearMeters} ml × €${customerRate.pricePerLinearMeter.toFixed(2)}` :
                            item.squareMeters ? `${item.squareMeters} m² × €${customerRate.pricePerSquareMeter.toFixed(2)}` : ''}
                          {itemPrice === customerRate.minimumPrice && ' (tarifa mínima)'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">€{itemPrice.toFixed(2)}</p>
                        <p className="text-gray-400 text-xs">Total: €{itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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

        {/* Estimated Total */}
        {customerRate && estimatedTotal > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">Total Estimado:</span>
              <span className="text-2xl font-bold text-white">€{estimatedTotal.toFixed(2)}</span>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              * El precio final será calculado por el servidor y puede variar ligeramente
            </p>
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
            {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Albarán' : 'Crear Albarán'}
          </button>
        </div>
      </form>
    </div>
  )
}
