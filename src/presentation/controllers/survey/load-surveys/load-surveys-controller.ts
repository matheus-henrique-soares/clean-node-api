import { type LoadSurveys, type Controller, type HttpRequest, type HttpResponse } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '../../../helpers/http/htpp-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length === 0) return noContent()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
