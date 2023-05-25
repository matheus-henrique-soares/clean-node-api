import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => {
  return {
    sign (): string {
      return 'any_token'
    }
  }
})

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT adapter.', () => {
  test('should call sign with correct values.', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
  test('should return a token on sign success.', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
