import request from 'supertest'
import { app } from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { type Collection } from 'mongodb'

let surveyCollection: Collection

describe('Login routes.', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  describe('POST /surveys.', () => {
    test('Should return 204 on add survey success.', async () => {
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
        .expect(204)
    })
  })
})
