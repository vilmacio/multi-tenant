import env from '../../env'
import { MongoHelper } from '../infra/mongodb/helper'

export async function startServer () {
  await MongoHelper.connect(env.MONGO_URL)
  const app = (await import('./app')).default
  const server = app.listen(env.PORT)
  return server
}
