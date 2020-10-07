import env from '../../env'
import { MongoHelper } from '../infra/mongodb/helper'

async function startServer () {
  await MongoHelper.connect(env.MONGO_URL)
  const app = (await import('./app')).default
  app.listen(env.PORT, () => console.log(`server online em http://localhost:${env.PORT}`))
}

startServer()
