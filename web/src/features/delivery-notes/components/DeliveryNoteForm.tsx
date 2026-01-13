/**
 * COMPONENT: DeliveryNoteForm
 *
 * Simple form to create/edit delivery notes
 */

import { useState } from 'react'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useCreateDeliveryNote } from '../hooks/useDeliveryNotes'
import type { DeliveryNoteItem } from '../types/DeliveryNote'

interface DeliveryNoteFormProps {
  onSuccess?: () => void
}

export function DeliveryNoteForm({ onSuccess }: DeliveryNoteFormProps) {
  const { data: customers } = useCustomers()
  const { mutate: createNote, isPending } = useCreateDeliveryNote()

  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState<Omit<DeliveryNoteItem, 'id' | 'unitPrice' | 'totalPrice'>[]>([
    {
      description: '',
      color: 'RAL9016',
      measurements: { linearMeters: undefined },
      quantity: 1
    }
  ])
  const [notes, setNotes] = useState('')

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: '',
        color: 'RAL9016',
        measurements: { linearMeters: undefined },
        quantity: 1
      }
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number | undefined
  ) => {
    const updated = [...items]
    if (field === 'linearMeters' || field === 'squareMeters' || field === 'thickness') {
      updated[index] = {
        ...updated[index],
        measurements: {
          ...updated[index].measurements,
          [field]: value as number
        }
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setItems(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerId || items.length === 0) {
      alert('Please select customer and add at least one item')
      return
    }

    createNote(
      {
        customerId,
        date: new Date().toISOString().split('T')[0],
        items: items.map(item => ({
          ...item,
          measurements: {
            linearMeters: item.measurements.linearMeters,
            squareMeters: item.measurements.squareMeters,
            thickness: item.measurements.thickness
          }
        })),
        notes
      },
      {
        onSuccess: () => {
          setCustomerId('')
          setItems([
            {
              description: '',
              color: 'RAL9016',
              measurements: { linearMeters: undefined },
              quantity: 1
            }
          ])
          setNotes('')
          onSuccess?.()
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-lg">
      <h2>Create Delivery Note</h2>

      {/* Customer Selection */}
      <div>
        <label>Customer *</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full border p-2 rounded"
          disabled={isPending}
        >
          <option value="">Select a customer</option>
          {customers?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items */}
      <div>
        <h3>Items</h3>
        {items.map((item, idx) => (
          <div key={idx} className="space-y-2 border p-3 rounded mb-3">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
              className="w-full border p-2 rounded text-sm"
              disabled={isPending}
            />

            <select
              value={item.color}
              onChange={(e) => handleItemChange(idx, 'color', e.target.value)}
              className="w-full border p-2 rounded text-sm"
              disabled={isPending}
            >
              <option>RAL9016</option>
              <option>RAL7016</option>
              <option>RAL3000</option>
              <option>Special</option>
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Linear meters (ml)"
                value={item.measurements.linearMeters || ''}
                onChange={(e) =>
                  handleItemChange(idx, 'linearMeters', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="border p-2 rounded text-sm"
                step="0.1"
                disabled={isPending}
              />
              <input
                type="number"
                placeholder="Square meters (m²)"
                value={item.measurements.squareMeters || ''}
                onChange={(e) =>
                  handleItemChange(idx, 'squareMeters', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="border p-2 rounded text-sm"
                step="0.1"
                disabled={isPending}
              />
            </div>

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
