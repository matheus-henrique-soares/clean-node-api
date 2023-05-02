import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeSut = (): LogControllerDecorator => {
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
  const sut = new LogControllerDecorator(new ControllerStub())
  return sut
}

describe('Log decorator tests', () => {
  test('Should call controller handle with correct values', async () => {
    const sut = makeSut()
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
    const sut = makeSut()
    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      email: 'matheus@email.com',
      name: 'matheus',
      password: 'hashed_password',
      id: 'any_id'
    })
  })
})
