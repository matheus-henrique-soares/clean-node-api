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
    ],
    date: new Date()
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

  describe('add()', () => {
    test('should return an survey on add success.', async () => {
      const sut = makeSut()
      const surveyData = makeFakeSurveyData()
      await sut.add(surveyData)
      const survey = await surveyCollection.findOne(surveyData)
      expect(survey).toEqual(surveyData)
    })
  })
  describe('load()', () => {
    test('should return a list of surverys on success.', async () => {
      const surveyData = makeFakeSurveyData()
      await surveyCollection.insertMany([{ surveyData }, { surveyData }])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
    })
    test('should return am empty array if there is no surveys.', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
