#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import { dbConfig } from '../server/dbConfig.js'
import {
  applySeedBootstrap,
  createAdminConnection,
  databaseState,
  formatDbTarget,
  formatRowCounts,
  initializeSeedProfileDatabase,
} from './db-utils.js'
import {
  defaultSeedProfile,
  getSeedProfileLabel,
  listSeedProfiles,
  resolveSeedProfileName,
} from './seed-data.js'

function formatError(err) {
  return err?.cause?.message || err?.message || err?.code || String(err)
}

function printHelp(defaultProfile, defaultReset) {
  const defaultMode = defaultReset ? 'reset + rebuild' : 'rebuild when DB empty'
  console.log(`
TRAKSI database seeder

Usage:
  npm run seed:db -- --profile=kendari-clean --reset
  npm run seed:db -- --profile=kendari-demo --reset
  npm run seed:demo

Options:
  --profile <name>  Seed profile (${listSeedProfiles().join(', ')})
  --reset           Drop and recreate database before seeding
  --overwrite       Compatibility alias for --reset
  --help, -h        Show this help

Defaults for this command:
  profile: ${defaultProfile}
  mode: ${defaultMode}

Notes:
  - Seeder ini memakai schema.sql sebagai satu-satunya sumber DDL.
  - Untuk database yang sudah berisi data, gunakan --reset agar baseline dibangun ulang secara otoritatif.
`)
}

function parseArgs(argv, defaults) {
  const parsed = {
    helpRequested: false,
    reset: defaults.defaultReset,
    profile: defaults.defaultProfile,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      parsed.helpRequested = true
      continue
    }

    if (arg === '--reset' || arg === '--overwrite') {
      parsed.reset = true
      continue
    }

    if (arg === '--profile') {
      const nextValue = argv[index + 1]
      if (!nextValue) {
        throw new Error('Missing value for --profile.')
      }
      parsed.profile = nextValue
      index += 1
      continue
    }

    if (arg.startsWith('--profile=')) {
      parsed.profile = arg.slice('--profile='.length)
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  parsed.profile = resolveSeedProfileName(parsed.profile)
  return parsed
}

export async function runSeedCli(options = {}) {
  const {
    argv = process.argv.slice(2),
    defaultProfile = defaultSeedProfile,
    defaultReset = false,
  } = options

  const parsed = parseArgs(argv, { defaultProfile, defaultReset })
  if (parsed.helpRequested) {
    printHelp(defaultProfile, defaultReset)
    return
  }

  if (!listSeedProfiles().includes(parsed.profile)) {
    throw new Error(`Unknown seed profile "${parsed.profile}". Available: ${listSeedProfiles().join(', ')}`)
  }

  console.log(`Target MySQL: ${formatDbTarget(dbConfig)}`)
  console.log(`Seed profile: ${getSeedProfileLabel(parsed.profile)} (${parsed.profile})`)

  const connection = await createAdminConnection()
  try {
    const state = await databaseState(connection, dbConfig)

    if (parsed.reset || !state.exists || !state.hasTables) {
      console.log(`Rebuilding "${dbConfig.database}" from schema and canonical seed data...`)
      await initializeSeedProfileDatabase(connection, {
        reset: parsed.reset,
        config: dbConfig,
        profileName: parsed.profile,
      })
    } else if (state.totalRows === 0) {
      console.log(`Database "${dbConfig.database}" already has schema and is empty. Applying seed profile...`)
      await connection.query(`USE \`${dbConfig.database}\``)
      await applySeedBootstrap(connection, { profileName: parsed.profile })
    } else {
      throw new Error(
        `Database "${dbConfig.database}" already contains data (${formatRowCounts(state.rowCounts)}). ` +
          'Run again with --reset for an authoritative rebuild.'
      )
    }

    const finalState = await databaseState(connection, dbConfig)
    console.log(`Seed completed. Row counts: ${formatRowCounts(finalState.rowCounts)}`)
  } finally {
    await connection.end()
  }
}

const currentFilePath = fileURLToPath(import.meta.url)
const invokedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : ''

if (invokedFilePath === currentFilePath) {
  runSeedCli().catch((error) => {
    console.error(`Seeder failed: ${formatError(error)}`)
    process.exit(1)
  })
}
