import { type LoadSurveysRepository, type SurveyModel } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import mockdate from 'mockdate'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      }],
      date: new Date(),
      id: 'any_id'
    },
    {
      question: 'other_question',
      answers: [{
        answer: 'other_answer',
        image: 'other_image'
      }],
      date: new Date(),
      id: 'other_id'
    }
  ]
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve(makeFakeSurveys()) })
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })
  afterAll(() => {
    mockdate.reset()
  })

  test('Should call LoadSurveysRepository.', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSurveysRepositorySpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSurveysRepositorySpy).toHaveBeenCalled()
  })
  test('Should return a list of surveys on success.', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })
  test('Should throw if LoadSurveysRepository throws.', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
