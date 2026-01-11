// 📝 WHAT: Archivo de configuración inicial para tests
// 🎯 WHY: Carga utilidades globales antes de ejecutar cualquier test
// 🔍 TYPE: Setup file para Vitest

import '@testing-library/jest-dom'

// Mock localStorage for test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// @ts-expect-error - Mocking global localStorage
global.localStorage = localStorageMock

// Este archivo se ejecuta automáticamente antes de cada test
// Aquí cargamos jest-dom que añade matchers útiles como:
// - expect(element).toBeInTheDocument()
// - expect(element).toHaveClass('className')
// - expect(element).toBeVisible()
