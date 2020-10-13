import db from './database'

export default {
  logout () {
    db.set('token', '').write()
  }
}
