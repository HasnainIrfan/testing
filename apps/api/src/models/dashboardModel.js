import knex from '../config/database.js'

class Dashboard {
  static async create(dashboardData) {
    try {
      // Ensure configuration is a valid JSON string
      if (typeof dashboardData.configuration === 'object') {
        dashboardData.configuration = JSON.stringify(dashboardData.configuration)
      }

      const [dashboard] = await knex('dashboards')
        .insert({
          ...dashboardData,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        })
        .returning('*')

      // Parse configuration back to object
      if (dashboard && dashboard.configuration) {
        dashboard.configuration = JSON.parse(dashboard.configuration)
      }

      return dashboard
    } catch (error) {
      throw error
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = knex('dashboards')
        .select(
          'dashboards.*',
          'connections.name as connection_name',
          'connections.type as connection_type',
          'users.username as created_by_username'
        )
        .leftJoin('connections', 'dashboards.connection_id', 'connections.id')
        .leftJoin('users', 'dashboards.created_by', 'users.id')

      // Apply filters
      if (filters.is_active !== undefined) {
        query = query.where('dashboards.is_active', filters.is_active)
      }

      if (filters.is_public !== undefined) {
        query = query.where('dashboards.is_public', filters.is_public)
      }

      if (filters.created_by) {
        query = query.where('dashboards.created_by', filters.created_by)
      }

      if (filters.connection_id) {
        query = query.where('dashboards.connection_id', filters.connection_id)
      }

      if (filters.search) {
        query = query.where(function () {
          this.where('dashboards.name', 'like', `%${filters.search}%`).orWhere(
            'dashboards.description',
            'like',
            `%${filters.search}%`
          )
        })
      }

      const dashboards = await query.orderBy('dashboards.created_at', 'desc')

      // Parse configuration for each dashboard
      return dashboards.map((dashboard) => {
        if (dashboard.configuration) {
          try {
            dashboard.configuration = JSON.parse(dashboard.configuration)
          } catch (e) {
            dashboard.configuration = {}
          }
        }
        return dashboard
      })
    } catch (error) {
      throw error
    }
  }

  static async findById(id) {
    try {
      const dashboard = await knex('dashboards')
        .select(
          'dashboards.*',
          'connections.name as connection_name',
          'connections.type as connection_type',
          'connections.host as connection_host',
          'connections.database as connection_database',
          'users.username as created_by_username'
        )
        .leftJoin('connections', 'dashboards.connection_id', 'connections.id')
        .leftJoin('users', 'dashboards.created_by', 'users.id')
        .where('dashboards.id', id)
        .first()

      if (dashboard && dashboard.configuration) {
        try {
          dashboard.configuration = JSON.parse(dashboard.configuration)
        } catch (e) {
          dashboard.configuration = {}
        }
      }

      return dashboard
    } catch (error) {
      throw error
    }
  }

  static async update(id, dashboardData) {
    try {
      // Ensure configuration is a valid JSON string
      if (dashboardData.configuration && typeof dashboardData.configuration === 'object') {
        dashboardData.configuration = JSON.stringify(dashboardData.configuration)
      }

      const [dashboard] = await knex('dashboards')
        .where({ id })
        .update({
          ...dashboardData,
          updated_at: knex.fn.now(),
        })
        .returning('*')

      // Parse configuration back to object
      if (dashboard && dashboard.configuration) {
        dashboard.configuration = JSON.parse(dashboard.configuration)
      }

      return dashboard
    } catch (error) {
      throw error
    }
  }

  static async delete(id) {
    try {
      const deleted = await knex('dashboards').where({ id }).delete()

      return deleted > 0
    } catch (error) {
      throw error
    }
  }

  static async softDelete(id) {
    try {
      const [dashboard] = await knex('dashboards')
        .where({ id })
        .update({
          is_active: false,
          updated_at: knex.fn.now(),
        })
        .returning('*')

      return dashboard
    } catch (error) {
      throw error
    }
  }

  static async duplicate(id, newName) {
    try {
      const original = await this.findById(id)
      if (!original) {
        throw new Error('Dashboard not found')
      }

      delete original.id
      delete original.created_at
      delete original.updated_at
      delete original.connection_name
      delete original.connection_type
      delete original.connection_host
      delete original.connection_database
      delete original.created_by_username

      original.name = newName || `${original.name} (Copy)`

      return await this.create(original)
    } catch (error) {
      throw error
    }
  }

  static async getStatistics() {
    try {
      const stats = await knex('dashboards')
        .select(
          knex.raw('COUNT(*) as total'),
          knex.raw('COUNT(CASE WHEN is_active = ? THEN 1 END) as active', [true]),
          knex.raw('COUNT(CASE WHEN is_public = ? THEN 1 END) as public', [true]),
          knex.raw('COUNT(DISTINCT connection_id) as unique_connections'),
          knex.raw('COUNT(DISTINCT created_by) as unique_creators')
        )
        .first()

      return stats
    } catch (error) {
      throw error
    }
  }
}

export default Dashboard
