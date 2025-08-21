import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import config from '../config/jwt.js'

const JWT_SECRET = config.jwt.secret || 'your_jwt_secret'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('🔐 Authenticating token...', req.headers)
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log('🔑 Token received:', token, JWT_SECRET)

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' })
  }
  jwt.verify(
    token,
    config.jwt.secret,
    { algorithms: [config.jwt.algorithm as jwt.Algorithm] },
    (err, decoded) => {
      if (err) {
        console.error('JWT verify error:', err)
        return res.status(403).json({ message: 'Invalid or expired token' })
      }
      console.log('✅ Token verified successfully:', decoded)
      req.user = decoded
      next()
    }
  )

  // jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
  //     if (err) {
  //         console.error('❌ Token verification failed:', err.message);
  //         return res.status(403).json({ message: 'Invalid token' });
  //     }
  //     req.user = user;
  //     next();
  // });
}
