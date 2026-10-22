import db from '../config/db.js'

export async function findUserByAccount(account){
  // 去 users 表中查找有无 account 这个账号
  const [ rows ] = await db.execute('SELECT * FROM users WHERE account = ? LIMIT 1', [account])
  // console.log(rows0)
  return rows[0]
}