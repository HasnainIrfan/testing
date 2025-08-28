import dotenv from 'dotenv'

dotenv.config()

export const jwtConfig = {
  accessTokenSecret:
    process.env.JWT_SECRET ||
    'a0ea1092ea9dd0ff553b04de259b0943d6f41481c5ad6b9e3daa414f441ece1c87b1b02334af4bad73dc842a059fdca06212d4d908ca577a05b1936e77dad818',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-this',
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '24h',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
}
