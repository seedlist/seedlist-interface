import React from "react";
import {Box, Center, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {Image} from "@chakra-ui/react";

const Document:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
			<Center>
					<Box>
						<Center>
							<Image marginY="10px" boxShadow="1024" src="./media/encrypt-flow.png" />
						</Center>
						<Center>
							<Text>seedlist-encrypt-process.jpg</Text>
						</Center>
					</Box>
			</Center>
);
}

export {Document};
