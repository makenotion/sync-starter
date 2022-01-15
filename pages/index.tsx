import Link from 'next/link'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function Home() {
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
			}
		})

		if (socket) return () => socket.disconnect()
	}, [])

  return (
    <ul>
      <li>
        <Link href="/a" as="/a">
          <a>a</a>
        </Link>
      </li>
      <li>
        <Link href="/b" as="/b">
          <a>b</a>
        </Link>
      </li>
    </ul>
  )
}
