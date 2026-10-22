import mysql from 'mysql2/promise'

// 创建连接池，设置连接池的参数
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'kid_edu',
  password: '123456',
  port: 3306
})

export default pool