/**
 * COMPONENT: CustomerList
 *
 * Simple list of customers
 * (Styles will be updated with Figma design later)
 */

import { useCustomers, useDeleteCustomer } from '../hooks/useCustomers'

export function CustomerList() {
  const { data: customers, isLoading, error } = useCustomers()
  const { mutate: deleteCustomer } = useDeleteCustomer()

  if (isLoading) return <div>Loading customers...</div>
  if (error) return <div>Error loading customers</div>
  if (!customers || customers.length === 0) return <div>No customers yet</div>

  return (
    <div>
      <h2>Customers List</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <span>{customer.name}</span>
            <button onClick={() => deleteCustomer(customer.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
