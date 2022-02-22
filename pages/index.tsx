import { useEffect } from "react"
import { socket } from "./helpers/socket"

export default function Home() {
	useEffect((): any => {
		socket.onAny((eventName, data) => {
			/*************************************************
			 * Handle web socket events below here 👇        *
			 *************************************************/
			console.log({
				eventName,
				data,
			})
			/*************************************************
			 * Handle web socket events above here 👇        *
			 *************************************************/
		})

		// Disconnect from socket once component is removed from screen.
		return () => socket.disconnect()
	}, [])

	return (
		<>
			<h2>Hi and welcome 👋</h2>
			<p>
				Open up <code>pages/index.tsx</code> and get started with the interview
				🥳
			</p>
		</>
	)
}
