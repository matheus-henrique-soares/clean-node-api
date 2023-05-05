import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/htpp-helper'
import { LoginController } from './login'
import { type EmailValidator, type Authentication, type HttpRequest } from './login-protocols'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@email.com',
      password: 'any_password'
    }
  }
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return { sut, emailValidatorStub, authenticationStub }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided.', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided.', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should call email validator with correct email.', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  test('Should return 400 if an invalid email is provided.', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should return 500 if EmailValidator throws.', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })
  test('Should call Authentication with correct values.', async () => {
    const { sut, authenticationStub } = makeSut()
    const authenticationSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authenticationSpy).toHaveBeenCalledWith(
      'any_email@email.com',
      'any_password'
    )
  })
  test('Should return 401 if invalid credentials are provided.', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('Should return 500 if Authentication throws.', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce((new Promise((resolve, reject) => { reject(new Error()) })))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })
})
