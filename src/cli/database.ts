import path from 'path'
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import Memory from 'lowdb/adapters/Memory'
import mkdirp from 'mkdirp'

function initDbSync<T> (filePath: string): lowdb.LowdbSync<T> {
  let adapter: lowdb.AdapterSync
  if (filePath) {
    const parentDir = path.dirname(filePath)
    mkdirp.sync(parentDir)
    adapter = new FileSync<T>(filePath)
  } else {
    adapter = new Memory<T>('')
  }
  return lowdb(adapter)
}

const db = initDbSync('cache/access.json')
export default db
