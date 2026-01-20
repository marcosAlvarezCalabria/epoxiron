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
    const customers = await customersStorage.findAll()

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
    const customer = await customersStorage.findById(id)

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
      address,
      notes,
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

    // 4. VALIDATE: Pricing is required (except special pieces which are optional lists)
    if (!pricePerLinearMeter || pricePerLinearMeter <= 0) {
      return res.status(400).json({ message: 'Price per linear meter is required and must be greater than 0' })
    }
    if (!pricePerSquareMeter || pricePerSquareMeter <= 0) {
      return res.status(400).json({ message: 'Price per square meter is required and must be greater than 0' })
    }
    if (!minimumRate || minimumRate <= 0) {
      return res.status(400).json({ message: 'Minimum rate is required and must be greater than 0' })
    }

    // 5. VALIDATE: Special pieces prices
    if (specialPieces && specialPieces.length > 0) {
      for (const piece of specialPieces) {
        if (!piece.price || piece.price <= 0) {
          return res.status(400).json({ message: `Price for special piece "${piece.name}" is required` })
        }
      }
    }

    // 6. Create the complete Customer object
    const newCustomer: Customer = {
      id: randomUUID(),              // Generate unique ID (UUID)
      name: name.trim(),             // Clean spaces
      email: email?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      notes: notes?.trim(),

      pricePerLinearMeter,
      pricePerSquareMeter,
      minimumRate,
      specialPieces: specialPieces || [],

      createdAt: new Date(),         // Creation date
      updatedAt: new Date()          // Update date
    }

    // 7. Save in storage
    const savedCustomer = await customersStorage.create(newCustomer)

    // 8. Return successful response with created customer
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
      address,
      notes,
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
    if (address !== undefined) updates.address = address.trim()
    if (notes !== undefined) updates.notes = notes.trim()

    // Pricing updates
    if (pricePerLinearMeter !== undefined) updates.pricePerLinearMeter = pricePerLinearMeter
    if (pricePerSquareMeter !== undefined) updates.pricePerSquareMeter = pricePerSquareMeter
    if (minimumRate !== undefined) updates.minimumRate = minimumRate
    if (specialPieces !== undefined) updates.specialPieces = specialPieces

    // 6. Update in storage
    const updatedCustomer = await customersStorage.update(id, updates)

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

    // 2. Find customer (to verify existence)
    const customer = await customersStorage.findById(id)
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    // 3. Delete from storage
    // NOTE: If using a real DB with Foreign Keys, this might fail if they have Delivery Notes
    await customersStorage.deleteById(id)

    // 4. Return successful response without content
    return res.status(204).send()  // 204 = No Content (success without body)
  } catch (error: any) {
    console.error('Error deleting customer:', error)

    // Check for Prisma foreign key constraint error (P2003)
    // Or generic "foreign key" message if using other driver
    if (error.code === 'P2003' || error.message?.includes('foreign key')) {
      return res.status(400).json({
        message: 'Cannot delete customer because they have associated delivery notes. Please delete the delivery notes first.'
      })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}
