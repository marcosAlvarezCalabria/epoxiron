/**
 * COMPONENT: RateForm
 *
 * Simple form to create/edit rates
 * (Styles will be updated with Figma design later)
 */

import { useState } from 'react'
import type { SpecialPiece } from '../types/Rate'

interface RateFormProps {
  customerId: string
  onSubmit: (data: RateFormData) => void
  onCancel: () => void
  isLoading: boolean
}

export interface RateFormData {
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
  specialPieces: SpecialPiece[]
}

export function RateForm({ customerId, onSubmit, onCancel, isLoading }: RateFormProps) {
  const [linearMeter, setLinearMeter] = useState('15.00')
  const [squareMeter, setSquareMeter] = useState('25.00')
  const [minimum, setMinimum] = useState('50.00')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      ratePerLinearMeter: parseFloat(linearMeter),
      ratePerSquareMeter: parseFloat(squareMeter),
      minimumRate: parseFloat(minimum),
      specialPieces: [] // For now, no special pieces in the form
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="customerId">Customer ID:</label>
        <input
          id="customerId"
          type="text"
          value={customerId}
          disabled
        />
      </div>

      <div>
        <label htmlFor="linearMeter">Rate per Linear Meter (€):</label>
        <input
          id="linearMeter"
          type="number"
          step="0.01"
          min="0"
          value={linearMeter}
          onChange={(e) => setLinearMeter(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="squareMeter">Rate per Square Meter (€):</label>
        <input
          id="squareMeter"
          type="number"
          step="0.01"
          min="0"
          value={squareMeter}
          onChange={(e) => setSquareMeter(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="minimum">Minimum Rate (€):</label>
        <input
          id="minimum"
          type="number"
          step="0.01"
          min="0"
          value={minimum}
          onChange={(e) => setMinimum(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Rate'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  )
}
