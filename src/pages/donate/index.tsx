import React from "react";
import {Box, Center, Container, HStack, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {Image} from "@chakra-ui/react";
import {Trans} from "@lingui/macro";

const Donate:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
		<Center>
			<Container>
				<Center>
					<HStack spacing="50px" marginY="60px">
						<Box>
							<Center>
								<Text> <Trans>BTC Donate Address</Trans>: </Text>
							</Center>
							<Center>
								<Image marginY="10px" src="./media/BTC.png" width="120" height="120" />
							</Center>
							<Center>
								<Text>17gAk5VpvFHzY26MVmHKeMAMW2Qu3S5aKy</Text>
							</Center>
						</Box>

						<Box>
							<Center>
								<Text> <Trans>ETH/BNB/MATIC Donate Address</Trans>: </Text>
							</Center>
							<Center>
								<Image marginY="10px" src="./media/ERC20.png" width="120" height="120" />
							</Center>
							<Center>
								0xe3cc49f9B628efb8021Af924DE32838F78A16553
							</Center>
						</Box>
					</HStack>
				</Center>
			</Container>
		</Center>
);
}

export {Donate};
