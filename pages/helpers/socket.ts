import { io } from "socket.io-client"
import { useEffect } from "react"

// Initialize web socket connection and export it
export const socket = io({
	path: "/api/socketio",
})

socket.on("connect", () => {
	console.log("Socket connected 🥳")
})

export function useEvent(handleEvent: any) {
	useEffect((): any => {
		socket.onAny(handleEvent)
		return () => socket.offAny(handleEvent)
	}, [handleEvent])
}
