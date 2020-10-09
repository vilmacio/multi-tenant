import { Request, Response } from 'express'
import app from '../app'
import request from 'supertest'

describe('Cors Middleware', () => {
  test('Should accept request from any origin', async () => {
    app.get('/cors', (req:Request, res:Response) => {
      res.send({ data: 'test' })
    })

    await request(app).get('/cors')
      .expect('access-control-allow-origins', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
