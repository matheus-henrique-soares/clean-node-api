import { type HttpRequest, type Middleware } from '../../presentation/protocols'
import { type RequestHandler, type Request, type Response, type NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const htttpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(htttpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }
  }
}
