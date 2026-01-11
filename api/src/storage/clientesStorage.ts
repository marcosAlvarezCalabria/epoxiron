/**
 * STORAGE: Clientes
 *
 * In-memory storage for customers (temporary solution).
 * Will be migrated to a database in the future.
 *
 * Location: Backend - Storage (Infrastructure Layer)
 * Reason: Data persistence abstraction
 */

import type { Cliente } from '../types/cliente'

let clientes: Cliente[] = []

export const clientesStorage = {
  /**
   * Get all customers
   */
  findAll: (): Cliente[] => {
    return clientes
  },

  /**
   * Find customer by ID
   */
  findById: (id: string): Cliente | undefined => {
    return clientes.find(c => c.id === id)
  },

  /**
   * Create new customer
   */
  create: (cliente: Cliente): Cliente => {
    clientes.push(cliente)
    return cliente
  },

  /**
   * Update existing customer
   */
  update: (id: string, data: Partial<Cliente>): Cliente | null => {
    const index = clientes.findIndex(c => c.id === id)

    if (index === -1) {
      return null
    }

    clientes[index] = {
      ...clientes[index],
      ...data,
      updatedAt: data.updatedAt || new Date()
    }

    return clientes[index]
  },

  /**
   * Delete customer
   */
  delete: (id: string): boolean => {
    const initialLength = clientes.length
    clientes = clientes.filter(c => c.id !== id)
    return clientes.length < initialLength
  },

  /**
   * Check if customer exists
   */
  exists: (id: string): boolean => {
    return clientes.some(c => c.id === id)
  },

  /**
   * Clear all customers (for testing)
   */
  clearAll: (): void => {
    clientes = []
  }
}
