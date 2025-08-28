import jwt from 'jsonwebtoken'

import { jwtConfig } from '../config/jwt.js'
import { tokenBlacklist } from '../utils/tokenBlacklist.js'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  if (tokenBlacklist.isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been revoked' })
  }

  jwt.verify(token, jwtConfig.accessTokenSecret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', expired: true })
      }
      return res.status(403).json({ error: 'Invalid token' })
    }

    req.user = user
    next()
  })
}

export const optionalAuthentication = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    req.user = null
    return next()
  }

  if (tokenBlacklist.isBlacklisted(token)) {
    req.user = null
    return next()
  }

  jwt.verify(token, jwtConfig.accessTokenSecret, (err, user) => {
    if (err) {
      req.user = null
    } else {
      req.user = user
    }
    next()
  })
}
