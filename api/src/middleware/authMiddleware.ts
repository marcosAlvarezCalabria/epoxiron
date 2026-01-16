// 📝 WHAT: Authentication middleware
// 🎯 WHY: Protect routes and verify JWT tokens
// 🔍 HOW: Intercept requests, verify token, attach user info

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 🔧 Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
      }
    }
  }
}

/**
 * Auth Middleware
 *
 * This middleware:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies the token is valid
 * 3. Attaches user info to request object
 * 4. Allows request to continue to controller
 * 5. Returns 401 if token is missing or invalid
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Get token from Authorization header
    // Expected format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header missing',
        message: 'Please provide a valid token'
      })
    }

    // 2. Extract token (remove "Bearer " prefix)
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader

    if (!token) {
      return res.status(401).json({
        error: 'Token missing',
        message: 'Please provide a valid token'
      })
    }

    // 3. Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
    }

    // 4. Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    }

    // 5. Continue to controller
    next()

  } catch (error) {
    // Token verification failed
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed'
      })
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      })
    }

    // Other errors
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error'
    })
  }
}
