import React from "react";
import {Box, Center, HStack, Stack} from "@chakra-ui/layout";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {generatorState} from "../../hooks/Atoms";
import {BidPriceArea} from "../TextInput/bidprice/BidPriceArea";
import {RacePriceButton} from "../Buttons/raceprice";
import {Chatting} from "../Dialog/Chatting";

const BidBoard:React.FC<IBaseProps>=(props:IBaseProps)=>{
	const [generator, ] = useRecoilState(generatorState)
	return(
		<Center>
			<Stack marginY="10px">
				<Box bgColor="#2b2d32" p="5" w="100%" maxW="lg" borderRadius="8" >
					<Stack spacing={6}>
						<BidPriceArea />
						<HStack spacing="24px" width="100%">
							<RacePriceButton />
						</HStack>
						<Chatting />
					</Stack>
				</Box>
			</Stack>
		</Center>
	);
}

export {BidBoard};
