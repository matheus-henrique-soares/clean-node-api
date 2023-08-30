import { type AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { type LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { type SurveyModel } from '../../../../domain/models/survey'
import { type AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys: any = await surveyCollection.find().toArray()
    return surveys as SurveyModel[]
  }
}
