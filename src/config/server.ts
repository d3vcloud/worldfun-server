import express, { Application } from 'express'
import cors from 'cors'
import { createServer, Server } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import { CLIENT_URL } from './constants'

class ServerRealtime {
  private app: Application
  private port: string
  private server: Server
  private io: SocketServer
  private rooms: Record<string, { participants: Array<any> }>

  constructor() {
    this.app = express()
    this.port = '4000'
    this.server = createServer(this.app)
    this.io = new SocketServer(this.server, {
      cors: {
        origin: CLIENT_URL
      }
    })
    // Middlewares
    this.middlewares()
    // Start connection with socket
    this.getConnection()
    // Initialize rooms
    this.rooms = {}
  }

  middlewares() {
    this.app.use(cors())
  }

  getConnection() {
    this.io.on('connection', (socket: Socket) => {
      const dataFromClient = socket.handshake.headers['x-data']

      if (!dataFromClient) {
        return socket.disconnect()
      }

      const { user, room } = JSON.parse(dataFromClient as any)
      socket.join(room)
      if (this.rooms[room]) {
        // Just notify the upcoming participant
        socket.emit('connected-users', this.rooms[room].participants)
        this.rooms[room].participants.push(user)
      } else {
        // Just notify the upcoming participant
        socket.emit('connected-users', [])
        this.rooms[room] = { participants: [user] }
      }
      // Notify all participants less the upcoming participant
      socket.broadcast.to(room).emit('new-user', user)

      socket.on('disconnect', () => {
        const { userId } = user

        const newParticipants = this.rooms[room].participants.filter((par) => par.userId !== userId)
        this.rooms[room].participants = [...newParticipants]
        // Notify all participants there was a user who left
        socket.broadcast.to(room).emit('user-left', user)
      })
    })
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running at PORT: ${this.port}`)
    })
  }
}

export default ServerRealtime
