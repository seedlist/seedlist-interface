import React from "react";
import {Center, Container, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";

const NotFound:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
		<Center>
			<Container>
				<Center>
					<Text fontSize="4xl" fontWeight="extrabold">
						IN CRYPTO, WE TRUST
					</Text>
				</Center>
				<Center>
					Not Found ...
				</Center>
			</Container>
		</Center>
);
}

export {NotFound};
