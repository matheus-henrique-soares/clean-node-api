import express from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'

const port = 5050
const app = express()
setUpMiddlewares(app)
setUpRoutes(app)
export { app, port }
