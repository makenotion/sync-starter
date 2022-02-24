import { io, Socket } from "socket.io-client"
import { useEffect } from "react"

let socket: Socket

function getSocket() {
	if (socket) {
		return socket
	}
	socket = io({
		path: "/api/socketio",
	})

	socket.on("connect", () => {
		console.log("Socket connected 🥳")
	})
	return socket
}

export function useEvent(handleEvent: any) {
	const socket = getSocket()
	useEffect((): any => {
		socket.onAny(handleEvent)
		return () => socket.offAny(handleEvent)
	}, [handleEvent])
}
