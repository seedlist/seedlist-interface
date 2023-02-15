import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter, DrawerCloseButton, Textarea, HStack, Tooltip
} from "@chakra-ui/react";
import {Box, Stack, Text} from "@chakra-ui/layout";
import {Button} from "@chakra-ui/button";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";
import {useRecoilState} from "recoil";
import {
	chatOpenState
} from "../../hooks/Atoms";
import {relayInit, Relay,Event, generatePrivateKey, getPublicKey, getEventHash, signEvent} from "nostr-tools";
import {ViewIcon} from "@chakra-ui/icons";

let relay:Relay;
const Chatting:React.FC<IBaseProps> = (props:IBaseProps)=>{

	const [isOpen, setChatIsOpen] = useRecoilState(chatOpenState);
	const [text, setText] = useState<string>("");

	const [message, setMessage] = useState<string[]>([])

	const handleTextChange = (event: React.FormEvent<HTMLTextAreaElement>)=>{
		setText(event.currentTarget.value)
	}

	const doCancel = useCallback(async()=>{
		setChatIsOpen(false);
		if(relay!=undefined){
			relay.close();
		}
	},[relay])

	const doSubmit = useCallback(async()=>{
		// let's publish a new event while simultaneously monitoring the relay for it
		let sk = generatePrivateKey()
		let pk = getPublicKey(sk)


		let event:Event = {
			kind: 1,
			pubkey: pk,
			created_at: Math.floor(Date.now() / 1000),
			tags: [
				["chat","d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027"]
			],
			content: text
		}
		event.id = getEventHash(event)
		event.sig = signEvent(event, sk)
		if(relay===undefined){
			relay = relayInit('ws://45.43.60.97:7447')
			await relay.connect()
			relay.on('connect', () => {
				console.log(`connected to ${relay.url}`)
			})
		}
		let pub = relay.publish(event)
		pub?.on('ok', () => {
			console.log(`${relay?.url} has accepted our event`)
		})

	},[text])


	 useMemo(async()=>{
		if(relay===undefined){
			relay = relayInit('ws://45.43.60.97:7447')
			await relay.connect()
			relay.on('connect', () => {
				console.log(`connected to ${relay.url}`)
			})
		}

		let sub = relay.sub([
			{
				//e: ['d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027']
			}
		])
		let msgs:string[] = message;
		let index:number = message.length;
		await sub.on('event', (event: Event) => {
			if(event.tags[0][0]==="chat"){
				console.log('we got the event we wanted:', event.content)
			}
			msgs[index] = event.content;
			index++;
		})
		setMessage(msgs);
	},[])


	const showMessage =useMemo(()=>{
		const contents = message.map( (msg:string, index:number)=>
			<HStack>
				{msg}
			</HStack>
		)
		return(
			<>{contents}</>
		);
	},[]);

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
							{ showMessage }
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
