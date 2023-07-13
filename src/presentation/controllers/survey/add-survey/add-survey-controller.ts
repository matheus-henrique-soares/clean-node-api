import { badRequest } from '../../../helpers/http/htpp-helper'
import { type HttpRequest, type Controller, type HttpResponse, type Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)
    return await new Promise(resolve => { resolve(null) })
  }
}
