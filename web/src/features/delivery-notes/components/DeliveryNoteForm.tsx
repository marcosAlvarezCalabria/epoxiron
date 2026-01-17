/**
 * COMPONENT: DeliveryNoteForm
 * Integrado con sistema de tarifas para cálculo automático de precios
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomers } from '../../customers/hooks/useCustomers'
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
  hasPrimer?: boolean
}

export function DeliveryNoteForm({ deliveryNote, isEditing = false, onSuccess, onCancel }: DeliveryNoteFormProps) {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState(deliveryNote?.customerId || '')
  const [notes, setNotes] = useState(deliveryNote?.notes || '')

  // FIX: Map nested measurements to flat FormItem structure to prevent data loss on edit
  const [items, setItems] = useState<FormItem[]>(
    deliveryNote?.items.map(item => ({
      name: item.name || item.description,
      quantity: Number(item.quantity) || 0,
      racColor: item.racColor,
      specialColor: item.specialColor,
      linearMeters: item.measurements?.linearMeters ? Number(item.measurements.linearMeters) : undefined,
      squareMeters: item.measurements?.squareMeters ? Number(item.measurements.squareMeters) : undefined,
      thickness: item.measurements?.thickness ? Number(item.measurements.thickness) : undefined,

      notes: item.notes,
      hasPrimer: item.hasPrimer
    })) || [{
      name: '',
      quantity: 0
    }]
  )

  const { data: customers } = useCustomers()

  // Get selected customer with embedded rates
  const selectedCustomer = customers?.find(c => c.id === customerId)

  const createDeliveryNote = useCreateDeliveryNote()
  const updateDeliveryNote = useUpdateDeliveryNote()

  const isLoading = createDeliveryNote.isPending || updateDeliveryNote.isPending

  // Función para calcular precio de un item basado en tarifa
  const calculateItemPrice = (item: FormItem): number => {
    if (!selectedCustomer) return 0

    try {
      // Basic calculation logic
      let price = 0
      const isLinear = item.linearMeters && item.linearMeters > 0
      const isSquare = item.squareMeters && item.squareMeters > 0

      // Check for special pieces first
      const specialPiece = selectedCustomer.specialPieces?.find(p => p.name.trim().toLowerCase() === item.name.trim().toLowerCase())

      if (specialPiece) {
        return item.hasPrimer ? specialPiece.price * 2 : specialPiece.price
      }

      if (isLinear) {
        price = (item.linearMeters || 0) * (selectedCustomer.pricePerLinearMeter || 0)
      } else if (isSquare) {
        price = (item.squareMeters || 0) * (selectedCustomer.pricePerSquareMeter || 0)
      }

      // Apply minimum rate if needed (only if price > 0 to avoid applying min rate to empty items)
      if (price > 0 && price < (selectedCustomer.minimumRate || 0)) {
        price = selectedCustomer.minimumRate
      }

      // Apply Primer Logic
      if (item.hasPrimer) {
        price *= 2
      }

      return price
    } catch (error) {
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
          notes: item.notes,
          hasPrimer: item.hasPrimer
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
    // Validate current top item
    if (items.length > 0 && !items[0].name.trim()) {
      alert('Por favor, completa el nombre del item actual antes de añadir otro.')
      return
    }

    setItems([{
      name: '',
      quantity: 0
    }, ...items])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof FormItem, value: string | number | boolean | undefined) => {
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
        {selectedCustomer && (
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            <div>
              <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                </svg>
                Tarifas Asignadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm border-b border-blue-800/30 pb-3 mb-3">
                <div>
                  <p className="text-gray-400">Metros lineales</p>
                  <p className="text-white font-bold">€{selectedCustomer.pricePerLinearMeter.toFixed(2)}/ml</p>
                </div>
                <div>
                  <p className="text-gray-400">Metros cuadrados</p>
                  <p className="text-white font-bold">€{selectedCustomer.pricePerSquareMeter.toFixed(2)}/m²</p>
                </div>
                <div>
                  <p className="text-gray-400">Tarifa mínima</p>
                  <p className="text-white font-bold">€{selectedCustomer.minimumRate.toFixed(2)}</p>
                </div>
              </div>

              {/* Special Pieces List */}
              {selectedCustomer.specialPieces && selectedCustomer.specialPieces.length > 0 && (
                <div>
                  <p className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">Piezas Especiales Disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.specialPieces.map((piece, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-blue-900/40 border border-blue-700/50 text-xs text-blue-200">
                        <span className="font-medium mr-1.5">{piece.name}</span>
                        <span className="font-mono text-blue-100 bg-blue-800/50 px-1 rounded">€{piece.price}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            const isSpecialPiece = selectedCustomer?.specialPieces?.some(p =>
              p.name.trim().toLowerCase() === item.name.trim().toLowerCase()
            )

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
                      list={`special-pieces-${customerId}`} // Connect to datalist
                    />
                    {/* Autocomplete from Rate Special Pieces */}
                    {selectedCustomer && selectedCustomer.specialPieces && selectedCustomer.specialPieces.length > 0 && (
                      <datalist id={`special-pieces-${customerId}`}>
                        {selectedCustomer.specialPieces.map((piece, i) => (
                          <option key={i} value={piece.name}>
                            {piece.name} - €{piece.price}
                          </option>
                        ))}
                      </datalist>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
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
                {/* Measurements */}
                <div className="mb-4 relative">
                  {isSpecialPiece ? (
                    <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6 flex items-center justify-center">
                      <span className="text-red-200 font-bold bg-gray-900/90 px-4 py-2 rounded-full border border-red-500/50 shadow-lg shadow-red-900/20 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        BLOQUEADO: Medidas no necesarias (Precio por Unidad)
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  )}
                </div>

                {/* Primer Checkbox (Imprimación) */}
                <div className="mb-4 flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <input
                    type="checkbox"
                    id={`primer-${index}`}
                    checked={item.hasPrimer || false}
                    onChange={(e) => updateItem(index, 'hasPrimer', e.target.checked)}
                    disabled={isLoading}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor={`primer-${index}`} className="flex flex-col cursor-pointer select-none">
                    <span className="text-gray-200 font-medium text-sm flex items-center gap-2">
                      Aplicar Imprimación
                      {item.hasPrimer && <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded border border-blue-700/30">x2 Precio</span>}
                    </span>
                    <span className="text-gray-500 text-xs">Aplica una capa base anticorrosiva (Duplica el precio del pintado)</span>
                  </label>
                </div>

                {/* Price Preview */}
                {selectedCustomer && (
                  (() => {
                    const isSpecialPiece = selectedCustomer.specialPieces?.some(p => p.name.toLowerCase() === item.name.trim().toLowerCase())
                    const hasMeasurements = item.linearMeters || item.squareMeters

                    if (!isSpecialPiece && !hasMeasurements) return null

                    return (
                      <div className={`border rounded-lg p-3 ${isSpecialPiece ? 'bg-purple-900/20 border-purple-800/30' : 'bg-green-900/20 border-green-800/30'}`}>
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <p className={`${isSpecialPiece ? 'text-purple-400' : 'text-green-400'} font-medium`}>
                              {isSpecialPiece ? '✨ Pieza Especial Detectada' : '💰 Precio calculado'}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {isSpecialPiece
                                ? `${item.quantity} ud × €${(itemPrice).toFixed(2)}/ud`
                                : item.linearMeters
                                  ? `${item.linearMeters} ml × €${selectedCustomer.pricePerLinearMeter.toFixed(2)}`
                                  : `${item.squareMeters} m² × €${selectedCustomer.pricePerSquareMeter.toFixed(2)}`
                              }
                              {!isSpecialPiece && itemPrice === selectedCustomer.minimumRate && ' (tarifa mínima)'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-lg">€{itemTotal.toFixed(2)}</p>
                            <p className="text-gray-400 text-xs">Total Item</p>
                          </div>
                        </div>
                      </div>
                    )
                  })()
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
        {selectedCustomer && estimatedTotal > 0 && (
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
