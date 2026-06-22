import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import { dbConfig, getAdminConnectionConfig } from '../server/dbConfig.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

export const dbAssetPaths = Object.freeze({
  schema: path.join(rootDir, 'database', 'schema.sql'),
  bootstrap: path.join(rootDir, 'database', 'bootstrap_minimal.sql'),
  demoSeed: path.join(rootDir, 'database', 'demo_seed.sql'),
})

const trackedTables = [
  'users',
  'sekolah',
  'vendors',
  'dapur',
  'menus',
  'produksi',
  'distribusi',
  'feedback',
  'alerts',
  'dokumen_vendor',
]

export function formatDbTarget(config = dbConfig) {
  return `${config.host}:${config.port} (user: ${config.user}, db: ${config.database})`
}

export async function createAdminConnection() {
  return mysql.createConnection(getAdminConnectionConfig())
}

export async function databaseState(connection, config = dbConfig) {
  const [databases] = await connection.query('SHOW DATABASES LIKE ?', [config.database])
  if (databases.length === 0) {
    return { exists: false, hasTables: false, rowCounts: {}, totalRows: 0 }
  }

  await connection.query(`USE \`${config.database}\``)
  const [tables] = await connection.query('SHOW TABLES')
  if (tables.length === 0) {
    return { exists: true, hasTables: false, rowCounts: {}, totalRows: 0 }
  }

  const rowCounts = {}
  let totalRows = 0
  for (const table of trackedTables) {
    try {
      const [[row]] = await connection.query(`SELECT COUNT(*) AS total FROM \`${table}\``)
      rowCounts[table] = row.total
      totalRows += row.total
    } catch {
      rowCounts[table] = 0
    }
  }

  return { exists: true, hasTables: true, rowCounts, totalRows }
}

export async function importSqlFile(connection, filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`SQL file not found: ${path.relative(rootDir, filePath)}`)
  }
  const sql = fs.readFileSync(filePath, 'utf8')
  await connection.query(sql)
}

export async function resetDatabase(connection, config = dbConfig) {
  await connection.query(`DROP DATABASE IF EXISTS \`${config.database}\``)
}

export async function initializeMinimalDatabase(connection, options = {}) {
  const { reset = false, config = dbConfig } = options
  if (reset) {
    await resetDatabase(connection, config)
  }

  await importSqlFile(connection, dbAssetPaths.schema)
  await applyMinimalBootstrap(connection)
}

export async function applyMinimalBootstrap(connection) {
  await importSqlFile(connection, dbAssetPaths.bootstrap)
}

export async function initializeDemoDatabase(connection, options = {}) {
  const { reset = false, config = dbConfig } = options
  await initializeMinimalDatabase(connection, { reset, config })
  await importSqlFile(connection, dbAssetPaths.demoSeed)
}

export function formatRowCounts(rowCounts) {
  return Object.entries(rowCounts)
    .map(([table, total]) => `${table}: ${total}`)
    .join(', ')
}
