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
let spawnedMysqlProcess = null;

// Helpers to locate MySQL binaries in standard Windows locations
function findLaragonMysql() {
  const baseDir = 'C:\\laragon\\bin\\mysql';
  if (!fs.existsSync(baseDir)) return null;
  
  try {
    const files = fs.readdirSync(baseDir);
    for (const file of files) {
      const fullPath = path.join(baseDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const mysqldPath = path.join(fullPath, 'bin', 'mysqld.exe');
        const myIniPath = path.join(fullPath, 'my.ini');
        if (fs.existsSync(mysqldPath) && fs.existsSync(myIniPath)) {
          return { mysqldPath, myIniPath };
        }
      }
    }
  } catch (e) {}
  return null;
}

function findXamppMysql() {
  const mysqldPath = 'C:\\xampp\\mysql\\bin\\mysqld.exe';
  const myIniPath = 'C:\\xampp\\mysql\\bin\\my.ini';
  if (fs.existsSync(mysqldPath) && fs.existsSync(myIniPath)) {
    return { mysqldPath, myIniPath };
  }
  return null;
}

async function verifyAndConnectDb(config) {
  return await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    multipleStatements: true,
  });
}

async function ensureMysqlRunning() {
  console.log(`🔍 Checking MySQL connection at \x1b[36m${dbConfig.host}:${dbConfig.port}\x1b[0m (user: ${dbConfig.user})...`);
  
  // Try connecting first
  try {
    const connection = await verifyAndConnectDb(dbConfig);
    console.log(`💾 MySQL server is already running. \x1b[32m[OK]\x1b[0m`);
    return connection;
  } catch (err) {
    // Connection failed, let's try starting it automatically
  }

  // Locate local MySQL installation (Laragon or XAMPP)
  const mysqlInfo = findLaragonMysql() || findXamppMysql();
  if (!mysqlInfo) {
    console.error('\n\x1b[31m❌ MySQL is offline and we could not find a local Laragon or XAMPP MySQL installation to start.\x1b[0m');
    console.error(`   Error details: Connection refused at ${dbConfig.host}:${dbConfig.port}`);
    console.error('\n\x1b[33m💡 Help: Please start your database server manually and run again.\x1b[0m\n');
    process.exit(1);
  }

  console.log(`\n\x1b[33m⚠️ MySQL is not running. Attempting to start local MySQL server automatically...\x1b[0m`);
  console.log(`   Binary: \x1b[34m${mysqlInfo.mysqldPath}\x1b[0m`);
  console.log(`   Config: \x1b[34m${mysqlInfo.myIniPath}\x1b[0m\n`);

  try {
    // Spawn MySQL process directly (no shell, so it's a child we can kill directly)
    spawnedMysqlProcess = spawn(mysqlInfo.mysqldPath, [`--defaults-file=${mysqlInfo.myIniPath}`], {
      shell: false,
      stdio: 'ignore'
    });
  } catch (spawnErr) {
    console.error('\x1b[31m❌ Failed to spawn MySQL process:\x1b[0m', spawnErr.message);
    process.exit(1);
  }

  // Poll connection until MySQL finishes starting up
  const maxRetries = 12;
  const retryIntervalMs = 1500;
  for (let i = 1; i <= maxRetries; i++) {
    process.stdout.write(`⏳ Waiting for MySQL to start... (Attempt ${i}/${maxRetries})\r`);
    
    // Check if the process exited prematurely
    if (spawnedMysqlProcess.exitCode !== null) {
      console.error(`\n\x1b[31m❌ MySQL server failed to start. Process exited with code ${spawnedMysqlProcess.exitCode}.\x1b[0m`);
      process.exit(1);
    }

    try {
      const connection = await verifyAndConnectDb(dbConfig);
      console.log(`\n\x1b[32m✅ MySQL server started successfully and connection established!\x1b[0m`);
      return connection;
    } catch (err) {
      // Ignore connection error and wait for next retry
    }
    await new Promise(resolve => setTimeout(resolve, retryIntervalMs));
  }

  console.error(`\n\x1b[31m❌ MySQL server started but connection timed out after ${maxRetries * retryIntervalMs / 1000} seconds.\x1b[0m`);
  if (spawnedMysqlProcess) spawnedMysqlProcess.kill();
  process.exit(1);
}

async function checkAndInitDatabase(connection) {
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
    if (spawnedMysqlProcess) spawnedMysqlProcess.kill();
    process.exit(1);
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
    if (spawnedMysqlProcess) {
      console.log('🛑 Stopping automatically started MySQL server...');
      spawnedMysqlProcess.kill();
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  backend.on('close', (code) => {
    console.log(`\x1b[31m❌ Backend process exited with code ${code}\x1b[0m`);
    frontend.kill();
    if (spawnedMysqlProcess) spawnedMysqlProcess.kill();
    process.exit(code);
  });

  frontend.on('close', (code) => {
    console.log(`\x1b[31m❌ Frontend process exited with code ${code}\x1b[0m`);
    backend.kill();
    if (spawnedMysqlProcess) spawnedMysqlProcess.kill();
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
  const connection = await ensureMysqlRunning();
  await checkAndInitDatabase(connection);
  if (connection) await connection.end();
  startServices();
})();
