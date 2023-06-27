import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { type Controller } from '../../../../presentation/protocols'
import { makeSignupValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignupController = (): Controller => {
  const signupController = new SignupController(makeDbAddAccount(), makeSignupValidation(), makeDbAuthentication())
  const logControllerDecorator = makeLogControllerDecorator(signupController)
  return logControllerDecorator
}
