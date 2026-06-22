#!/usr/bin/env node

import { spawn } from 'child_process'
import { dbConfig } from './server/dbConfig.js'
import {
  applyMinimalBootstrap,
  createAdminConnection,
  databaseState,
  formatDbTarget,
  initializeMinimalDatabase,
} from './scripts/db-utils.js'

const forceReset = process.argv.includes('--reset') || process.argv.includes('--force')

function formatError(err) {
  return err?.cause?.message || err?.message || err?.code || String(err)
}

console.log('\x1b[1;32m')
console.log('==================================================')
console.log('  TRAKSI - Transparansi Gizi Nasional')
console.log('  Startup & Database Check')
console.log('==================================================')
console.log('\x1b[0m')

async function connectOrExit() {
  console.log(`Checking MySQL connection at \x1b[36m${formatDbTarget()}\x1b[0m...`)
  try {
    const connection = await createAdminConnection()
    console.log('\x1b[32mMySQL server is reachable.\x1b[0m')
    return connection
  } catch (err) {
    console.error('\n\x1b[31mMySQL server is not reachable.\x1b[0m')
    console.error(`Checked: ${formatDbTarget()}`)
    console.error('Start a local MySQL or MariaDB service, then run `npm start` again.')
    console.error(`Connection error: ${formatError(err)}\n`)
    process.exit(1)
  }
}

async function ensureDatabaseReady(connection) {
  const state = await databaseState(connection, dbConfig)

  if (forceReset) {
    console.log(`\nReset requested. Rebuilding "${dbConfig.database}" with minimal baseline data...`)
    await initializeMinimalDatabase(connection, { reset: true, config: dbConfig })
    printBootstrapNotice('Database reset completed.')
    return
  }

  if (!state.exists || !state.hasTables) {
    console.log(`\nDatabase "${dbConfig.database}" is missing or empty. Initializing schema and minimal baseline...`)
    await initializeMinimalDatabase(connection, { config: dbConfig })
    printBootstrapNotice('Database initialized successfully.')
    return
  }

  if (state.totalRows === 0) {
    console.log(`\nDatabase "${dbConfig.database}" has schema but no baseline data. Applying minimal bootstrap...`)
    await connection.query(`USE \`${dbConfig.database}\``)
    await applyMinimalBootstrap(connection)
    printBootstrapNotice('Baseline data applied successfully.')
    return
  }

  console.log(`Database "${dbConfig.database}" already exists and will be reused.`)
  console.log('Optional demo data: `npm run seed:demo -- --merge`')
}

function printBootstrapNotice(prefix) {
  console.log(`\x1b[32m${prefix}\x1b[0m`)
  console.log('App is operational with baseline accounts.')
  console.log('Optional demo data: `npm run seed:demo -- --merge`')
}

function startServices() {
  console.log('\n\x1b[32mStarting frontend and backend...\x1b[0m\n')

  const backend = spawn('npm', ['run', 'server'], { shell: true, stdio: 'pipe' })
  const frontend = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'pipe' })

  streamLogs(backend, 'Backend', '\x1b[36m')
  streamLogs(frontend, 'Frontend', '\x1b[35m')

  const shutdown = () => {
    console.log('\n\x1b[33mStopping services...\x1b[0m')
    backend.kill()
    frontend.kill()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  backend.on('close', (code) => {
    console.log(`\x1b[31mBackend process exited with code ${code}\x1b[0m`)
    frontend.kill()
    process.exit(code)
  })

  frontend.on('close', (code) => {
    console.log(`\x1b[31mFrontend process exited with code ${code}\x1b[0m`)
    backend.kill()
    process.exit(code)
  })
}

function streamLogs(childProcess, prefix, colorCode) {
  let stdoutBuffer = ''
  childProcess.stdout.on('data', (data) => {
    stdoutBuffer += data.toString()
    const lines = stdoutBuffer.split('\n')
    stdoutBuffer = lines.pop()
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${colorCode}[${prefix}]\x1b[0m | ${line.replace(/\r/g, '')}`)
      }
    }
  })

  let stderrBuffer = ''
  childProcess.stderr.on('data', (data) => {
    stderrBuffer += data.toString()
    const lines = stderrBuffer.split('\n')
    stderrBuffer = lines.pop()
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${colorCode}[${prefix} - ERROR]\x1b[0m | ${line.replace(/\r/g, '')}`)
      }
    }
  })
}

;(async () => {
  const connection = await connectOrExit()
  try {
    await ensureDatabaseReady(connection)
  } finally {
    await connection.end()
  }
  startServices()
})()
