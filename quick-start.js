#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbJsPath = path.join(__dirname, 'server', 'db.js');

// Visual Header
console.log('\x1b[1;32m');
console.log('==================================================');
console.log('  🚀  TRAKSI - Transparansi Gizi Nasional  🚀     ');
console.log('  Automated Startup & Environment Check           ');
console.log('==================================================');
console.log('\x1b[0m');

// 1. Parse DB Configuration from server/db.js
let dbContent = '';
try {
  dbContent = fs.readFileSync(dbJsPath, 'utf8');
} catch (err) {
  console.error('\x1b[31m❌ Error reading server/db.js:\x1b[0m', err.message);
  process.exit(1);
}

const hostMatch = dbContent.match(/host:\s*['"`](.*?)['"`]/);
const portMatch = dbContent.match(/port:\s*(\d+)/);
const userMatch = dbContent.match(/user:\s*['"`](.*?)['"`]/);
const passwordMatch = dbContent.match(/password:\s*['"`](.*?)['"`]/);
const databaseMatch = dbContent.match(/database:\s*['"`](.*?)['"`]/);

const dbConfig = {
  host: hostMatch ? hostMatch[1] : 'localhost',
  port: portMatch ? parseInt(portMatch[1]) : 3306,
  user: userMatch ? userMatch[1] : 'root',
  password: passwordMatch ? passwordMatch[1] : '',
  database: databaseMatch ? databaseMatch[1] : 'traksi_db',
};

const forceReset = process.argv.includes('--reset') || process.argv.includes('--force');

async function checkAndInitDatabase() {
  console.log(`🔍 Connecting to MySQL server at \x1b[36m${dbConfig.host}:${dbConfig.port}\x1b[0m (user: ${dbConfig.user})...`);
  
  const connectionConfig = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
  } catch (err) {
    console.error('\n\x1b[31m❌ Could not connect to the MySQL database server.\x1b[0m');
    console.error(`   Error details: ${err.message}`);
    console.error('\n\x1b[33m💡 Help: Make sure your local MySQL/MariaDB server (Laragon, XAMPP, or native service) is running.\x1b[0m');
    console.error(`   Also verify credentials in: \x1b[34mserver/db.js\x1b[0m\n`);
    process.exit(1);
  }

  try {
    let dbExists = false;
    let tablesExist = false;

    // Check if database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbConfig.database]);
    if (databases.length > 0) {
      dbExists = true;
      await connection.query(`USE \`${dbConfig.database}\``);
      const [tables] = await connection.query('SHOW TABLES');
      if (tables.length > 0) {
        tablesExist = true;
      }
    }

    if (forceReset) {
      console.log(`\n🔄 \x1b[33mForce reset requested. Re-initializing database "${dbConfig.database}"...\x1b[0m`);
      await runSqlImports(connection);
    } else if (!dbExists || !tablesExist) {
      console.log(`\n📦 \x1b[33mDatabase "${dbConfig.database}" is missing or empty. Initializing...\x1b[0m`);
      await runSqlImports(connection);
    } else {
      console.log(`💾 Database "${dbConfig.database}" is active and populated. \x1b[32m[OK]\x1b[0m`);
    }
  } catch (err) {
    console.error('\x1b[31m❌ Error during database check or initialization:\x1b[0m', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function runSqlImports(connection) {
  // 1. Import base schema
  const traksiDbSqlPath = path.join(__dirname, 'database', 'traksi_db.sql');
  if (fs.existsSync(traksiDbSqlPath)) {
    console.log(`   📄 Importing schema from \x1b[34mdatabase/traksi_db.sql\x1b[0m...`);
    const sqlContent = fs.readFileSync(traksiDbSqlPath, 'utf8');
    await connection.query(sqlContent);
    console.log(`   ✅ Base schema imported.`);
  } else {
    throw new Error('Base SQL schema file (database/traksi_db.sql) not found.');
  }

  // 2. Import dummy data extension
  const dummyDataSqlPath = path.join(__dirname, 'database', 'dummy_data_extension.sql');
  if (fs.existsSync(dummyDataSqlPath)) {
    console.log(`   📄 Importing dummy data extension from \x1b[34mdatabase/dummy_data_extension.sql\x1b[0m...`);
    const sqlContent = fs.readFileSync(dummyDataSqlPath, 'utf8');
    await connection.query(sqlContent);
    console.log(`   ✅ Additional dummy data imported.`);
  } else {
    console.log(`   ⚠️ database/dummy_data_extension.sql not found, skipping extension data.`);
  }
}

function startServices() {
  console.log('\n\x1b[32m⚡ Starting Frontend & Backend servers concurrently...\x1b[0m\n');

  // Spawn backend process
  const backend = spawn('npm', ['run', 'server'], { shell: true, stdio: 'pipe' });
  // Spawn frontend process
  const frontend = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'pipe' });

  // Stream output with color-coded prefixes
  streamLogs(backend, 'Backend', '\x1b[36m'); // Cyan
  streamLogs(frontend, 'Frontend', '\x1b[35m'); // Magenta

  // Graceful shutdown handler
  const shutdown = () => {
    console.log('\n\x1b[33m🛑 Stopping all services...\x1b[0m');
    backend.kill();
    frontend.kill();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  backend.on('close', (code) => {
    console.log(`\x1b[31m❌ Backend process exited with code ${code}\x1b[0m`);
    frontend.kill();
    process.exit(code);
  });

  frontend.on('close', (code) => {
    console.log(`\x1b[31m❌ Frontend process exited with code ${code}\x1b[0m`);
    backend.kill();
    process.exit(code);
  });
}

function streamLogs(childProcess, prefix, colorCode) {
  let stdoutBuffer = '';
  childProcess.stdout.on('data', (data) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split('\n');
    stdoutBuffer = lines.pop(); // Keep the last partial line
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${colorCode}[${prefix}]\x1b[0m | ${line.replace(/\r/g, '')}`);
      }
    }
  });

  let stderrBuffer = '';
  childProcess.stderr.on('data', (data) => {
    stderrBuffer += data.toString();
    const lines = stderrBuffer.split('\n');
    stderrBuffer = lines.pop(); // Keep the last partial line
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${colorCode}[${prefix} - ERROR]\x1b[0m | ${line.replace(/\r/g, '')}`);
      }
    }
  });
}

// Run the script
(async () => {
  await checkAndInitDatabase();
  startServices();
})();
