import { type Router } from 'express'
import { makeSignupController } from '../../factories/controllers//login/signup/signup-controller-factory'
import { adaptRoute } from '../../adapters/express-routes-adapter'
import { makeLoginController } from '../../factories/controllers/login/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
