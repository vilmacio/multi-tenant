import express, { Express, json, Router } from 'express'
import { cors } from './middlewares/cors'
import routes from './routes/sign'

class App {
    public app: Express

    constructor () {
      this.app = express()
      this.middlewares()
      this.routes()
    }

    middlewares () {
      this.app.use(json())
      this.app.use(cors)
    }

    routes () {
      const router = Router()
      this.app.use(router)
      routes(router)
    }
}

export default new App().app
