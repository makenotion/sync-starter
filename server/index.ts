import _ from "lodash"
import * as http from "http"
// import { parse } from 'url'
import next from "next"
import express, { Express, Request, Response } from "express"
import * as socketio from "socket.io"
import faker from "faker"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const content = [
	`Everything in ::notion:: is a "block"`,
	`When you create your first page in ::notion:: and begin typing, you've started with a text block. But ::notion:: pages can contain a lot more than plain text!`,
	`Imagine every piece of content you add to a page — whether it's text, an image, or a table — as a single building block. Every page is a stack of blocks combined however you want.`,
	`Blocks can transform`,
	`Any block in ::notion:: can be turned into any other type of block in order to use, view, or deepen that information in a new way.`,
	`Blocks can be rearranged`,
	`A tool to build your own tools`,
	`::notion:: is as lightweight or as powerful as you need it to be, and blocks enable you to build the perfect tool - exactly the way you want.	`,
	`Every page you create in ::notion:: is a fresh canvas where you can add whatever content you want. Follow these steps to create your first one 📄`,
	`Start writing`,
	`Begin typing whatever you want. You'll notice other features fade away, leaving you with your thoughts.`,
	`The / command will quickly become your best friend in ::notion::.`,
]

const textColors = ["#172340", "#212254", "#2c3168", "#393f6b", "#4e5fa2"]

const createMessages = content.map((sentence, index) => ({
	id: faker.datatype.uuid(),
	// Some users have first and last names, some only have first name.
	createdBy:
		index % 2
			? `${faker.name.firstName()} ${faker.name.lastName()}`
			: faker.name.firstName(),
	// Every other sentence will have a color. Kinda messy but works.
	color: textColors[index / 2],
	title: sentence,
}))

const updateMessages = createMessages.map(message => ({
	...message,
	createdBy: undefined,
	title: _.shuffle(message.title.split(" ")).join(" "),
}))

function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
async function sleep() {
	await timeout(3000)
}

nextApp.prepare().then(async () => {
	const app: Express = express()
	const server: http.Server = http.createServer(app)
	const io: socketio.Server = new socketio.Server(server, {
		path: "/api/socketio",
	})

	app.get("/hello", async (_: Request, res: Response) => {
		res.send("Hello, world!")
	})

	io.on("connection", async (socket: socketio.Socket) => {
		// Send page title on connect
		socket.emit("title", "Notion Interview")
		socket.on("disconnect", () => {
			console.log("disconnected")
		})

		// Handle cretes
		for (const message of createMessages) {
			socket.emit("block-created", message)
			await sleep()
		}

		// Handle updates
		for (const message of updateMessages) {
			socket.emit("block-updates", message)
			await sleep()
		}
	})

	app.all("*", async (req: Request, res: Response) => {
		void nextHandler(req, res)
	})

	server.listen(port, () => {
		console.log(`Listening on port ${port}...`)
	})
})
