
import { User } from '../entities/User'
import { Email } from '../value-objects/Email'
import { Token } from '../value-objects/Token'

export interface AuthRepository {
    login(email: Email, password: string): Promise<{ user: User; token: Token }>
    logout(): void
    getCurrentUser(): Promise<User | null>
}
