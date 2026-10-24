import db from '../config/db.js'

export async function findUserByAccount(account){
  // 去 users 表中查找有无 account 这个账号
  const [ rows ] = await db.execute('SELECT * FROM users WHERE account = ? LIMIT 1', [account])
  // console.log(rows0)
  return rows[0]
}

export async function createUser({nickName, account, bcryptPassword, create_time = Date.now()}) {
  // 去 users 表中插入用户信息
  const [rows] = await db.execute('INSERT INTO users (nickName, account, password, create_time) VALUES (?, ?, ?, ?)', [nickName, account, bcryptPassword, String(create_time)])
  if (rows.affectedRows) {
    return {
      id: rows.insertId,
      account
    }
  }
  
}