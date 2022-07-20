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
  }

  middlewares() {
    this.app.use(cors())
  }

  getConnection() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connect ${socket.id}`)
    })
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running at PORT: ${this.port}`)
    })
  }
}

export default ServerRealtime
