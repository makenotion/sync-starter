import * as http from 'http'
// import { parse } from 'url'
import next from 'next'
import express, { Express, Request, Response } from 'express'
import * as socketio from 'socket.io'
import faker from 'faker'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
	const app: Express = express()
	const server: http.Server = http.createServer(app)
	const io: socketio.Server = new socketio.Server(server, {
		path: "/api/socketio"
	})
	// io.attach(server)

	app.get('/hello', async (_: Request, res: Response) => {
		res.send('Hello, world!')
	})

	io.on('connection', (socket: socketio.Socket) => {
		console.log('connected')
		socket.emit('message', 'Welcome to socket!')
		socket.on('disconnect', () => {
			console.log('disconnected')
		})

		setInterval(() => {
			// Send random events with random data
			socket.emit('block-created', faker.lorem.sentence())
		}, 1000)
	})

	app.all('*', async (req: Request, res: Response) => {
		void nextHandler(req, res)
	})

	server.listen(port, () => {
		console.log(`Listening on port ${port}...`)
	})

})
