export class DomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'DomainError'
    }
}

export class ValidationError extends DomainError {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

export class NotFoundError extends DomainError {
    constructor(resource: string, id?: string) {
        super(`${resource} ${id ? `with ID ${id} ` : ''}not found`)
        this.name = 'NotFoundError'
    }
}

export class DuplicateError extends DomainError {
    constructor(resource: string, field: string, value: string) {
        super(`${resource} with ${field} '${value}' already exists`)
        this.name = 'DuplicateError'
    }
}

export class ConnectionError extends DomainError {
    constructor(message: string = 'Network connection error') {
        super(message)
        this.name = 'ConnectionError'
    }
}

export class ServerError extends DomainError {
    constructor(message: string = 'Internal server error') {
        super(message)
        this.name = 'ServerError'
    }
}
