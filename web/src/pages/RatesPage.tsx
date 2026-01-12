/**
 * PAGE: Rates
 *
 * Simple page to manage pricing rates
 * (Styles will be updated with Figma design later)
 */

import { useState } from 'react'
import { RateForm } from '@/features/rates/components/RateForm'
import { RateList } from '@/features/rates/components/RateList'
import { useCreateRate } from '@/features/rates/hooks/useRates'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import type { RateFormData } from '@/features/rates/components/RateForm'

export function RatesPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')

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
    <div>
      <h1>Rates Management</h1>

      <button onClick={handleNewRate}>
        + New Rate
      </button>

      {showForm && (
        <div>
          <h3>Create New Rate</h3>

          {!selectedCustomerId ? (
            <div>
              <label htmlFor="customer-select">Select Customer:</label>
              <select
                id="customer-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">-- Select a customer --</option>
                {customers?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <button onClick={() => setShowForm(false)}>Cancel</button>
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
