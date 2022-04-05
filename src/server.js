import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'

try {
  await connectDB()

  const app = express()

  app.use(helmet())

  app.use(logger('dev'))

  app.use(express.json())

  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['http://localhost:3000'])
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.append('Access-Control-Allow-Headers', 'Content-Type')
    res.append('Access-Control-Allow-Credentials', 'true')
    next()
  })

  app.use('/', router)

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (err.status === 401) {
      err.message = 'Credentials invalid or not provided.'
    } else if (err.status === 409) {
      err.message = 'The username and/or email address is already registered'
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message
      })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
