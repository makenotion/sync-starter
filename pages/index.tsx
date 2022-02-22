import { useCallback, useEffect, useState } from "react"
import { socket } from "./helpers/socket"

export default function Home() {
	const [blocks, setBlocks] = useState<any>([])

	const handleEvent = (eventName, data) => {
		/*************************************************
		 * Handle web socket events below here 👇        *
		 *************************************************/
		console.log({
			eventName,
			data,
		})
		if (eventName === "block-create") {
			console.log({ blocks })
			setBlocks(([...blocks, data]))
		}
		/*************************************************
		 * Handle web socket events above here 👆        *
		 *************************************************/
	}

	useEffect((): any => {
		socket.onAny(handleEvent)
		return () => socket.offAny(handleEvent)
	}, [handleEvent])

	return (
		<>
			<h2>Hi and welcome 👋</h2>
			<p>
				Open up <code>pages/index.tsx</code> and get started with the interview
				🥳
			</p>
			{blocks.length}
		</>
	)
}
