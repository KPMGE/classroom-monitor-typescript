import express from 'express'
import dotenv from 'dotenv'

import { setupRoutes } from './routes'

dotenv.config()

const app = express()

setupRoutes(app)

export { app }
