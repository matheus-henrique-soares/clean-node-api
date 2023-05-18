import { type AuthenticationModel, type Authentication } from '../../../domain/usecases/authentication'
import { type HashComparer } from '../../protocols/criptography/hash-comparer'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepositoy: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepositoy = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepositoy.load(authentication.email)
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password)
    }
    return null
  }
}
