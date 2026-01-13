/**
 * PAGE: Rates - CRUD completo
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RateForm, type RateFormData } from '@/features/rates/components/RateForm'
import { RateList } from '@/features/rates/components/RateList'
import { useCreateRate } from '@/features/rates/hooks/useRates'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

export function RatesPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const navigate = useNavigate()

  const { mutate: createRate, isPending } = useCreateRate()
  const { data: customers } = useCustomers()

  const handleSubmit = (data: RateFormData) => {
    createRate(
      {
        customerId: selectedCustomerId,
        ...data
      },
      {
        onSuccess: () => {
          setShowForm(false)
          setSelectedCustomerId('')
        }
      }
    )
  }

  const handleNewRate = () => {
    if (!customers || customers.length === 0) {
      alert('Please create a customer first')
      return
    }
    setShowForm(true)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Rates Management</h1>
        </div>

        <button 
          onClick={handleNewRate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Rate
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create New Rate</h3>

          {!selectedCustomerId ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700">
                  Select Customer:
                </label>
                <select
                  id="customer-select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">-- Select a customer --</option>
                  {customers?.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <RateForm
              customerId={selectedCustomerId}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setSelectedCustomerId('')
              }}
              isLoading={isPending}
            />
          )}
        </div>
      )}

      <RateList />
    </div>
  )
}
