import React from "react";
import {Center, Container, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {Image} from "@chakra-ui/react";

const Identity:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
		<Center>
			<Container>
				<Center>
					<Text fontSize="4xl" fontWeight="extrabold">
						IN CRYPTO, WE TRUST
					</Text>
				</Center>
				<Center>
					<Image marginY="80px" src="./media/coming-soon.svg" width="200" height="200" />
				</Center>
			</Container>
		</Center>
);
}

export {Identity};
