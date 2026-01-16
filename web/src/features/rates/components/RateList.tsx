/**
 * COMPONENT: RateList
 * Actualizado con dark theme consistente
 */

import { useRates } from '../hooks/useRates'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

export function RateList() {
  const { data: rates, isLoading, error } = useRates()
  const { data: customers } = useCustomers()

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        Cargando tarifas...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center text-red-400">
        Error al cargar las tarifas
      </div>
    )
  }

  if (!rates || rates.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center text-gray-400">
        No se encontraron tarifas
      </div>
    )
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId)
    return customer?.name || 'Cliente desconocido'
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-black/20 px-4 py-3 flex justify-between items-center">
        <h3 className="text-white text-lg font-bold">Lista de Tarifas</h3>
        <span className="text-gray-400 text-sm">{rates.length} tarifas</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/10">
            <tr>
              <th className="px-4 py-3 text-gray-400 text-sm font-bold">Cliente</th>
              <th className="px-4 py-3 text-gray-400 text-sm font-bold">€/ml</th>
              <th className="px-4 py-3 text-gray-400 text-sm font-bold">€/m²</th>
              <th className="px-4 py-3 text-gray-400 text-sm font-bold">Mínimo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rates.map((rate) => (
              <tr key={rate.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-bold text-white">{getCustomerName(rate.customerId)}</p>
                    <p className="text-gray-400 text-xs">ID: {rate.id}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-green-400 font-medium">
                    €{(rate.ratePerLinearMeter || 0).toFixed(2)}/ml
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-blue-400 font-medium">
                    €{(rate.ratePerSquareMeter || 0).toFixed(2)}/m²
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-purple-400 font-medium">
                    €{(rate.minimumRate || 0).toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
