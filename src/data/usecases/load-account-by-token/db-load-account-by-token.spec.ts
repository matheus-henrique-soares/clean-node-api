import { type Decrypter } from '../../protocols/criptography'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeFakeToken = (): string => {
  return 'any_token'
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (data: any): Promise<any> {
      return await new Promise(resolve => { resolve('decrypted_token') })
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('Should call decrypter with correct values.', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const token = makeFakeToken()
    await sut.load(token)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })
})
