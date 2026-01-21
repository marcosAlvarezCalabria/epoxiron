# UX Evaluation Report

**Date:** 2026-01-21
**Evaluator:** UX Evaluator Agent
**Scope:** Delivery Note Management System (Login, List, Form)

## Executive Summary

The application shows a solid foundation with a clear focus on utility for the workshop environment. The **Dark Mode** aesthetic is appropriate for lower-light industrial settings. The **Real-time Price Calculation** in the delivery note form is a standout feature that reduces cognitive load.

**Overall Rating:** **Good (B)**
The primary friction point is the reliance on **Native Browser Alerts** (`window.alert`, `window.confirm`) for interaction, which interrupts the user flow and cannot be styled.

### Top 3 Strengths
1.  **Safety Mechanisms**: The form explicitly warns users if they try to save without adding the item they are typing (Data Loss Prevention).
2.  **Information Hierarchy**: The Delivery Note list provides clear status badges and essential financial data at a glance.
3.  **Visual Feedback**: Real-time calculation of totals and line-item prices gives immediate feedback to the operator.

### Top 3 Critical Issues
1.  **Native Alerts (Blocking)**: Using `window.alert()` for validation errors is invasive and breaks the immersion/UX.
2.  **Form Complexity**: The "New Item" form within the main form creates a "Form within a Form" mental model that can be confusing.
3.  **Feedback Visibility**: Some error states rely on the user noticing a native alert rather than highlighting the specific field.

---

## Detailed Findings

### 1. [High Severity] Native Browser Alerts
*   **Location**: `DeliveryNoteForm.tsx` (Validation & Confirmations)
*   **Problem**: The application uses `alert('Por favor, introduce un nombre...')` and `confirm(...)`. These block the entire browser thread, look inconsistent across OS/Browsers, and cannot be styled.
*   **Recommendation**: Replace with a **Custom Modal** or **Toast Notification** system.
    *   *Quick Fix*: Use a simple React Context for a global Modal.

### 2. [Medium Severity] "Form within a Form" Pattern
*   **Location**: `DeliveryNoteForm.tsx` (Add Item Section)
*   **Problem**: Users often fill out the "New Item" fields and mistakenly click the main "Crear Albarán" button at the bottom, expecting the item to be included.
*   **Mitigation Present**: The code effectively catches this (`confirmDiscard`), which is excellent.
*   **Recommendation**:
    *   **Visual**: Enclose the "New Item" section in a more distinct container (e.g., "Card" style with a different background shade).
    *   **Action**: Change the "Añadir a la lista" button color to contrast sharply with the main "Guardar" button.

### 3. [Medium Severity] Accessibility - Error Association
*   **Location**: `LoginForm.tsx`
*   **Problem**: While visual errors are shown, they are not programmatically linked to inputs using `aria-describedby`. Screen reader users might not hear the error immediately when focusing the input.
*   **Recommendation**: Add `aria-describedby="email-error"` to the input and `id="email-error"` to the error message paragraph.

### 4. [Low Severity] Loading States
*   **Location**: `DeliveryNotesPage.tsx`
*   **Problem**: The loading spinner is basic.
*   **Recommendation**: Implement **Skeleton Screens** (Skeleton Loaders) that mimic the table structure to reduce perceived waiting time.

---

## Accessibility Compliance Summary

*   **Estimated Compliance**: **WCAG 2.1 AA (Partial)**
*   **Contrast**: Dark mode generally provides good contrast, but check disabled button states (e.g. `bg-blue-400`).
*   **Keyboard Nav**: Standard HTML inputs are used, which is good. Ensure the "Delete Item" button in the list is reachable.

## Quick Wins (Recommended Immediate Actions)

1.  **Replace Alerts**: Swap `window.alert` for a library like `sonner` or `react-hot-toast`.
2.  **Input Focus**: When validation fails (e.g., missing Name), programmatically focus that input field so the user can type immediately.
3.  **Empty States**: Add an illustration or helpful text in the Delivery Notes list when it's empty ("No hay albaranes. ¡Crea el primero!").
