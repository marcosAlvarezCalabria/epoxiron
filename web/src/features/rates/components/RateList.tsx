/**
 * COMPONENT: RateList
 *
 * Simple list of rates
 * (Styles will be updated with Figma design later)
 */

import { useRates } from '../hooks/useRates'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

export function RateList() {
  const { data: rates, isLoading, error } = useRates()
  const { data: customers } = useCustomers()

  if (isLoading) {
    return <div className="text-center py-4">Loading rates...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">Error loading rates</div>
  }

  if (!rates || rates.length === 0) {
    return <div className="text-gray-500 text-center py-4">No rates found</div>
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 border-b">Rate List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linear Meter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Square Meter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Minimum Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rates.map((rate) => (
              <tr key={rate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getCustomerName(rate.customerId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{rate.ratePerLinearMeter.toFixed(2)}/ml
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{rate.ratePerSquareMeter.toFixed(2)}/m²
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{rate.minimumRate.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
