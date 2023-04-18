import { type Request, type Response, type NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-conntrol-allow-origin', '*')
  res.set('access-conntrol-allow-methods', '*')
  res.set('access-conntrol-allow-headers', '*')
  next()
}
