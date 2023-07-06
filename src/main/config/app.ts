import express from 'express'
import setUpMiddlewares from './middlewares'
import setupSwager from './config-swagger'
import setUpRoutes from './routes'

const app = express()
setupSwager(app)
setUpMiddlewares(app)
setUpRoutes(app)
export default app
