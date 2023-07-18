import { type HttpRequest, type Controller } from '../../../presentation/protocols'
import { type RequestHandler, type Request, type Response } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    const htttpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(htttpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
