import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { type Controller } from '../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const dbAuthentication = makeDbAuthentication()
  const loginController = new LoginController(dbAuthentication, validation)
  return makeLogControllerDecorator(loginController)
}
