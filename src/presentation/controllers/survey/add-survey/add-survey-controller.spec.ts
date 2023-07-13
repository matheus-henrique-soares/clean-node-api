import { type Validation, type HttpRequest, type AddSurvey, type AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http/htpp-helper'

describe('AddSurvey Controller', () => {
  interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
  }

  const makeFakeHttpRequest = (): HttpRequest => {
    const httpRequest = {
      body: {
        question: 'any_question',
        answers: [{
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

  const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
      async add (data: AddSurveyModel): Promise<void> {
        await new Promise(resolve => { resolve(data) })
      }
    }
    return new AddSurveyStub()
  }

  const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const addSurveyStub = makeAddSurveyStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
      sut,
      validationStub,
      addSurveyStub
    }
  }

  test('Should call validation with correct valeus', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if validation fails.', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_param'))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_param')))
  })
  test('Should call AddSurvey with correct values.', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
