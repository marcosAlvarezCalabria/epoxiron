// 📝 WHAT: Temporary in-memory storage for customers
// 🎯 WHY: Need to store customers somewhere
// 🔍 HOW: Using an array for now (later will be a real database)

import { Customer } from '../types/customer'

// 🏗️ ANALOGY: Like a materials warehouse on the construction site
// For now it's a simple array, later it will be a real database

// 📦 STORAGE - Empty array at start
let customers: Customer[] = []

// 🔧 STORAGE OPERATIONS (CRUD)

/**
 * 📋 LIST ALL - Like doing inventory of the warehouse
 * Returns all existing customers
 */
export function findAll(): Customer[] {
  return customers
}

/**
 * 🔍 FIND ONE BY ID - Like searching for a specific material by code
 * @param id - Customer ID to find
 * @returns Found customer or undefined if doesn't exist
 */
export function findById(id: string): Customer | undefined {
  return customers.find(customer => customer.id === id)
}

/**
 * ➕ CREATE NEW - Like adding new material to the warehouse
 * @param customer - Customer to save (already has ID, dates, etc.)
 * @returns The customer we just saved
 */
export function create(customer: Customer): Customer {
  customers.push(customer)  // Add it to the array
  return customer
}

/**
 * ✏️ UPDATE - Like replacing a material with a new one
 * @param id - Customer ID to update
 * @param updates - New data (only what we want to change)
 * @returns Updated customer or undefined if doesn't exist
 */
export function update(id: string, updates: Partial<Customer>): Customer | undefined {
  // 1. Find the customer's index in the array
  const index = customers.findIndex(customer => customer.id === id)

  // 2. If doesn't exist, return undefined
  if (index === -1) {
    return undefined
  }

  // 3. Update the customer (merge old data with new)
  customers[index] = {
    ...customers[index],   // Old data
    ...updates,            // New data (overwrites old)
    updatedAt: new Date()  // Update the date
  }

  return customers[index]
}

/**
 * 🗑️ DELETE - Like removing a material from the warehouse
 * @param id - Customer ID to delete
 * @returns true if deleted, false if didn't exist
 */
export function deleteById(id: string): boolean {
  const initialLength = customers.length

  // Filter = keep all EXCEPT the one we want to delete
  customers = customers.filter(customer => customer.id !== id)

  // If size changed, we did delete it
  return customers.length < initialLength
}

/**
 * 🧹 CLEAR ALL - Like emptying the warehouse completely
 * (Useful for testing)
 */
export function clearAll(): void {
  customers = []
}
