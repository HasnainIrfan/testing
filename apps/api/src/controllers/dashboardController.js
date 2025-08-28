import { validationResult } from 'express-validator'

import Dashboard from '../models/dashboardModel.js'

export const createDashboard = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const dashboardData = {
      ...req.body,
      created_by: req.user.id, // Add the current user as creator
    }

    const dashboard = await Dashboard.create(dashboardData)

    res.status(201).json({
      message: 'Dashboard created successfully',
      dashboard,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllDashboards = async (req, res, next) => {
  try {
    const filters = {
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
      is_public: req.query.is_public !== undefined ? req.query.is_public === 'true' : undefined,
      created_by: req.query.created_by,
      connection_id: req.query.connection_id,
      search: req.query.search,
    }

    // Remove undefined values
    Object.keys(filters).forEach((key) => filters[key] === undefined && delete filters[key])

    const dashboards = await Dashboard.findAll(filters)

    res.json({
      count: dashboards.length,
      dashboards,
    })
  } catch (error) {
    next(error)
  }
}

export const getDashboardById = async (req, res, next) => {
  try {
    const { id } = req.params

    const dashboard = await Dashboard.findById(id)

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' })
    }

    // Check if user has access to private dashboard
    if (!dashboard.is_public && dashboard.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this dashboard' })
    }

    res.json(dashboard)
  } catch (error) {
    next(error)
  }
}

export const updateDashboard = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params

    // Check if dashboard exists and user has permission
    const existingDashboard = await Dashboard.findById(id)
    if (!existingDashboard) {
      return res.status(404).json({ error: 'Dashboard not found' })
    }

    // Only creator can update dashboard (unless it's public and user is updating only configuration)
    if (existingDashboard.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can update this dashboard' })
    }

    const updatedDashboard = await Dashboard.update(id, req.body)

    res.json({
      message: 'Dashboard updated successfully',
      dashboard: updatedDashboard,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteDashboard = async (req, res, next) => {
  try {
    const { id } = req.params
    const { soft = true } = req.query // Default to soft delete

    // Check if dashboard exists and user has permission
    const dashboard = await Dashboard.findById(id)
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' })
    }

    // Only creator can delete dashboard
    if (dashboard.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can delete this dashboard' })
    }

    if (soft === 'false') {
      // Hard delete
      const deleted = await Dashboard.delete(id)
      if (deleted) {
        res.json({ message: 'Dashboard permanently deleted successfully' })
      } else {
        res.status(500).json({ error: 'Failed to delete dashboard' })
      }
    } else {
      // Soft delete (deactivate)
      await Dashboard.softDelete(id)
      res.json({ message: 'Dashboard deactivated successfully' })
    }
  } catch (error) {
    next(error)
  }
}

export const duplicateDashboard = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body

    // Check if dashboard exists
    const original = await Dashboard.findById(id)
    if (!original) {
      return res.status(404).json({ error: 'Dashboard not found' })
    }

    // Check if user has access to the dashboard
    if (!original.is_public && original.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this dashboard' })
    }

    const duplicatedDashboard = await Dashboard.duplicate(id, name)

    // Update the creator to current user
    const updatedDashboard = await Dashboard.update(duplicatedDashboard.id, {
      created_by: req.user.id,
    })

    res.status(201).json({
      message: 'Dashboard duplicated successfully',
      dashboard: updatedDashboard,
    })
  } catch (error) {
    next(error)
  }
}

export const getDashboardStatistics = async (req, res, next) => {
  try {
    const stats = await Dashboard.getStatistics()

    res.json({
      statistics: stats,
    })
  } catch (error) {
    next(error)
  }
}

export const saveDashboardConfiguration = async (req, res, next) => {
  try {
    const { id } = req.params
    const { configuration } = req.body

    if (!configuration || typeof configuration !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration format' })
    }

    // Check if dashboard exists and user has permission
    const dashboard = await Dashboard.findById(id)
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' })
    }

    // Allow saving configuration if user is creator or dashboard is public
    if (!dashboard.is_public && dashboard.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to update this dashboard' })
    }

    const updatedDashboard = await Dashboard.update(id, { configuration })

    res.json({
      message: 'Dashboard configuration saved successfully',
      dashboard: updatedDashboard,
    })
  } catch (error) {
    next(error)
  }
}
