/**
 * COMPONENT: RateList
 *
 * Simple list of rates
 * (Styles will be updated with Figma design later)
 */

import { useRates, useDeleteRate } from '../hooks/useRates'

export function RateList() {
  const { data: rates, isLoading, error } = useRates()
  const { mutate: deleteRate } = useDeleteRate()

  if (isLoading) return <div>Loading rates...</div>
  if (error) return <div>Error loading rates</div>
  if (!rates || rates.length === 0) return <div>No rates yet</div>

  return (
    <div>
      <h2>Rates List</h2>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Linear Meter (€)</th>
            <th>Square Meter (€)</th>
            <th>Minimum (€)</th>
            <th>Special Pieces</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.id}>
              <td>{rate.customerId}</td>
              <td>{rate.ratePerLinearMeter.toFixed(2)}</td>
              <td>{rate.ratePerSquareMeter.toFixed(2)}</td>
              <td>{rate.minimumRate.toFixed(2)}</td>
              <td>{rate.specialPieces.length}</td>
              <td>
                <button onClick={() => deleteRate(rate.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
