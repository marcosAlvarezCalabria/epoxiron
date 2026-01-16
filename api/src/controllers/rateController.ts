/**
 * CONTROLLER: Rates
 *
 * Handles HTTP requests for rate management.
 * Validates data, calls storage, and returns responses.
 *
 * Location: Backend - Controllers (Application Layer)
 * Reason: Coordinates HTTP requests with business logic
 */

import type { Request, Response } from 'express'
import type { Rate } from '../types/rate'
import { ratesStorage } from '../storage/ratesStorage'
import * as customersStorage from '../storage/customersStorage'
import { randomUUID } from 'node:crypto'

/**
 * GET /api/rates
 * List all rates
 */
export async function listRates(req: Request, res: Response): Promise<void> {
  const customerId = req.query.customerId as string

  if (customerId) {
    const rate = ratesStorage.findByCustomerId(customerId)
    res.status(200).json(rate ? [rate] : [])
    return
  }

  const rates = ratesStorage.findAll()
  res.status(200).json(rates)
}

/**
 * GET /api/rates/:id
 * Get rate by ID
 */
export async function getRate(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  const rate = ratesStorage.findById(id)

  if (!rate) {
    res.status(404).json({ error: 'Rate not found' })
    return
  }

  res.status(200).json(rate)
}

/**
 * GET /api/rates/customer/:customerId
 * Get rate by customer ID
 */
export async function getRateByCustomer(req: Request, res: Response): Promise<void> {
  const { customerId } = req.params

  const rate = ratesStorage.findByCustomerId(customerId)

  if (!rate) {
    res.status(404).json({ error: 'Rate not found for this customer' })
    return
  }

  res.status(200).json(rate)
}

/**
 * POST /api/rates
 * Create new rate
 */
export async function createRate(req: Request, res: Response): Promise<void> {
  const {
    customerId,
    ratePerLinearMeter,
    ratePerSquareMeter,
    minimumRate,
    specialPieces
  } = req.body

  // Validate required field
  if (!customerId || customerId.trim().length === 0) {
    res.status(400).json({ error: 'Customer ID is required' })
    return
  }

  // Validate rates are positive numbers
  if (
    ratePerLinearMeter < 0 ||
    ratePerSquareMeter < 0 ||
    minimumRate < 0
  ) {
    res.status(400).json({ error: 'Rates must be positive numbers' })
    return
  }

  // Create new rate
  const newRate: Rate = {
    id: randomUUID(),
    customerId: customerId.trim(),
    ratePerLinearMeter,
    ratePerSquareMeter,
    minimumRate,
    specialPieces: specialPieces || [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const createdRate = ratesStorage.create(newRate)

  // Sync: Update customer with the new rate ID
  customersStorage.update(customerId.trim(), { rateId: createdRate.id })

  res.status(201).json(createdRate)
}

/**
 * PUT /api/rates/:id
 * Update existing rate
 */
export async function updateRate(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const {
    ratePerLinearMeter,
    ratePerSquareMeter,
    minimumRate,
    specialPieces
  } = req.body

  // Validate rates are positive if provided
  if (
    (ratePerLinearMeter !== undefined && ratePerLinearMeter < 0) ||
    (ratePerSquareMeter !== undefined && ratePerSquareMeter < 0) ||
    (minimumRate !== undefined && minimumRate < 0)
  ) {
    res.status(400).json({ error: 'Rates must be positive numbers' })
    return
  }

  // Prepare data to update
  const updates: Partial<Rate> = {}
  if (ratePerLinearMeter !== undefined) updates.ratePerLinearMeter = ratePerLinearMeter
  if (ratePerSquareMeter !== undefined) updates.ratePerSquareMeter = ratePerSquareMeter
  if (minimumRate !== undefined) updates.minimumRate = minimumRate
  if (specialPieces !== undefined) updates.specialPieces = specialPieces

  // Update in storage
  const updatedRate = ratesStorage.update(id, updates)

  if (!updatedRate) {
    res.status(404).json({ error: 'Rate not found' })
    return
  }

  res.status(200).json(updatedRate)
}

/**
 * DELETE /api/rates/:id
 * Delete rate
 */
export async function deleteRate(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  const rate = ratesStorage.findById(id)

  if (!rate) {
    res.status(404).json({ error: 'Rate not found' })
    return
  }

  // Sync: Remove rate ID from customer
  customersStorage.update(rate.customerId, { rateId: undefined })

  const deleted = ratesStorage.delete(id)

  if (!deleted) {
    res.status(404).json({ error: 'Rate not found' })
    return
  }

  res.status(200).json({ message: 'Rate deleted successfully' })
}
