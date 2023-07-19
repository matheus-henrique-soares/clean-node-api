import { DbLoadAccountByToken } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { type LoadAccountByToken } from '../../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeDbLoadAccount = (): LoadAccountByToken => {
  const secret = env.jwtSecret
  const decrypter = new JwtAdapter(secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypter, accountMongoRepository)
}
