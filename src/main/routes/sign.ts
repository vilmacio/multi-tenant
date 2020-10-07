import { Router } from 'express'
import { expressAdapter } from '../adapters/express-adapter'
import { loginController } from '../controllers/login'
import { signupController } from '../controllers/signup'

export default (router: Router) => {
  router.post('/signup', expressAdapter(signupController()))
  router.post('/login', expressAdapter(loginController()))
}
