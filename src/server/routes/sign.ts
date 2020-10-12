import { Router } from 'express'
import { expressAdapter } from '../adapters/express-adapter'
import { middlewareAdapter } from '../adapters/middleware-adapter'
import { loginController } from '../controllers/login'
import { signupController } from '../controllers/signup'
import { authorizationMiddleware } from '../middlewares/authorization'

export default (router: Router) => {
  router.post('/signup', expressAdapter(signupController()))
  router.post('/login', expressAdapter(loginController()))
  router.get('/profile', middlewareAdapter(authorizationMiddleware()), (req, res) => {
    res.json(req.body)
  })
}
