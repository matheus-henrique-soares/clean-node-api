import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { type Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const dbAuthentication = makeDbAuthentication()
  const loginController = new LoginController(dbAuthentication, validation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
