import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { config } from '../config/app.config.js'
import jwtConfig from '../config/jwt.js'
import { UserModel, type UserRow } from '../models/User.model.js'
import type { AuthResponse, CreateUserRequest, LoginRequest, User } from '../types/index.js'

export class AuthService {
  constructor(private userModel: UserModel) {}

  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    console.log('🔐 Starting user registration for:', userData.email)

    const existingUser = await this.userModel.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    this.validateRegistrationData(userData)
    console.log('✅ Registration data validated')

    const passwordHash = await bcrypt.hash(userData.password, config.bcryptRounds)
    console.log('🔒 Password hashed securely')

    const userId = await this.userModel.create({
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
    })
    console.log('💾 User saved to database with ID:', userId)

    const userRow = await this.userModel.findById(userId)
    if (!userRow) {
      throw new Error('Failed to create user')
    }

    const user = this.mapUserRowToUser(userRow)

    const token = this.generateToken(userId)
    console.log('🎫 JWT token generated for user')

    return { user, token }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔑 Starting user login for:', credentials.email)

    const userRow = await this.userModel.findByEmail(credentials.email)
    if (!userRow) {
      throw new Error('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(credentials.password, userRow.password_hash)
    if (!isValidPassword) {
      console.log('❌ Invalid password attempt for:', credentials.email)
      throw new Error('Invalid email or password')
    }

    console.log('✅ Password verified for user:', credentials.email)

    const user = this.mapUserRowToUser(userRow)

    const token = this.generateToken(userRow.id)

    return { user, token }
  }

  async getUserById(id: number): Promise<User | null> {
    const userRow = await this.userModel.findById(id)
    return userRow ? this.mapUserRowToUser(userRow) : null
  }

  verifyToken(token: string): { userId: number } {
    try {
      return jwt.verify(token, config.jwtSecret) as { userId: number }
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  // ========== PRIVATE HELPER METHODS ==========

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, jwtConfig.jwt.secret, { expiresIn: jwtConfig.jwt.expiresIn })
  }

  private validateRegistrationData(data: CreateUserRequest): void {
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Valid email is required')
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    if (!data.firstName || data.firstName.trim().length < 5) {
      throw new Error('First name must be at least 2 characters')
    }
    if (!data.lastName || data.lastName.trim().length < 5) {
      throw new Error('Last name must be at least 5 characters')
    }
  }

  private mapUserRowToUser(userRow: UserRow): User {
    return {
      id: userRow.id,
      email: userRow.email,
      firstName: userRow.first_name,
      lastName: userRow.last_name,
      createdAt: new Date(userRow.created_at),
      updatedAt: new Date(userRow.updated_at),
    }
  }
}
