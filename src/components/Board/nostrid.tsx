import React from "react";
import {Box, Center, HStack, Stack} from "@chakra-ui/layout";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {generatorState} from "../../hooks/Atoms";
import {NostridPuzzleArea} from "../TextInput/nostrid/PuzzelArea";
import {NostridVaultArea} from "../TextInput/nostrid/VaultArea";
import {NostridGeneratorButton} from "../Buttons/nostrid";
import {NostrIds} from "../Dialog/NostrIds";
import {Chatting} from "../Dialog/Chatting";

const NostridBoard:React.FC<IBaseProps>=(props:IBaseProps)=>{
	const [generator, ] = useRecoilState(generatorState)
	return(
		<Center>
			<Stack marginY="10px">
				<Box bgColor="#2b2d32" p="5" w="100%" maxW="lg" borderRadius="8" >
					<Stack spacing={6}>

						{generator==='puzzle' && <NostridPuzzleArea />}
						{generator==='vault' && <NostridVaultArea />}

						<HStack spacing="24px" width="100%">
							<NostridGeneratorButton />
						</HStack>
						<NostrIds />
						<Chatting />
					</Stack>
				</Box>
			</Stack>
		</Center>
	);
}

export {NostridBoard};
