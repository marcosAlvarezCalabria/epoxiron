/**
 * STORAGE: Rates
 *
 * In-memory storage for pricing rates (temporary solution).
 * Will be migrated to a database in the future.
 *
 * Location: Backend - Storage (Infrastructure Layer)
 * Reason: Data persistence abstraction
 */

import type { Rate } from '../types/rate'

let rates: Rate[] = []

export const ratesStorage = {
  /**
   * Get all rates
   */
  findAll: (): Rate[] => {
    return rates
  },

  /**
   * Find rate by ID
   */
  findById: (id: string): Rate | undefined => {
    return rates.find(r => r.id === id)
  },

  /**
   * Find rate by customer ID
   */
  findByCustomerId: (customerId: string): Rate | undefined => {
    return rates.find(r => r.customerId === customerId)
  },

  /**
   * Create new rate
   */
  create: (rate: Rate): Rate => {
    rates.push(rate)
    return rate
  },

  /**
   * Update existing rate
   */
  update: (id: string, data: Partial<Rate>): Rate | null => {
    const index = rates.findIndex(r => r.id === id)

    if (index === -1) {
      return null
    }

    rates[index] = {
      ...rates[index],
      ...data,
      updatedAt: data.updatedAt || new Date()
    }

    return rates[index]
  },

  /**
   * Delete rate
   */
  delete: (id: string): boolean => {
    const initialLength = rates.length
    rates = rates.filter(r => r.id !== id)
    return rates.length < initialLength
  },

  /**
   * Check if rate exists
   */
  exists: (id: string): boolean => {
    return rates.some(r => r.id === id)
  },

  /**
   * Clear all rates (for testing)
   */
  clearAll: (): void => {
    rates = []
  }
}
