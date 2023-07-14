import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { type AddSurveyModel } from '../../../../domain/usecases/add-survey'

const makeFakeSurveyData = (): AddSurveyModel => {
  return {
    question: 'any_valid_question',
    answers: [
      {
        answer: 'any_valid_answer',
        image: 'any_valid_image'
      },
      {
        answer: 'any_other_answer'
      }
    ]
  }
}

const makeSut = (): SurveyMongoRepository => {
  const sut = new SurveyMongoRepository()
  return sut
}

let surveyCollection: Collection

describe('SurveyMongoRepository', () => {
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
  test('should return an survey on add success.', async () => {
    const sut = makeSut()
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    const survey = await surveyCollection.findOne(surveyData)
    expect(survey).toEqual(surveyData)
  })
})
