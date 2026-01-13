/**
 * COMPONENT: RateForm
 *
 * Simple form to create/edit rates
 * (Styles will be updated with Figma design later)
 */

import { useState } from 'react'

export interface SpecialPiece {
  name: string
  price: number
}

export interface RateFormData {
  ratePerLinearMeter: number
  ratePerSquareMeter: number
  minimumRate: number
  specialPieces: SpecialPiece[]
}

interface RateFormProps {
  customerId: string
  onSubmit: (data: RateFormData) => void
  onCancel: () => void
  isLoading: boolean
}

export function RateForm({ customerId, onSubmit, onCancel, isLoading }: RateFormProps) {
  const [formData, setFormData] = useState<RateFormData>({
    ratePerLinearMeter: 0,
    ratePerSquareMeter: 0,
    minimumRate: 0,
    specialPieces: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.ratePerLinearMeter <= 0 || formData.ratePerSquareMeter <= 0 || formData.minimumRate <= 0) {
      alert('Please fill all required fields with valid values')
      return
    }
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof RateFormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="ratePerLinearMeter" className="block text-sm font-medium text-gray-700">
            Rate per Linear Meter (€/ml) *
          </label>
          <input
            type="number"
            id="ratePerLinearMeter"
            value={formData.ratePerLinearMeter}
            onChange={(e) => handleInputChange('ratePerLinearMeter', parseFloat(e.target.value) || 0)}
            required
            min="0"
            step="0.01"
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ratePerSquareMeter" className="block text-sm font-medium text-gray-700">
            Rate per Square Meter (€/m²) *
          </label>
          <input
            type="number"
            id="ratePerSquareMeter"
            value={formData.ratePerSquareMeter}
            onChange={(e) => handleInputChange('ratePerSquareMeter', parseFloat(e.target.value) || 0)}
            required
            min="0"
            step="0.01"
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="minimumRate" className="block text-sm font-medium text-gray-700">
            Minimum Rate (€) *
          </label>
          <input
            type="number"
            id="minimumRate"
            value={formData.minimumRate}
            onChange={(e) => handleInputChange('minimumRate', parseFloat(e.target.value) || 0)}
            required
            min="0"
            step="0.01"
            disabled={isLoading}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Special pieces functionality will be added in the next version.
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Rate'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
