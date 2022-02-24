// If you want Typescript checking, remove the line below 👇
// @ts-nocheck
import { useEvent } from "./helpers/socket"

type EventName = "block-create" | "block-update" | "page-title"

export default function Notion() {
	useEvent((eventName: EventName, data: any) => {
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
			<p className="callout">
				If you decide you want the events to be sent faster, you can edit the{" "}
				<code>MILLISECONDS_BETWEEN_EVENTS</code> variable in{" "}
				<code>server/index.ts</code>.
			</p>
		</>
	)
}
