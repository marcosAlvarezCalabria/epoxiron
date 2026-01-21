/**
 * COMPONENT: DeliveryNoteForm
 * Integrado con sistema de tarifas para cálculo automático de precios
 * Refactorizado: Patrón Lista + Formulario de Añadir
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
  isHighThickness?: boolean
}

const EMPTY_ITEM: FormItem = {
  name: '',
  quantity: 0,
  racColor: '',
  specialColor: '',
  linearMeters: undefined,
  squareMeters: undefined,
  thickness: undefined,
  notes: '',
  hasPrimer: false,
  isHighThickness: false
}

export function DeliveryNoteForm({ deliveryNote, isEditing = false, onSuccess, onCancel }: DeliveryNoteFormProps) {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState(deliveryNote?.customerId || '')
  const [notes, setNotes] = useState(deliveryNote?.notes || '')

  // Date State
  const [date, setDate] = useState(
    deliveryNote?.date
      ? new Date(deliveryNote.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )

  // Lista de items YA añadidos al albarán
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
      hasPrimer: item.hasPrimer,
      isHighThickness: item.isHighThickness
    })) || []
  )

  // Sync state with prop when it changes (e.g. data loaded)
  useEffect(() => {
    if (deliveryNote) {
      setCustomerId(deliveryNote.customerId)
      setNotes(deliveryNote.notes || '')
      if (deliveryNote.date) {
        setDate(new Date(deliveryNote.date).toISOString().split('T')[0])
      }
      setItems(deliveryNote.items.map(item => ({
        name: item.name || item.description,
        quantity: Number(item.quantity) || 0,
        racColor: item.racColor,
        specialColor: item.specialColor,
        linearMeters: item.measurements?.linearMeters ? Number(item.measurements.linearMeters) : undefined,
        squareMeters: item.measurements?.squareMeters ? Number(item.measurements.squareMeters) : undefined,
        thickness: item.measurements?.thickness ? Number(item.measurements.thickness) : undefined,
        notes: item.notes,
        hasPrimer: item.hasPrimer,
        isHighThickness: item.isHighThickness
      })))
    }
  }, [deliveryNote])

  // Estado del NUEVO item que se está creando (Formulario único)
  // Estado del NUEVO item que se está creando (Formulario único)
  const [newItem, setNewItem] = useState<FormItem>(EMPTY_ITEM)
  // Estado para controlar si estamos editando un item existente de la lista
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const { data: customers } = useCustomers()
  const selectedCustomer = customers?.find(c => c.id === customerId)

  const createDeliveryNote = useCreateDeliveryNote()
  const updateDeliveryNote = useUpdateDeliveryNote()

  const isLoading = createDeliveryNote.isPending || updateDeliveryNote.isPending

  // Función para calcular precio de un item basado en tarifa
  const calculateItemPrice = (item: FormItem): number => {
    if (!selectedCustomer) return 0

    try {
      let price = 0
      const isLinear = item.linearMeters && item.linearMeters > 0
      const isSquare = item.squareMeters && item.squareMeters > 0

      // Check for special pieces first
      const specialPiece = selectedCustomer.specialPieces?.find(p => p.name.trim().toLowerCase() === item.name.trim().toLowerCase())

      if (specialPiece) {
        let basePrice = specialPiece.price
        if (item.hasPrimer) basePrice *= 2
        if (item.isHighThickness) basePrice *= 1.7
        return basePrice
      }

      if (isLinear) {
        price += (item.linearMeters || 0) * (selectedCustomer.pricePerLinearMeter || 0)
      }

      if (isSquare) {
        price += (item.squareMeters || 0) * (selectedCustomer.pricePerSquareMeter || 0)
      }

      // Apply minimum rate
      if (price > 0 && price < (selectedCustomer.minimumRate || 0)) {
        price = selectedCustomer.minimumRate
      }

      // Apply High Thickness Surcharge (+70%)
      if (item.isHighThickness) {
        price *= 1.7
      }

      // Apply Primer Logic (x2)
      if (item.hasPrimer) {
        price *= 2
      }

      return price
    } catch (error) {
      return 0
    }
  }

  // --- Helpers for New Item Form ---

  const safeParseFloat = (value: string) => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  const updateNewItem = (field: keyof FormItem, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }))
  }

  const newItemTotal = calculateItemPrice(newItem) * (newItem.quantity || 0)

  const handleAddItem = () => {
    if (!newItem.name) {
      alert('Por favor, introduce un nombre para el item.')
      return
    }
    if (!newItem.quantity || newItem.quantity <= 0) {
      alert('Por favor, introduce una cantidad válida.')
      return
    }

    const calculatedPrice = calculateItemPrice(newItem)
    if (calculatedPrice === 0) {
      alert('El precio calculada es 0. Por favor revisa las tarifas o medidas.')
      return
    }

    if (editingIndex !== null) {
      // Update existing item
      setItems(prev => {
        const updated = [...prev]
        updated[editingIndex] = newItem
        return updated
      })
      setEditingIndex(null)
    } else {
      // Add new item
      setItems(prev => [...prev, newItem])
    }

    setNewItem(EMPTY_ITEM)
  }

  const handleEditItem = (index: number) => {
    setNewItem(items[index])
    setEditingIndex(index)
    // Optional: Scroll to form if needed
  }

  const handleRemoveItem = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null)
      setNewItem(EMPTY_ITEM)
    }
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const estimatedTotal = items.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: Customer & Date
    if (!customerId) {
      alert('Por favor, selecciona un Cliente.')
      return
    }
    if (!date) {
      alert('Por favor, selecciona una Fecha.')
      return
    }

    // Validation: Items
    if (items.length === 0) {
      alert('El albarán debe tener al menos un item.')
      return
    }

    // UX: Check if there is data in the "New Item" form that hasn't been added
    if (newItem.name.trim() !== '' || (newItem.quantity && newItem.quantity > 0)) {
      const confirmDiscard = window.confirm(
        'Tienes datos en el formulario de "Nuevo Item" sin añadir a la lista.\n\n' +
        'Si continúas, estos datos se perderán.\n' +
        '¿Quieres continuar sin añadir este item?'
      )
      if (!confirmDiscard) {
        return
      }
    }

    // Validation: Zero Prices
    const zeroPriceItems = items.filter(i => calculateItemPrice(i) === 0)
    if (zeroPriceItems.length > 0) {
      const confirmZero = window.confirm(
        `Hay ${zeroPriceItems.length} items con precio 0.\n¿Estás seguro de que quieres continuar?`
      )
      if (!confirmZero) return
    }

    if (isLoading) return

    try {
      // ... (item mapping)
      const processedItems: Omit<DeliveryNoteItem, 'id'>[] = items.map(item => {
        const calculatedPrice = calculateItemPrice(item)
        return {
          // ... (existing item map)
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
          unitPrice: calculatedPrice, // Ensure price is sent
          totalPrice: calculatedPrice * item.quantity, // Ensure total is sent
          notes: item.notes,
          hasPrimer: item.hasPrimer,
          isHighThickness: item.isHighThickness
        }
      })

      if (isEditing && deliveryNote) {
        const result = await updateDeliveryNote.mutateAsync({
          id: deliveryNote.id,
          data: {
            customerId,
            date: new Date(date).toISOString(), // Use selected date
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
          date: new Date(date).toISOString(), // Use selected date
          items: processedItems,
          notes: notes.trim() || undefined
        }

        const result = await createDeliveryNote.mutateAsync(createData)
        onSuccess(result.id)
      }
    } catch (error) {
      console.error('Error creating/updating delivery note:', error)
      alert('Ocurrió un error al guardar el albarán.')
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative">
      {/* ... (Sticky Header) ... */}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 2. Customer & Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 h-10 px-3"
            >
              <option value="">Selecciona un cliente</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 focus:ring-2 h-10 px-3"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notas Globales</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 p-3"
            placeholder="Notas generales..."
          />
        </div>

        {/* 3. List of Added Items (Read Only with Delete) */}
        {items.length > 0 && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-medium">Items Añadidos ({items.length})</h3>
              <span className="text-green-400 font-bold">Total Est: €{estimatedTotal.toFixed(2)}</span>
            </div>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-800/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-1 text-center">Cant.</div>
              <div className="col-span-4">Descripción</div>
              <div className="col-span-2">Color</div>
              <div className="col-span-3">Medidas / Extras</div>
              <div className="col-span-2 text-right">Precio</div>
            </div>

            <div className="divide-y divide-gray-800">
              {items.map((item, index) => {
                const p = calculateItemPrice(item)
                return (
                  <div key={index} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-800/30 transition-colors text-sm">
                    {/* Quantity */}
                    <div className="col-span-1 text-center font-bold text-white bg-gray-800 rounded py-1">
                      {item.quantity}
                    </div>

                    {/* Name */}
                    <div className="col-span-4 text-white font-medium truncate">
                      {item.name}
                      {item.notes && <span className="block text-xs text-gray-500 italic truncate">{item.notes}</span>}
                    </div>

                    {/* Color */}
                    <div className="col-span-2 text-gray-300 truncate text-xs">
                      {item.racColor && <span className="block">RAL {item.racColor}</span>}
                      {item.specialColor && <span className="block">{item.specialColor}</span>}
                      {!item.racColor && !item.specialColor && <span className="text-gray-600">-</span>}
                    </div>

                    {/* Measurements & Extras */}
                    <div className="col-span-3 text-xs text-gray-400 flex flex-wrap gap-1">
                      {item.linearMeters && <span className="bg-blue-900/20 text-blue-300 px-1.5 rounded">{item.linearMeters}ml</span>}
                      {item.squareMeters && <span className="bg-green-900/20 text-green-300 px-1.5 rounded">{item.squareMeters}m²</span>}
                      {item.hasPrimer && <span className="bg-purple-900/20 text-purple-300 px-1.5 rounded" title="Imprimación">IMP</span>}
                      {item.isHighThickness && <span className="bg-orange-900/20 text-orange-300 px-1.5 rounded" title="Grosor Especial">GR+</span>}
                    </div>

                    {/* Price & Action */}
                    <div className="col-span-2 flex items-center justify-end gap-3 z-50">
                      <div className="text-right">
                        <div className="text-white font-bold">€{(p * item.quantity).toFixed(2)}</div>
                        <div className="text-[10px] text-gray-500">€{p.toFixed(2)}/ud</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Eliminar item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. Add New Item Form Section */}
        {selectedCustomer && (
          <div className={`bg-gray-900 rounded-lg border p-5 shadow-lg ${editingIndex !== null ? 'border-amber-600/50 ring-1 ring-amber-600/30' : 'border-blue-900/30'}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${editingIndex !== null ? 'text-amber-500' : 'text-blue-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${editingIndex !== null ? 'bg-amber-900/50' : 'bg-blue-900/50'}`}>
                {editingIndex !== null ? '✎' : '+'}
              </span>
              {editingIndex !== null ? 'Editar Item' : 'Añadir Nuevo Item'}
            </h3>

            <div className="space-y-4">
              {/* Name & Qty */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre Item *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => updateNewItem('name', e.target.value)}
                    className="w-full rounded-lg bg-gray-800 border-gray-600 text-white h-10 px-3 focus:ring-2 focus:ring-blue-600"
                    placeholder="Ej: Valla jardín"
                    list={`special-pieces-${customerId}`}
                  />
                  <datalist id={`special-pieces-${customerId}`}>
                    {selectedCustomer.specialPieces?.map((p, i) => (
                      <option key={i} value={p.name}>{p.name} - €{p.price}</option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity || ''}
                    onChange={(e) => updateNewItem('quantity', parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg bg-gray-800 border-gray-600 text-white h-10 px-3 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Color RAL</label>
                  <select
                    value={newItem.racColor || ''}
                    onChange={(e) => updateNewItem('racColor', e.target.value)}
                    className="w-full rounded-lg bg-gray-800 border-gray-600 text-white h-10 px-3"
                  >
                    <option value="">Seleccionar...</option>
                    {RAL_COLORS.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">O Color Especial</label>
                  <input
                    type="text"
                    value={newItem.specialColor || ''}
                    onChange={(e) => updateNewItem('specialColor', e.target.value)}
                    className="w-full rounded-lg bg-gray-800 border-gray-600 text-white h-10 px-3"
                    placeholder="Ej: Verde forja"
                  />
                </div>
              </div>

              {/* Measurements & Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/50 p-3 rounded border border-gray-700">
                {(() => {
                  // Determine if current item name matches a special piece
                  const isSpecialPiece = selectedCustomer.specialPieces?.some(p => p.name.trim().toLowerCase() === newItem.name.trim().toLowerCase())

                  return (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Metros Lineales {isSpecialPiece && <span className="text-yellow-500 text-[10px]">(Bloqueado: Pieza Especial)</span>}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newItem.linearMeters || ''}
                          onChange={(e) => updateNewItem('linearMeters', safeParseFloat(e.target.value))}
                          className={`w-full rounded bg-gray-800 border-gray-600 text-white h-9 px-2 text-sm ${isSpecialPiece ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="0.0"
                          disabled={isSpecialPiece}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Metros Cuadrados {isSpecialPiece && <span className="text-yellow-500 text-[10px]">(Bloqueado: Pieza Especial)</span>}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newItem.squareMeters || ''}
                          onChange={(e) => updateNewItem('squareMeters', safeParseFloat(e.target.value))}
                          className={`w-full rounded bg-gray-800 border-gray-600 text-white h-9 px-2 text-sm ${isSpecialPiece ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="0.0"
                          disabled={isSpecialPiece}
                        />
                      </div>
                    </>
                  )
                })()}

                <div className="flex flex-col justify-center gap-2">
                  {/* Toggles - Always Enabled */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newItem.hasPrimer || false} onChange={(e) => updateNewItem('hasPrimer', e.target.checked)} className="rounded bg-gray-700 border-gray-600 text-blue-600" />
                    <span className="text-sm text-gray-300">Imprimación (x2)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newItem.isHighThickness || false} onChange={(e) => updateNewItem('isHighThickness', e.target.checked)} className="rounded bg-gray-700 border-gray-600 text-orange-600" />
                    <span className="text-sm text-gray-300">Grosor Esp. (+70%)</span>
                  </label>
                </div>
              </div>

              {/* Add Button & Preview */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm">
                  <span className="text-gray-400">Total Item:</span>
                  <span className="ml-2 text-xl font-bold text-white">€{newItemTotal.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null)
                        setNewItem(EMPTY_ITEM)
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancelar Edición
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className={`${editingIndex !== null ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg font-medium transition-colors`}
                  >
                    {editingIndex !== null ? 'Actualizar Item' : 'Añadir a la lista'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Actions */}
        <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-700">
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white px-4 py-2">Cancelar</button>
          <button
            type="submit"
            disabled={isLoading || items.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Albarán'}
          </button>
        </div>
      </form>
    </div>
  )
}
