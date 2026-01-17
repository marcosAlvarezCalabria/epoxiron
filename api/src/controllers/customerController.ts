// 📝 WHAT: Controller that handles CRUD operations for Customers
// 🎯 WHY: Separates business logic from routes
// 🔍 HOW: Receives HTTP requests, validates, calls storage, returns responses

import { Request, Response } from 'express'
import { randomUUID } from 'crypto'
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer'
import * as customersStorage from '../storage/customersStorage'

// 🏗️ ANALOGY: The controller is the FOREMAN of the construction site
// - Receives orders (HTTP requests)
// - Validates everything is correct
// - Coordinates the work (calls storage)
// - Returns results (HTTP responses)

/**
 * 📋 LIST ALL CUSTOMERS
 * GET /api/customers
 *
 * Like doing warehouse inventory: "Show me all customers"
 */
export async function listCustomers(req: Request, res: Response) {
  try {

    // 1. Get all customers from storage
    const customers = customersStorage.findAll()

    // 2. Return successful response
    return res.status(200).json(customers)
  } catch (error) {
    console.error('Error listing customers:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * 🔍 GET ONE CUSTOMER BY ID
 * GET /api/customers/:id
 *
 * Like searching for specific material: "Give me customer with ID xyz"
 */
export async function getCustomer(req: Request, res: Response) {
  try {
    // 1. Get ID from URL parameters
    const { id } = req.params

    // 2. Search for customer in storage
    const customer = customersStorage.findById(id)

    // 3. If doesn't exist, return 404 error
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    // 4. If exists, return it
    return res.status(200).json(customer)
  } catch (error) {
    console.error('Error getting customer:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * ➕ CREATE NEW CUSTOMER
 * POST /api/customers
 * Body: { "name": "John Doe" }
 *
 * Like adding new material to the warehouse
 */
/**
 * ➕ CREATE NEW CUSTOMER
 * POST /api/customers
 * Body: { "name": "John Doe", "pricePerLinearMeter": 10 ... }
 *
 * Like adding new material to the warehouse
 */
export async function createCustomer(req: Request, res: Response) {
  try {
    // 1. Get data from body
    const {
      name,
      email,
      phone,
      pricePerLinearMeter,
      pricePerSquareMeter,
      minimumRate,
      specialPieces
    } = req.body as CreateCustomerRequest

    // 2. VALIDATE: Name is required
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Name is required' })
    }

    // 3. VALIDATE: Name must be at least 2 characters
    if (name.trim().length < 2) {
      return res.status(400).json({
        message: 'Name must be at least 2 characters long'
      })
    }

    // 4. Create the complete Customer object
    const newCustomer: Customer = {
      id: randomUUID(),              // Generate unique ID (UUID)
      name: name.trim(),             // Clean spaces
      email: email?.trim(),
      phone: phone?.trim(),

      // Default to 0 if not provided, to ensure type safety
      pricePerLinearMeter: pricePerLinearMeter || 0,
      pricePerSquareMeter: pricePerSquareMeter || 0,
      minimumRate: minimumRate || 0,
      specialPieces: specialPieces || [],

      createdAt: new Date(),         // Creation date
      updatedAt: new Date()          // Update date
    }

    // 5. Save in storage
    const savedCustomer = customersStorage.create(newCustomer)

    // 6. Return successful response with created customer
    return res.status(201).json(savedCustomer)
  } catch (error) {
    console.error('Error creating customer:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * ✏️ UPDATE EXISTING CUSTOMER
 * PUT /api/customers/:id
 * Body: { "name": "John Doe Updated", "pricePerLinearMeter": 15 ... }
 *
 * Like replacing a material with a new one
 */
export async function updateCustomer(req: Request, res: Response) {
  try {
    // 1. Get ID from parameters
    const { id } = req.params

    // 2. Get data from body
    const {
      name,
      email,
      phone,
      pricePerLinearMeter,
      pricePerSquareMeter,
      minimumRate,
      specialPieces
    } = req.body as UpdateCustomerRequest

    // 3. VALIDATE: At least one field must be provided
    // (We check if objects are empty)
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'At least one field must be provided to update'
      })
    }

    // 4. VALIDATE: If name is provided, it must be valid
    if (name !== undefined && name.trim().length < 2) {
      return res.status(400).json({
        message: 'Name must be at least 2 characters long'
      })
    }

    // 5. Prepare data to update
    const updates: Partial<Customer> = {}
    if (name !== undefined) updates.name = name.trim()
    if (email !== undefined) updates.email = email.trim()
    if (phone !== undefined) updates.phone = phone.trim()

    // Pricing updates
    if (pricePerLinearMeter !== undefined) updates.pricePerLinearMeter = pricePerLinearMeter
    if (pricePerSquareMeter !== undefined) updates.pricePerSquareMeter = pricePerSquareMeter
    if (minimumRate !== undefined) updates.minimumRate = minimumRate
    if (specialPieces !== undefined) updates.specialPieces = specialPieces

    // 6. Update in storage
    const updatedCustomer = customersStorage.update(id, updates)

    // 7. If doesn't exist, return 404 error
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    // 8. Return updated customer
    return res.status(200).json(updatedCustomer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

/**
 * 🗑️ DELETE CUSTOMER
 * DELETE /api/customers/:id
 *
 * Like removing material from warehouse
 *
 * TODO: Later validate that it doesn't have associated delivery notes
 */
export async function deleteCustomer(req: Request, res: Response) {
  try {
    // 1. Get ID from parameters
    const { id } = req.params

    // 2. TODO: Validate customer doesn't have associated delivery notes
    // (We skip this for now, we'll do it when we have the DeliveryNote entity)

    // 3. Find customer (to verify existence)
    const customer = customersStorage.findById(id)

    // 4. Delete from storage
    const deleted = customersStorage.deleteById(id)

    // 5. If didn't exist, return 404 error
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    // 6. Return successful response without content
    return res.status(204).send()  // 204 = No Content (success without body)
  } catch (error) {
    console.error('Error deleting customer:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
