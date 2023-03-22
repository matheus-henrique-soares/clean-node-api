import { SignupController } from './signup'

describe('SIgnup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // system under test
    const sut = new SignupController()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_email@email.com',
        passwordConfirmation: 'any_email@email.com'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name.'))
  })
  test('Should return 400 if no email is provided', () => {
    // system under test
    const sut = new SignupController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_email@email.com',
        passwordConfirmation: 'any_email@email.com'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email.'))
  })
})
