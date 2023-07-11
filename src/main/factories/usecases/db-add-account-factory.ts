import { DbAddAccount } from '../../../data'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
  return dbbAddAccount
}
