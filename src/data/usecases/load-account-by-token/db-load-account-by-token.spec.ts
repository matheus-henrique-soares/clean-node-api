import { type Decrypter } from '../../protocols/criptography'
import { type AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { type LoadAccountByTokenRepository } from '../../protocols/db/account'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (data: any): Promise<any> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => {
        resolve({
          name: 'valid_name',
          email: 'valid_email@email.com',
          password: 'hashed_password',
          id: 'valid_id'
        })
      })
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('Should call decrypter with correct values.', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return null if decrypter returns null.', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const response = await sut.load('any_token', 'any_role')
    expect(response).toBe(null)
  })
  test('Should call LoadAccountByTokenRepository with correct values.', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
