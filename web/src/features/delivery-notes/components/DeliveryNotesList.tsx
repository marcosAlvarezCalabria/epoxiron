/**
 * COMPONENT: DeliveryNotesList
 *
 * Simple list of delivery notes
 * (Styles will be updated with Figma design later)
 */

import { useDeliveryNotes } from '../hooks/useDeliveryNotes'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useRates } from '@/features/rates/hooks/useRates'

export function DeliveryNotesList() {
  const { data: deliveryNotes, isLoading, error } = useDeliveryNotes()
  const { data: customers } = useCustomers()
  const { data: rates } = useRates()

  if (isLoading) {
    return <div className="text-center py-4">Loading delivery notes...</div>
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">Error loading delivery notes</div>
  }

  if (!deliveryNotes || deliveryNotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">No delivery notes found</div>
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId)
    return customer?.name || 'Unknown Customer'
  }

  const getRateInfo = (rateId: string) => {
    const rate = rates?.find(r => r.id === rateId)
    if (!rate) return { description: 'Unknown Service', price: 0 }
    
    return {
      description: `Linear: €${rate.ratePerLinearMeter}/ml | Square: €${rate.ratePerSquareMeter}/m²`,
      price: rate.ratePerLinearMeter // Use linear meter as default for calculation
    }
  }

  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => {
      const rateInfo = getRateInfo(item.rateId)
      return total + rateInfo.price * item.quantity
    }, 0)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 border-b">Delivery Notes</h3>
      <div className="divide-y divide-gray-200">
        {deliveryNotes.map((deliveryNote) => (
          <div key={deliveryNote.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">
                  {getCustomerName(deliveryNote.customerId)}
                </h4>
                <p className="text-sm text-gray-500">
                  Date: {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  Total: €{calculateTotal(deliveryNote.items).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">ID: {deliveryNote.id}</p>
              </div>
            </div>

            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-700 mb-1">Items:</h5>
              <div className="text-sm text-gray-600 space-y-1">
                {deliveryNote.items.map((item) => {
                  const rateInfo = getRateInfo(item.rateId)
                  return (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.description || 'Service'} (Qty: {item.quantity})
                      </span>
                      <span>€{(rateInfo.price * item.quantity).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {deliveryNote.notes && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {deliveryNote.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}