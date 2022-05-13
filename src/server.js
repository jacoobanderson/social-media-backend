import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { Messages } from './models/messages.js'

try {
  await connectDB()

  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  app.use(helmet())

  app.use(cookieParser())

  app.use(logger('dev'))

  app.use(express.json())

  io.on('connection', (socket) => {
    console.log('socket.io: Connected')

    socket.on('join', room => {
      const sortedRoom = room.sort((a, b) => (a < b ? -1 : 1))
      const joinRoom = sortedRoom[0] + sortedRoom[1]
      const socketRooms = [...socket.rooms]

      socketRooms
        .filter(it => it !== socket.id)
        .forEach(id => {
          socket.leave(id)
          socket.removeAllListeners('message')
        })

      socket.join(joinRoom)

      socket.on('message', ({ name, message }) => {
        socketRooms
          .filter(it => it !== socket.id)
          .forEach(id => {
            io.to(id).emit('message', { name, message })
          })

          async function addMessageToDb() {
            const dbRoom = await Messages.findOne({ room: joinRoom })
            console.log(dbRoom)
            if (dbRoom) {
             dbRoom.messages.push({ name: name, message: message })
              await dbRoom.save()
            } else {
              const newMessage = new Messages({
                messages: [{ name: name, message: message }],
                room: joinRoom
              })
             await newMessage.save()
            }
          }
          addMessageToDb()
      })

      socket.on('disconnect', () => {
        console.log('socket.io: Disconnected')
      })
    })
  })

  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['http://localhost:3000'])
    res.append('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS')
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
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
