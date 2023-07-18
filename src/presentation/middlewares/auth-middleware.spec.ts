import { forbidden } from '../helpers/http/htpp-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { type LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { type AccountModel } from '../../domain/models/account'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccount = (): AccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password',
    id: 'valid_id'
  }
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  return loadAccountByTokenStub
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware.', () => {
  test('should return 403 if no x-accesss-token exist in headers.', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ headers: {} })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call LoadAccountByToken with correct accesstoken.', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
