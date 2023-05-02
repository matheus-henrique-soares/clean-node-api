import { type HttpRequest, type Controller } from '../../presentation/protocols'
import { type RequestHandler, type Request, type Response } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    const htttpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(htttpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
