import express from 'express'
import dotenv from 'dotenv'

import { setupRoutes } from './routes'

dotenv.config()

const app = express()

setupRoutes(app)

app.use((req, res, next, err) => {
  res.json({
    error: err.message
  })
})

export { app }
