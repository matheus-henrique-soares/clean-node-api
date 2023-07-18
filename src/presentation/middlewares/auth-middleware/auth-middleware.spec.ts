import { type LoadAccountByToken, type AccountModel, type HttpRequest } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../../helpers/http/htpp-helper'
import { AccessDeniedError } from '../../errors'
import { AuthMiddleware } from './auth-middleware'

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

const makeFakeRequest = (): HttpRequest => {
  return { headers: { 'x-access-token': 'any_token' } }
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

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
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
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
  test('should return 403 if loadAccountByToken returns null.', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should return 200 if loadAccountByToken returns an account.', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })
  test('should return 500 if loadAccountByToken throws.', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
