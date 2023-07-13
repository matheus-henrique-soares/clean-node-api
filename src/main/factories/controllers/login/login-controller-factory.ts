import { LoginController } from '../../../../presentation/controllers/login/login/login-controller'
import { type Controller } from '../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  const logControllerDecorator = makeLogControllerDecorator(loginController)
  return logControllerDecorator
}
