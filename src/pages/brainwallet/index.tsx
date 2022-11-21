import React from "react";
import {Center, Container, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {WalletBoard} from "../../components/Board/brainwallet";

const Brainwallet:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
		<Center>
			<Container>
				<Center>
					<Text fontSize="4xl" fontWeight="extrabold">
						IN CRYPTO, WE TRUST
					</Text>
				</Center>
				<WalletBoard />
			</Container>
		</Center>
	);
}

export {Brainwallet};
