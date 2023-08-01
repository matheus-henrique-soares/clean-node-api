import { type LoadSurveys, type SurveyModel } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import mockdate from 'mockdate'

interface SutTypes {
  loadSurveysStub: LoadSurveys
  sut: LoadSurveysController
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

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => { resolve(makeFakeSurveys()) })
    }
  }
  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut, loadSurveysStub
  }
}

describe('LoadSurveys Controller.', () => {
  beforeAll(() => {
    mockdate.set(new Date())
  })
  afterAll(() => {
    mockdate.reset()
  })

  test('Should call loadSurveys.', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveysSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSurveysSpy).toHaveBeenCalled()
  })
})
