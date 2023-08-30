import { type AddSurvey, type AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (data): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
