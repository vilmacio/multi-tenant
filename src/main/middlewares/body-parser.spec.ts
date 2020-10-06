import request from 'supertest'
import app from '../app'

describe('Body Parser Middleware', () => {
  test('Should receive json type on POST methods', async () => {
    app.post('/body-parser', (req, res) => {
      res.send(req.body)
    })

    await request(app).post('/body-parser')
      .send({ data: 'test' })
      .expect({ data: 'test' })
  })
})
