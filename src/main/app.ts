import express, { Express } from 'express'

class App {
    public app: Express

    constructor () {
      this.app = express()
    }

    middlewares () {

    }

    routes () {

    }
}

export default new App().app
