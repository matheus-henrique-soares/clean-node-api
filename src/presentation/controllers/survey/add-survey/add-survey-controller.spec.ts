import { type Validation, type HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

describe('AddSurvey Controller', () => {
  interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
  }

  const makeFakeHttpRequest = (): HttpRequest => {
    const httpRequest = {
      body: {
        question: 'any_question',
        answer: [{
          image: 'any_image',
          answer: 'any_answer'
        }]
      }
    }
    return httpRequest
  }

  const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    return new ValidationStub()
  }

  const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    return { sut, validationStub }
  }

  test('Should call validation with correct valeus', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
