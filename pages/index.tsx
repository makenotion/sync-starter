import Link from 'next/link'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export default function Home() {
	const [blocks, setBlocks] = useState<Array<any>>([])
	useEffect((): any => {
		console.log('setting up socket...')
		const socket = io({
			path: "/api/socketio"
		})

		// TODO: Figure out why this needs to be handled specifically?
		socket.on('connect', () => {
			console.log('Socket connected.', socket.id)
		})

		socket.onAny((eventName, data) => {
			if (eventName === 'message') {
				console.log('Message: ', data)
			} else if (eventName === 'block-created') {
				console.log('Block Created: ', data)
				setBlocks((blocks) => [
					...blocks,
					data
				])
			}
		})

		if (socket) return () => socket.disconnect()
	}, [])

  return (
		<ul>
			{
				blocks.map(block => <li key={block.id}><b>{block.createdBy} added:</b> {block.title}</li>)
			}
		</ul>
  )
}
