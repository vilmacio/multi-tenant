import express, { Express, json } from 'express'
import { cors } from './middlewares/cors'

class App {
    public app: Express

    constructor () {
      this.app = express()
      this.middlewares()
    }

    middlewares () {
      this.app.use(json())
      this.app.use(cors)
    }

    routes () {

    }
}

export default new App().app
