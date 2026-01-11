/**
 * PAGE: Customers
 *
 * Simple page to manage customers
 * (Styles will be updated with Figma design later)
 */

import { useState } from 'react'
import { CustomerForm } from '@/features/customers/components/CustomerForm'
import { CustomerList } from '@/features/customers/components/CustomerList'
import { useCreateCustomer } from '@/features/customers/hooks/useCustomers'

export function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const { mutate: createCustomer, isPending } = useCreateCustomer()

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
    <div>
      <h1>Customers Management</h1>

      <button onClick={() => setShowForm(true)}>
        + New Customer
      </button>

      {showForm && (
        <div>
          <h3>Create New Customer</h3>
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
