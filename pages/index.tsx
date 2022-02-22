import { useEvent } from "./helpers/socket"

export default function Home() {
	useEvent((eventName: string, data: any) => {
		console.log({
			eventName,
			data,
		})
	})

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
