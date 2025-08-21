import type { Request, Response } from 'express'

import { AuthService } from '../services/auth.service.js'
import type { ApiResponse, AuthResponse, CreateUserRequest, LoginRequest } from '../types/index.js'

export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/auth/register
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const authResult: AuthResponse = await this.authService.register(
        req.body as CreateUserRequest
      )

      console.log('✅ User registered successfully:', authResult.user.email)

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResult,
        message: 'User registered successfully',
      }

      res.status(201).json(response)
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Registration error:', error.message)
        const response: ApiResponse = {
          success: false,
          error: error.message,
        }
        res.status(400).json(response)
        return
      } else {
        console.error('❌ Registration error:', error)
      }

      // Generic server error for unexpected issues
      const response: ApiResponse = {
        success: false,
        error: 'Registration failed. Please try again.',
      }
      res.status(500).json(response)
    }
  }

  // POST /api/auth/login
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🔑 Login request received')

      const authResult: AuthResponse = await this.authService.login(req.body as LoginRequest)

      console.log('✅ User logged in successfully:', authResult.user.email)

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResult,
        message: 'Login successful',
      }

      res.status(200).json(response)
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Login error:', error.message)
        const response: ApiResponse = {
          success: false,
          error: error.message,
        }
        res.status(400).json(response)
        return
      } else {
        console.error('❌ Login error:', error)
      }
      const response: ApiResponse = {
        success: false,
        error: 'Login  failed. Please try again.',
      }
      res.status(500).json(response)
    }
  }

  // GET /api/auth/profile (protected route)
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🔐 Fetching user profile...', req)
      const userId = (req as any).user?.userId
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User not authenticated',
        }
        res.status(401).json(response)
        return
      }

      const user = await this.authService.getUserById(userId)

      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found',
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse = {
        success: true,
        data: { user },
        message: 'Profile retrieved successfully',
      }

      res.status(200).json(response)
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Profile error:', error.message)
      } else {
        console.error('❌ Profile error:', error)
      }
      const response: ApiResponse = {
        success: false,
        error: 'Profile failed. Please try again.',
      }
      res.status(500).json(response)
    }
  }
}
