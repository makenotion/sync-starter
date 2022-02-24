/* ================================================================================

	 Mock Event Server

================================================================================ */

import _ from "lodash"
import * as http from "http"
import next from "next"
import express, { Express, Request, Response } from "express"
import * as socketio from "socket.io"
import faker from "faker"

/**********************************************************
 * Constants
 **********************************************************/
const MILLISECONDS_BETWEEN_EVENTS = 3000

/**********************************************************
 * Data
 **********************************************************/
const content = [
	`Everything in ::notion:: is a "block"`,
	`When you create your first page in ::notion:: and begin typing, you've started with a text block. But ::notion:: pages can contain a lot more than plain text!`,
	`The / command will quickly become your best friend in ::notion::`,
	`What would double ::notion::::notion:: look like??`,
	`::notion:: allows blocks to transform`,
	`Any block in ::notion:: can be turned into any other type of block in order to use, view, or deepen that information in a new way.`,
	`Blocks can be rearranged`,
	`A tool to build your own tools`,
	`::notion:: is as lightweight or as powerful as you need it to be, and blocks enable you to build the perfect tool - exactly the way you want.	`,
	`Every page you create in ::notion:: is a fresh canvas where you can add whatever content you want. Follow these steps to create your first one 📄`,
	`Start writing`,
	`Begin typing whatever you want. You'll notice other features fade away, leaving you with your thoughts.`,
]

const textColors = ["#8F00F2", "#00CFFB", "#5CFF00", "#E71111", "#FDAE32", "#C51A97"]

const createMessages = content.map((sentence, index) => ({
	id: faker.datatype.uuid(),
	// Some users have first and last names, some only have first name.
	createdBy:
		index % 2
			? `${faker.name.firstName()} ${faker.name.lastName()}`
			: faker.name.firstName(),
	// Every other sentence should have a color
	color: textColors[index / 2],
	content: sentence,
	// Provide `type` in message to allow candidate to use discriminated union
	// type if they want.
	type: "block-create"
}))

const updateMessages = createMessages.map(message => ({
	id: message.id,
	content: `(updated) ${message.content}`,
	type: "block-update"
}))

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
	const app: Express = express()
	const server: http.Server = http.createServer(app)
	const io: socketio.Server = new socketio.Server(server, {
		path: "/api/socketio",
	})

	io.on("connection", async (socket: socketio.Socket) => {
		socket.on("disconnect", () => {
			console.log("disconnected")
		})

		// Send page title on connect
		socket.emit("page-title", {
			content: "Notion Interview",
			type: "page-title"
		})
		await sleep()

		// Send create, followed by and update
		for (let i = 0; i < createMessages.length; i++) {
			socket.emit("block-create", createMessages[i])
			await sleep()
			socket.emit("block-update", updateMessages[i])
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

function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function sleep() {
	await timeout(MILLISECONDS_BETWEEN_EVENTS)
}

