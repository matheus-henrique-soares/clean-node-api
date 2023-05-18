import { type AccountModel } from '../../../domain/models/account'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DBAuhtentication usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email.', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
          id: 'any_id'
        }
        return await new Promise(resolve => { resolve(account) })
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({ email: 'any_email@email.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
