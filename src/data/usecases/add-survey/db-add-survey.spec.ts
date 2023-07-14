import { DbAddSurvey } from './db-add-survey'
import { type AddSurveyRepository, type AddSurveyModel } from './db-add-survey-protocols'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeFakeSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }]
  }
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {
      await new Promise(resolve => { resolve(data) })
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey usecase', () => {
  test('should call AddSurveyRepository with correct values.', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurvey()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
