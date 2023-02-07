import React, {useCallback, useMemo, useState} from "react";
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter, DrawerCloseButton, GridItem, Grid
} from "@chakra-ui/react";
import {Box, Stack, Text} from "@chakra-ui/layout";
import {Button} from "@chakra-ui/button";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";
import {useRecoilState} from "recoil";
import {
	bitcoinWalletState,
	generatorState, genNostridWaitingState, NostrIdsState,
	puzzleState, vaultNameState, vaultPasswordState
} from "../../hooks/Atoms";
import {QRCodeSVG} from 'qrcode.react';
import {GenBitcoinBrainWalletByEntropy, GenBitcoinBrainWalletByPuzzle} from "../../lib/brainwallet";
import {GenNostrIdByEntropy, GenNostrIdByPuzzle} from "../../lib/nostrid";

const NostrIds:React.FC<IBaseProps> = (props:IBaseProps)=>{

	const [isOpen, setOpen] = useState<boolean>(false)

	const [isNostrIdsState, setNostrIdsState] = useRecoilState(NostrIdsState);

	const [generator, ] = useRecoilState(generatorState);
	const [puzzle, ] = useRecoilState(puzzleState);
	const [vaultName,] = useRecoilState(vaultNameState);
	const [password, ] = useRecoilState(vaultPasswordState);
	const [publickeys, setPublickeys] = useState<string[]>();
	const [privkeys, setPrivkeys] =useState<string[]>();
	const [npubs, setNpubs] = useState<string[]>();
	const [nsecs, setNsecs] =useState<string[]>();
	const [step, setStep] = useState<number>(1);
	const [isGenNostridWaiting, setIsGenNostridWaiting] = useRecoilState(genNostridWaitingState);
	useMemo(()=>{
		setOpen(isNostrIdsState);
		if(isNostrIdsState===false) {
			console.log("11111111111111111111111")
			setIsGenNostridWaiting(false);
			return;
		}
		if(generator==="puzzle"){
			let nostrids = GenNostrIdByPuzzle(0,10*step, puzzle)
			setPublickeys(nostrids.publickeys);
			setPrivkeys(nostrids.privkeys);
			setNpubs(nostrids.npubs);
			setNsecs(nostrids.nsecs);
		}
		if(generator==="vault"){
			let nostrids = GenNostrIdByEntropy(0, 10*step, vaultName, password);
			setPublickeys(nostrids.publickeys);
			setPrivkeys(nostrids.privkeys);
			setNpubs(nostrids.npubs);
			setNsecs(nostrids.nsecs);
		}
		setIsGenNostridWaiting(false);
	},[isNostrIdsState, step, vaultName, password, genNostridWaitingState])

	const doCancel = useCallback(()=>{
		setOpen(false);
		setNostrIdsState(false);
		setStep(1);
	},[])

	const doSubmit = useCallback(()=>{
		setStep(step+1);
	},[step])

	const showNostridContent = useMemo(()=>{
		const contents = npubs?.map((npub: string, index: number) =>
			<>
			<Grid
				h='100px'
				templateRows='repeat(3, 1fr)'
				templateColumns='repeat(10, 1fr)'
				gap={1}
				marginY={"30px"}

			>
				<GridItem rowSpan={3} colSpan={1} >
					<QRCodeSVG
						value={npub}
						size={96}
						bgColor={"#000000"}
						fgColor={"#ffffff"}
						level={"L"}
						includeMargin={false}
					/>
				</GridItem>

				<GridItem colSpan={8}>
					<Text color={"white"}> <Trans>npub</Trans>/{index+1} :<br/> {npub} </Text>
				</GridItem>

				<GridItem rowSpan={3} colSpan={1}>
					<QRCodeSVG
						value={nsecs===undefined?"":nsecs[index]}
						size={96}
						bgColor={"#000000"}
						fgColor={"#ffffff"}
						level={"L"}
						includeMargin={false}
					/>
				</GridItem>

				<GridItem colSpan={7}> </GridItem>
				<GridItem colSpan={1} ><Text color={"whiteAlpha.600"}><Trans>nsec</Trans>:</Text></GridItem>
				<GridItem colSpan={8}>
					<Grid templateColumns='repeat(100, 1fr)' >
						<GridItem colSpan={18}></GridItem>
						<GridItem colSpan={82}>
							<Text color={"whiteAlpha.600"}> {nsecs===undefined?"":nsecs[index]} </Text>
						</GridItem>
					</Grid>
				</GridItem>
			</Grid>
			<hr />
			</>
		);
		return(
			<>{contents}</>
		);
	},[npubs, nsecs]);

	return(
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={doCancel}
			size='xl'
			closeOnOverlayClick={false}
			closeOnEsc={true}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader borderBottomWidth='1px'>

					<Text fontSize="18px" color="white">
						<Trans>Nostr Id:</Trans>
					</Text>
				</DrawerHeader>

				<DrawerBody>
					<Stack spacing='30px'>
						<Box>
							{showNostridContent}
						</Box>
					</Stack>

				</DrawerBody>

				<DrawerFooter borderTopWidth='1px'>
					<Button variant='outline' colorScheme='whiteAlpha' mr={3} onClick={doCancel}>
						<Trans>Cancel</Trans>
					</Button>
					<Button colorScheme='blackAlpha' mr={3} onClick={()=>doSubmit()}>
						<Trans>More Id</Trans>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export {NostrIds};
