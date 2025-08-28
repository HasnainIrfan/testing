class TokenBlacklist {
  constructor() {
    this.blacklist = new Set()
    this.cleanupInterval = 5 * 60 * 1000
    this.startCleanup()
  }

  add(token, expiresAt) {
    this.blacklist.add({
      token,
      expiresAt: expiresAt || Date.now() + 5 * 60 * 1000,
    })
  }

  isBlacklisted(token) {
    for (const item of this.blacklist) {
      if (item.token === token) {
        return true
      }
    }
    return false
  }

  cleanup() {
    const now = Date.now()
    const toRemove = []

    for (const item of this.blacklist) {
      if (item.expiresAt < now) {
        toRemove.push(item)
      }
    }

    toRemove.forEach((item) => this.blacklist.delete(item))
  }

  startCleanup() {
    setInterval(() => this.cleanup(), this.cleanupInterval)
  }

  clear() {
    this.blacklist.clear()
  }
}

export const tokenBlacklist = new TokenBlacklist()
