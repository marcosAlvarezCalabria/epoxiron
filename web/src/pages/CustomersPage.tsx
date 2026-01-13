/**
 * PAGE: Customers
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomerForm } from '@/features/customers/components/CustomerForm'
import { CustomerList } from '@/features/customers/components/CustomerList'
import { useCreateCustomer } from '@/features/customers/hooks/useCustomers'

export function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const { mutate: createCustomer, isPending } = useCreateCustomer()
  const navigate = useNavigate()

  const handleSubmit = (name: string) => {
    createCustomer(
      { name },
      {
        onSuccess: () => {
          setShowForm(false)
        }
      }
    )
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
          <h1 className="text-3xl font-bold">Customers Management</h1>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Customer
        </button>
      </div>

      {showForm && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Create New Customer</h3>
          <CustomerForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={isPending}
          />
        </div>
      )}

      <CustomerList />
    </div>
  )
}
