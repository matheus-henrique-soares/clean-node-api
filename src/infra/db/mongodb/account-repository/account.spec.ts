import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository()
  return sut
}

describe('Account mongo repository.', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success.', async () => {
    const sut = makeSut()
    const account = await sut.add(
      {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    )
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })
})
