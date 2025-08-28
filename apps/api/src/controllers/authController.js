import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { jwtConfig } from '../config/jwt.js'
import { User } from '../models/userModel.js'
import { comparePassword } from '../utils/passwordUtils.js'
import { tokenBlacklist } from '../utils/tokenBlacklist.js'

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    jwtConfig.accessTokenSecret,
    { expiresIn: jwtConfig.accessTokenExpiry }
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      type: 'refresh',
    },
    jwtConfig.refreshTokenSecret,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  )
}

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    const user = await User.findByUsername(username)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    const decoded = jwt.decode(accessToken)
    const expiresAt = new Date(decoded.exp * 1000).toISOString()

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      expiresAt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const decoded = jwt.decode(token)
      if (decoded && decoded.exp) {
        tokenBlacklist.add(token, decoded.exp * 1000)
      }
    }

    res.json({ message: 'Logout successful' })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' })
    }

    jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' })
      }

      if (decoded.type !== 'refresh') {
        return res.status(403).json({ error: 'Invalid token type' })
      }

      const user = await User.findById(decoded.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const newAccessToken = generateAccessToken(user)
      const newRefreshToken = generateRefreshToken(user)

      const decodedAccess = jwt.decode(newAccessToken)
      const expiresAt = new Date(decodedAccess.exp * 1000).toISOString()

      res.json({
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt,
      })
    })
  } catch (error) {
    next(error)
  }
}

export const verifyToken = async (req, res, next) => {
  try {
    res.json({
      message: 'Token is valid',
      user: req.user,
      expiresAt: new Date(req.user.exp * 1000).toISOString(),
    })
  } catch (error) {
    next(error)
  }
}
