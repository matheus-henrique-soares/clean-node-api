import { type AuthenticationModle, type Authentication } from '../../../domain/usecases/authentication'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepositoy: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepositoy = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModle): Promise<string> {
    await this.loadAccountByEmailRepositoy.load(authentication.email)
    return null
  }
}
