import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository()
  return sut
}

let accountCollection: Collection

describe('Account mongo repository.', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success.', async () => {
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
  test('Should return an account on loadByEmail success.', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })
  test('Should return null if loadByEmail fails.', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeFalsy()
  })
  test('Should return an account on loadByEmail success.', async () => {
    const sut = makeSut()
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    let account = await accountCollection.findOne({ _id: insertedId })
    expect(account.accessToken).toBeFalsy()
    await sut.updateAccessToken(insertedId.toString(), 'any_token')
    account = await accountCollection.findOne({ _id: insertedId })
    expect(account.accessToken).toBe('any_token')
  })
})
