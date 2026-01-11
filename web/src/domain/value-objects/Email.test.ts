/**
 * TESTS: Email Value Object
 * Location: Domain Layer - Tests
 * Target: Email.ts
 *
 * Test coverage:
 * - Valid email creation
 * - Invalid email rejection
 * - Email normalization (lowercase, trim)
 * - Equality comparison
 * - Value extraction
 */

import { describe, it, expect } from 'vitest'
import { Email } from './Email'

describe('Email Value Object', () => {
  describe('Valid email creation', () => {
    it('should create Email with valid email address', () => {
      const email = new Email('user@example.com')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should create Email with complex valid address', () => {
      const email = new Email('test.user+tag@subdomain.example.com')
      expect(email.getValue()).toBe('test.user+tag@subdomain.example.com')
    })
  })

  describe('Email normalization', () => {
    it('should convert email to lowercase', () => {
      const email = new Email('USER@EXAMPLE.COM')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should trim whitespace from email', () => {
      const email = new Email('  user@example.com  ')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should trim and lowercase email', () => {
      const email = new Email('  USER@EXAMPLE.COM  ')
      expect(email.getValue()).toBe('user@example.com')
    })
  })

  describe('Invalid email rejection', () => {
    it('should throw error for email without @', () => {
      expect(() => new Email('invalid-email')).toThrow('Email inválido')
    })

    it('should throw error for email without domain', () => {
      expect(() => new Email('user@')).toThrow('Email inválido')
    })

    it('should throw error for email without user', () => {
      expect(() => new Email('@example.com')).toThrow('Email inválido')
    })

    it('should throw error for email without TLD', () => {
      expect(() => new Email('user@domain')).toThrow('Email inválido')
    })

    it('should throw error for empty string', () => {
      expect(() => new Email('')).toThrow('Email inválido')
    })

    it('should throw error for email with spaces', () => {
      expect(() => new Email('user name@example.com')).toThrow('Email inválido')
    })
  })

  describe('Equality comparison', () => {
    it('should return true for identical emails', () => {
      const email1 = new Email('user@example.com')
      const email2 = new Email('user@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return true for emails with different casing', () => {
      const email1 = new Email('USER@example.com')
      const email2 = new Email('user@EXAMPLE.COM')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return true for emails with whitespace', () => {
      const email1 = new Email('  user@example.com  ')
      const email2 = new Email('user@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different emails', () => {
      const email1 = new Email('user1@example.com')
      const email2 = new Email('user2@example.com')
      expect(email1.equals(email2)).toBe(false)
    })
  })

  describe('Value extraction', () => {
    it('should return email value with getValue()', () => {
      const email = new Email('user@example.com')
      expect(email.getValue()).toBe('user@example.com')
    })

    it('should return normalized email with getValue()', () => {
      const email = new Email('  USER@EXAMPLE.COM  ')
      expect(email.getValue()).toBe('user@example.com')
    })
  })

  describe('toString method', () => {
    it('should return email as string', () => {
      const email = new Email('user@example.com')
      expect(email.toString()).toBe('user@example.com')
    })

    it('should return normalized email as string', () => {
      const email = new Email('  USER@EXAMPLE.COM  ')
      expect(email.toString()).toBe('user@example.com')
    })
  })
})
