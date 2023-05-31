import request from 'supertest'
import { app } from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { type Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login routes.', () => {
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
  describe('POST /signup.', () => {
    test('Should return 200 on signup.', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'matheus',
          email: 'matheus@email.com',
          password: '1234',
          passwordConfirmation: '1234'
        })
        .expect(200)
    })
  })
  describe('POST /login.', () => {
    test('Should return 200 on login.', async () => {
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'matheus',
        email: 'matheus@email.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'matheus@email.com',
          password: '1234'
        })
        .expect(200)
    })
  })
})
