import express, { Express, json } from 'express'

class App {
    public app: Express

    constructor () {
      this.app = express()
      this.middlewares()
    }

    middlewares () {
      this.app.use(json())
    }

    routes () {

    }
}

export default new App().app
