/**
 * ROUTES: Delivery Notes
 *
 * Defines HTTP endpoints for delivery note management.
 * Maps URLs and HTTP methods to controller functions.
 *
 * Location: Backend - Routes (Application Layer)
 * Reason: Defines the API structure and endpoints
 */

import { Router } from 'express'
import {
  listDeliveryNotes,
  getDeliveryNote,
  createDeliveryNote,
  updateDeliveryNote,
  deleteDeliveryNote,
  updateDeliveryNoteStatus
} from '../controllers/deliveryNoteController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// 🔒 PROTECT ALL ROUTES: Apply auth middleware to all delivery note routes
router.use(authMiddleware)

// GET /api/delivery-notes - List all delivery notes (with optional filters)
router.get('/', listDeliveryNotes)

// GET /api/delivery-notes/:id - Get delivery note by ID
router.get('/:id', getDeliveryNote)

// POST /api/delivery-notes - Create new delivery note
router.post('/', createDeliveryNote)

// PUT /api/delivery-notes/:id - Update delivery note
router.put('/:id', updateDeliveryNote)

// PATCH /api/delivery-notes/:id/status - Update delivery note status
router.patch('/:id/status', updateDeliveryNoteStatus)

// DELETE /api/delivery-notes/:id - Delete delivery note
router.delete('/:id', deleteDeliveryNote)

export default router
