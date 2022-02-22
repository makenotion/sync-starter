import { io } from "socket.io-client"

// Initialize web socket connection and export it
export const socket = io({
	path: "/api/socketio",
})

socket.on("connect", () => {
	console.log("Socket connected 🥳")
})
