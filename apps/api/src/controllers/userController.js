import { validationResult } from 'express-validator'

import { User } from '../models/userModel.js'
import { hashPassword } from '../utils/passwordUtils.js'

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, email, password } = req.body

    const existingUserByUsername = await User.findByUsername(username)
    if (existingUserByUsername) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    const existingUserByEmail = await User.findByEmail(email)
    if (existingUserByEmail) {
      return res.status(409).json({ error: 'Email already exists' })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const deleted = await User.delete(id)
    if (deleted) {
      res.json({ message: 'User deleted successfully' })
    } else {
      res.status(500).json({ error: 'Failed to delete user' })
    }
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}
