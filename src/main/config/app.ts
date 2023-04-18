import express from 'express'
import setUpMiddlewares from './middlewares'

const port = 5050
const app = express()
setUpMiddlewares(app)
export { app, port }
