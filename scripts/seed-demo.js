#!/usr/bin/env node

import { runSeedCli } from './seed-db.js'

runSeedCli({
  argv: process.argv.slice(2),
  defaultProfile: 'kendari-demo',
  defaultReset: true,
}).catch((error) => {
  const message = error?.cause?.message || error?.message || error?.code || String(error)
  console.error(`Demo seed failed: ${message}`)
  process.exit(1)
})
