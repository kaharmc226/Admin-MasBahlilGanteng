export const dbConfig = Object.freeze({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'traksi_db',
})

export function getAdminConnectionConfig() {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  }
}

export function getPoolConfig() {
  return {
    ...getAdminConnectionConfig(),
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}
