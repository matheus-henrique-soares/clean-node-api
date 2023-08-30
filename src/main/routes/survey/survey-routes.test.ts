import request from 'supertest'
import { app } from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { type Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Login routes.', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })
  describe('POST /surveys.', () => {
    test('Should return 403 on add survey without accessToken.', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'question',
          answers: [
            {
              answer: 'answer 1',
              image: 'http//image-name.com'
            }
          ]
        })
        .expect(403)
    })
    test('Should return 204 on add survey with valid accessToken.', async () => {
      const { insertedId } = await accountCollection.insertOne({
        name: 'matheus',
        email: 'matheus@email.com',
        password: '123',
        role: 'admin'
      })
      const accessToken = sign(insertedId.toString(), env.jwtSecret)
      await accountCollection.updateOne({ _id: insertedId }, { $set: { accessToken } })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'question',
          answers: [
            {
              answer: 'answer 1',
              image: 'http//image-name.com'
            }
          ]
        })
        .expect(403)
    })
  })
  describe('GET /surveys.', () => {
    test('Should return 403 on load surveys without accessToken.', async () => {
      await request(app)
        .get('/api/surveys')
        .send({
          question: 'question',
          answers: [
            {
              answer: 'answer 1',
              image: 'http//image-name.com'
            }
          ]
        })
        .expect(403)
    })
  })
})
