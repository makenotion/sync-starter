/* ================================================================================

	 Mock Socket Server.

================================================================================ */

import { useEffect } from "react"

const content = [
	`Everything in ::notion:: is a "block"`,
	`When you create your first page in ::notion:: and begin typing, you've started with a text block. But ::notion:: pages can contain a lot more than plain text!`,
	`The / command will quickly become your best friend in ::notion::`,
	`What would double ::notion::::notion:: look like??`,
	`::notion:: allows blocks to transform`,
	`Any block in ::notion:: can be turned into any other type of block in order to use, view, or deepen that information in a new way.`,
	`Blocks can be rearranged`,
	`A tool to build your own tools`,
	`::notion:: is as lightweight or as powerful as you need it to be, and blocks enable you to build the perfect tool - exactly the way you want.	`,
	`Every page you create in ::notion:: is a fresh canvas where you can add whatever content you want. Follow these steps to create your first one 📄`,
	`Start writing`,
	`Begin typing whatever you want. You'll notice other features fade away, leaving you with your thoughts.`,
]

const faker = [
	{ id: "ed9f620c-04e4-46fd-8093-a64efaf936de", createdBy: "Alan Kay" },
	{ id: "77fe5be4-4c23-4cc2-92dc-70c53a105173", createdBy: "Jordan" },
	{
		id: "afdb4b8a-97f8-4434-a00e-04dd7f299a6a",
		createdBy: "Douglas Engelbart",
	},
	{ id: "f1f50906-78ca-4bbe-9a6f-c1fc1c98646b", createdBy: "Ryan" },
	{ id: "80e1dd05-18f9-43e9-a3d1-5542b648cbdf", createdBy: "Ted Nelson" },
	{ id: "af90c9ee-3e72-491c-8820-e72b8e69583b", createdBy: "Penny" },
	{ id: "12480dcc-6a30-4137-8cb2-10996c4d3117", createdBy: "Ada Lovelace" },
	{ id: "39fde82b-da12-4257-a415-3eea3aa4f352", createdBy: "Fatema" },
	{ id: "a23441b7-eda7-4099-b513-e27cd6e4fb54", createdBy: "Edgar Dijkstra" },
	{ id: "bc0d766d-ac66-4621-b5be-9dfa9c806869", createdBy: "Tanner" },
	{ id: "6013f3f7-d2fb-44f7-bb8f-bef96beed14f", createdBy: "Grace Hopper" },
	{ id: "29331f26-a2ba-4258-ab59-3e010bc9053e", createdBy: "David" },
]

const textColors = [
	"#8F00F2",
	"#00CFFB",
	"#5CFF00",
	"#E71111",
	"#FDAE32",
	"#C51A97",
]

// Mock socket server using `setInterval`
if (typeof window !== "undefined") {
	;(window as any).Socket = {}
	;(window as any).Socket.listen = (callback: Function) => {
		callback("title", "Notion Interview")
		let index = 0
		// Swap between creating and updating for each entry.
		let isCreating: boolean = true
		const handle = setInterval(() => {
			if (isCreating) {
				callback("block-created", {
					id: faker[index].id,
					createdBy: faker[index].createdBy,
					title: content[index],
					color: textColors[index / 2],
				})
				isCreating = false
			} else {
				callback("block-updated", {
					id: faker[index].id,
					title: "(updated) " + content[index],
				})
				isCreating = true
				index++
			}
			if (index === content.length) {
				clearInterval(handle)
			}
		}, 300)
	}
}

// Expose mock socket server via `useEvent` custom hook
export function useEvent(handleEvent: any) {
	useEffect((): any => {
		;(window as any).Socket.listen(handleEvent)
	}, [handleEvent])
}
