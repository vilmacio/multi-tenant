import { Router } from 'express'
import { expressAdapter } from '../adapters/express-adapter'
import { signupController } from '../controllers/signup'

export default (router: Router) => {
  router.post('/signup', expressAdapter(signupController()))
}
