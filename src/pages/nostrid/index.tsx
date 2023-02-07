import React from "react";
import {Center, Container, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {Image} from "@chakra-ui/react";
import {NostridBoard} from "../../components/Board/nostrid";

const NostrId:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
		<Center>
			<Container>
				<Center>
					<Text fontSize="4xl" fontWeight="extrabold">
						IN CRYPTO, WE TRUST
					</Text>
				</Center>
				<NostridBoard />
			</Container>
		</Center>
	);
}

export {NostrId};
