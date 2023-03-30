import { ServerError } from '../errors'
import { type AccountModel } from '../../domain/models/account'
import { type HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => {
  return {
    body: error,
    statusCode: 400
  }
}

export const serverError = (): HttpResponse => {
  return {
    body: new ServerError(),
    statusCode: 500
  }
}

export const ok = (account: AccountModel): HttpResponse => {
  return {
    body: account,
    statusCode: 200
  }
}
