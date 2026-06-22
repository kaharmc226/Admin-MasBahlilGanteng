import mysql from 'mysql2/promise'
import { getPoolConfig } from './dbConfig.js'

const pool = mysql.createPool(getPoolConfig())

export default pool
