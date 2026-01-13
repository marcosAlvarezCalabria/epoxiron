/**
 * COMPONENT: DeliveryNoteForm
 *
 * Simple form to create/edit delivery notes
 */

import { useState } from 'react'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useRates } from '@/features/rates/hooks/useRates'
import type { CreateDeliveryNoteData } from '../hooks/useDeliveryNotes'

interface DeliveryNoteFormProps {
  onSubmit: (data: CreateDeliveryNoteData) => void
  onCancel: () => void
  isLoading: boolean
}

interface FormItem {
  rateId: string
  quantity: number
  description: string
}

export function DeliveryNoteForm({ onSubmit, onCancel, isLoading }: DeliveryNoteFormProps) {
  const [customerId, setCustomerId] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<FormItem[]>([{ rateId: '', quantity: 1, description: '' }])

  const { data: customers } = useCustomers()
  const { data: rates } = useRates()

  // Filter rates by selected customer
  const customerRates = rates?.filter(rate => rate.customerId === customerId) || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || !deliveryDate || items.some(item => !item.rateId || item.quantity <= 0)) {
      alert('Please fill all required fields')
      return
    }

    onSubmit({
      customerId,
      deliveryDate,
      items: items.filter(item => item.rateId),
      notes: notes.trim() || undefined
    })
  }

  const addItem = () => {
    setItems([...items, { rateId: '', quantity: 1, description: '' }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof FormItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer and Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
            Customer *
          </label>
          <select
            id="customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a customer</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">
            Delivery Date *
          </label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Items *</label>
          <button
            type="button"
            onClick={addItem}
            disabled={!customerId || isLoading}
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            + Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-3 p-3 bg-gray-50 rounded">
            <div className="col-span-5">
              <select
                value={item.rateId}
                onChange={(e) => updateItem(index, 'rateId', e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">Select service/rate</option>
                {customerRates.map((rate) => (
                  <option key={rate.id} value={rate.id}>
                    Linear: €{rate.ratePerLinearMeter}/ml | Square: €{rate.ratePerSquareMeter}/m²
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', Math.max(1, parseInt(e.target.value)))}
                required
                disabled={isLoading}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                min="1"
              />
            </div>
            <div className="col-span-5">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                placeholder="Description (optional)"
              />
            </div>
            <div className="col-span-12">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 text-sm"
                  disabled={isLoading}
                >
                  Remove item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                className="border p-2 rounded text-sm"
                min="1"
                disabled={isPending}
              />
              <input
                type="number"
                placeholder="Thickness (optional)"
                value={item.measurements.thickness || ''}
                onChange={(e) =>
                  handleItemChange(idx, 'thickness', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="border p-2 rounded text-sm"
                step="1"
                disabled={isPending}
              />
            </div>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="text-red-600 text-sm"
                disabled={isPending}
              >
                Remove item
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="text-blue-600 text-sm mb-4"
          disabled={isPending}
        >
          + Add another item
        </button>
      </div>

      {/* Notes */}
      <div>
        <label>Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Any additional notes..."
          disabled={isPending}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create Delivery Note'}
      </button>
    </form>
  )
}
