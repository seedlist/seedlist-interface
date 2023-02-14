import React, {useCallback, useMemo, useState} from "react";
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter, DrawerCloseButton, Textarea
} from "@chakra-ui/react";
import {Box, Stack, Text} from "@chakra-ui/layout";
import {Button} from "@chakra-ui/button";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";
import {useRecoilState} from "recoil";
import {
	chatOpenState
} from "../../hooks/Atoms";
import {relayInit} from "nostr-tools";

const Chatting:React.FC<IBaseProps> = (props:IBaseProps)=>{

	const [isOpen, setChatIsOpen] = useRecoilState(chatOpenState);

	const [text, setText] = useState<string>("");
	const handleTextChange = (event: React.FormEvent<HTMLTextAreaElement>)=>{
		setText(event.currentTarget.value)
	}

	const doCancel = useCallback(()=>{
		setChatIsOpen(false);
	},[])

	const doSubmit = useCallback(()=>{
		console.log("input:", text)
	},[text])

	useMemo(async()=>{
		const relay = relayInit('ws://45.43.60.97:7447')
		await relay.connect()

		relay.on('connect', () => {
			console.log(`connected to ${relay.url}`)
		})
// let's query for an event that exists
		let sub = relay.sub([
			{
				//ids: ['d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027']
			}
		])
		sub.on('event', (event:string) => {
			console.log('we got the event we wanted:', event)
		})
	},[])

	return(
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={doCancel}
			size='md'
			closeOnOverlayClick={false}
			closeOnEsc={true}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader borderBottomWidth='1px'>

					<Text fontSize="18px" color="white">
						<Trans>Chat Board</Trans>
					</Text>
				</DrawerHeader>

				<DrawerBody>
					<Stack spacing='30px'>
						<Box color="white">
							message showing ...
						</Box>
					</Stack>

				</DrawerBody>

				<DrawerFooter borderTopWidth='1px'>
					<Textarea
						color="white"
						placeholder='Talking message...'
						size='md'
						height="10px"
						variant="outline"
						onChange={handleTextChange}
					/>
					<Button colorScheme='blackAlpha' mr={3} onClick={()=>doSubmit()}>
						<Trans>Send</Trans>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export {Chatting};
