/**
 * ROUTES: Rates
 *
 * Defines HTTP endpoints for rate management.
 * Maps URLs and HTTP methods to controller functions.
 *
 * Location: Backend - Routes (Application Layer)
 * Reason: Defines the API structure and endpoints
 */

import { Router } from 'express'
import {
  listRates,
  getRate,
  getRateByCustomer,
  createRate,
  updateRate,
  deleteRate
} from '../controllers/rateController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// 🔒 PROTECT ALL ROUTES: Apply auth middleware to all rate routes
router.use(authMiddleware)

// GET /api/rates - List all rates
router.get('/', listRates)

// GET /api/rates/customer/:customerId - Get rate by customer ID
router.get('/customer/:customerId', getRateByCustomer)

// GET /api/rates/:id - Get rate by ID
router.get('/:id', getRate)

// POST /api/rates - Create new rate
router.post('/', createRate)

// PUT /api/rates/:id - Update rate
router.put('/:id', updateRate)

// DELETE /api/rates/:id - Delete rate
router.delete('/:id', deleteRate)

export default router
