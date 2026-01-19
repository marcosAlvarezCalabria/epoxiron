/**
 * DOMAIN EXCEPTION: DeliveryNoteException
 *
 * Business errors related to delivery notes.
 *
 * Location: Domain Layer
 * Reason: Specific business errors for delivery notes
 * Dependencies: None
 *
 * Why domain exceptions?
 * - Errors with business meaning (not technical)
 * - Typed code (easy to handle in UI)
 * - Descriptive messages for the user
 */

export type DeliveryNoteErrorCode =
  | 'DELIVERY_NOTE_WITHOUT_CUSTOMER'
  | 'DELIVERY_NOTE_WITHOUT_ITEMS'
  | 'DELIVERY_NOTE_ALREADY_VALIDATED'
  | 'DELIVERY_NOTE_ALREADY_FINALIZED'
  | 'DELIVERY_NOTE_NOT_EDITABLE'
  | 'ITEM_NOT_FOUND'
  | 'INVALID_STATUS'
  | 'ITEMS_WITHOUT_PRICE'

export class DeliveryNoteException extends Error {
  public readonly code: DeliveryNoteErrorCode

  constructor(code: DeliveryNoteErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'DeliveryNoteException'
  }

  // Factory methods to create common exceptions

  static withoutCustomer(): DeliveryNoteException {
    return new DeliveryNoteException(
      'DELIVERY_NOTE_WITHOUT_CUSTOMER',
      'The delivery note must have an assigned customer'
    )
  }

  static withoutItems(): DeliveryNoteException {
    return new DeliveryNoteException(
      'DELIVERY_NOTE_WITHOUT_ITEMS',
      'The delivery note must have at least one item'
    )
  }

  static alreadyValidated(): DeliveryNoteException {
    return new DeliveryNoteException(
      'DELIVERY_NOTE_ALREADY_VALIDATED',
      'The delivery note is already validated and cannot be edited'
    )
  }

  static alreadyFinalized(): DeliveryNoteException {
    return new DeliveryNoteException(
      'DELIVERY_NOTE_ALREADY_FINALIZED',
      'The delivery note is already finalized and cannot be modified'
    )
  }

  static notEditable(): DeliveryNoteException {
    return new DeliveryNoteException(
      'DELIVERY_NOTE_NOT_EDITABLE',
      'The delivery note cannot be edited in its current status'
    )
  }

  static itemNotFound(itemId: string): DeliveryNoteException {
    return new DeliveryNoteException(
      'ITEM_NOT_FOUND',
      `Item with ID not found: ${itemId}`
    )
  }

  static invalidStatus(currentStatus: string, desiredStatus: string): DeliveryNoteException {
    return new DeliveryNoteException(
      'INVALID_STATUS',
      `Cannot change status from '${currentStatus}' to '${desiredStatus}'`
    )
  }

  static itemsWithoutPrice(itemNames: string): DeliveryNoteException {
    return new DeliveryNoteException(
      'ITEMS_WITHOUT_PRICE',
      `Cannot validate: The following items do not have a calculated price: ${itemNames}`
    )
  }
}
