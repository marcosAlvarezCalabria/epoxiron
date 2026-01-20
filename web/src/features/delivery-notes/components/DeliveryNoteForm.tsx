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
  const [newItem, setNewItem] = useState<FormItem>(EMPTY_ITEM)

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

  const handleAddItem = () => {
    // Validaciones
    if (!newItem.name.trim()) {
      alert('Por favor, indica el nombre del item.')
      return
    }

    if (!newItem.quantity || newItem.quantity <= 0) {
      alert('Por favor, indica una cantidad válida.')
      return
    }

    const isSpecialPiece = selectedCustomer?.specialPieces?.some(p => p.name.trim().toLowerCase() === newItem.name.trim().toLowerCase())
    const hasMeasurements = (newItem.linearMeters && newItem.linearMeters > 0) || (newItem.squareMeters && newItem.squareMeters > 0)

    if (!isSpecialPiece && !hasMeasurements) {
      alert('Por favor, indica las medidas (lineales o cuadradas) o selecciona una pieza especial.')
      return
    }

    // Añadir a la lista y resetear formulario
    setItems([...items, newItem])
    setNewItem(EMPTY_ITEM)
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateNewItem = (field: keyof FormItem, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerId) {
      alert('Por favor selecciona un cliente')
      return
    }

    if (items.length === 0) {
      alert('Por favor añade al menos un item al albarán')
      return
    }

    try {
      // Map Items
      const processedItems: Omit<DeliveryNoteItem, 'id'>[] = items.map(item => ({
        name: item.name,
        description: item.name,
        quantity: item.quantity,
        color: item.racColor || item.specialColor || 'Sin color',
        measurements: {
          linearMeters: item.linearMeters,
          squareMeters: item.squareMeters,
          thickness: undefined
        },
        racColor: item.racColor,
        specialColor: item.specialColor,
        unitPrice: undefined,
        totalPrice: 0,
        notes: item.notes,
        hasPrimer: item.hasPrimer,
        isHighThickness: item.isHighThickness
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
      console.error('Error:', error)
      alert('Error guardando el albarán.')
    }
  }

  const safeParseFloat = (value: string): number | undefined => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? undefined : parsed
  }

  // Calcular total estimado global
  const estimatedTotal = items.reduce((sum, item) => {
    return sum + (calculateItemPrice(item) * item.quantity)
  }, 0)

  // Preview del precio del NUEVO item
  const newItemPrice = calculateItemPrice(newItem)
  const newItemTotal = newItemPrice * newItem.quantity

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative">

      {/* 1. Header Sticky (Resumen Global) */}
      {selectedCustomer && (
        <div className="md:hidden sticky -top-6 -mx-6 px-6 py-3 bg-gray-900/95 backdrop-blur shadow-lg border-b border-blue-900/30 mb-6 z-30 flex justify-between items-center transition-all">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Items: {items.length}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Total Est.</span>
            <span className="text-blue-400 font-bold font-mono">€{estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 2. Customer Selection */}
        <div className="grid grid-cols-1 gap-6">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Notas Globales</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg text-white bg-gray-900 border border-gray-700 focus:border-blue-600 p-3"
              placeholder="Notas generales..."
            />
          </div>
        </div>

        {/* 3. List of Added Items (Read Only with Delete) */}
        {items.length > 0 && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-medium">Items Añadidos ({items.length})</h3>
              <span className="text-green-400 font-bold">Total Est: €{estimatedTotal.toFixed(2)}</span>
            </div>
            <div className="divide-y divide-gray-800">
              {items.map((item, index) => {
                const p = calculateItemPrice(item)
                return (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.quantity}x</span>
                        <span className="text-gray-200">{item.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.racColor && `RAL ${item.racColor}`}
                        {item.specialColor && item.specialColor}
                        {item.hasPrimer && ' + Imprimación'}
                        {item.isHighThickness && ' + Grosor Esp.'}
                      </div>
                      <div className="text-xs text-gray-600 font-mono mt-0.5">
                        {item.linearMeters && `${item.linearMeters}ml `}
                        {item.squareMeters && `${item.squareMeters}m²`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-medium">€{(p * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">€{p.toFixed(2)}/ud</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded"
                      >
                        ✕
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
          <div className="bg-gray-900 rounded-lg border border-blue-900/30 p-5 shadow-lg">
            <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center text-xs">+</span>
              Añadir Nuevo Item
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
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Añadir a la lista
                </button>
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
