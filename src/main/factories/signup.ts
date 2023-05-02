import { SignupController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../presentation/utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { type Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignupController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const signupController = new SignupController(emailValidatorAdapter, dbbAddAccount)
  return new LogControllerDecorator(signupController)
}
