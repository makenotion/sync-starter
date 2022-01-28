import { useEffect } from "react"
import { io } from "socket.io-client"

export default function Home() {
	useEffect((): any => {
		// TODO(ryan): Move to function to clean up useEffect, but fine for now.
		const socket = io({
			path: "/api/socketio",
		})

		// TODO: Figure out why this needs to be handled specifically?
		socket.on("connect", () => {
			console.log("Socket connected 🥳")
		})

		socket.onAny((eventName, data) => {
			console.log({ eventName, data })
		})

		if (socket) return () => socket.disconnect()
	}, [])

	return (
		<>
			<h2>Hi 👋</h2>
		</>
	)
}
