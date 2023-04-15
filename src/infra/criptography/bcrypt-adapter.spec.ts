import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => {
  return {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => { resolve('any_hash') })
    }
  }
})

interface SutTypes {
  salt: number
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Bcrypt adapter.', () => {
  test('Should call bcrypt with correct values.', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return a hash on success.', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('any_hash')
  })
  test('Should throw if bcrypt throws.', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
