import { type LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/htpp-helper'
import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stackError: string): Promise<void> {
      await new Promise(resolve => { resolve(null) })
    }
  }
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  return logErrorRepositoryStub
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: {
          email: 'matheus@email.com',
          name: 'matheus',
          password: 'hashed_password',
          id: 'any_id'
        },
        statusCode: 200
      }
      return await new Promise(resolve => { resolve(httpResponse) })
    }
  }
  const controllerStub = new ControllerStub()
  return controllerStub
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log decorator tests', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut } = makeSut()
    const handleSpy = jest.spyOn(sut, 'handle')
    await sut.handle({
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })
    expect(handleSpy).toHaveBeenCalledWith({
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })
  })

  test('Should call controller handle and return the correct values', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })
    expect(httpResponse).toEqual({
      body: {
        email: 'matheus@email.com',
        name: 'matheus',
        password: 'hashed_password',
        id: 'any_id'
      },
      statusCode: 200
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a ServerError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = new Error()
    error.stack = 'any_stack'
    const httpErrorResponse = serverError(error)
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(httpErrorResponse) }))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    await sut.handle({
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
