import { type Express, Router } from 'express'
// import { readdirSync } from 'fs'
// import path from 'path'
import routes from '../routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // readdirSync(path.join(`${__dirname}`, '../', 'routes')).map(async file => {
  //   if (!file.includes('.test.')) {
  //     await import(`../routes/${file}`)
  //       .then((obj) => { obj.default(router) })
  //   }
  // })
  for (const route of routes) {
    route(router)
  }
}
