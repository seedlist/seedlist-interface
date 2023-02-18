import React, {useMemo, useState} from "react";
import {Box, Center, Container, Stack, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {Flex, Spacer} from "@chakra-ui/react";
import {BidBoard} from "../../components/Board/bid";
import {Trans} from "@lingui/macro";
import {useRecoilState} from "recoil";
import {nowPriceState} from "../../hooks/Atoms";

const Openrace:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const [nowPrice, ] = useRecoilState(nowPriceState);
	let colors =["red","#975A16", "green","orange"];
	const [index, setIndex] = useState(0)
	useMemo(()=>{
		setIndex((index+1)%4);
	},[nowPrice])
	return(
		<Center>
			<Container>
				<Center>
					<Text fontSize="4xl" fontWeight="extrabold">
					<Trans>Bid Without Regrets</Trans>
					</Text>
				</Center>


				<Center marginY="12px">
						<Box bgColor="#2b2d32" p="5" w="95%" maxW="lg" borderRadius="8" >
							<Stack spacing={6} w="100%">
								<Center>
									<Text fontSize="2xl" fontWeight="extrabold"><Trans>Race List</Trans>:</Text>
								</Center>
								<Flex >
									<Center flex="1" h="22px"  fontWeight="extrabold" marginY="0px"> apple.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Finished</Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Deal</Trans> ￥126</Center>
								</Flex>
								<Flex >
									<Center flex="1" h="22px" fontWeight="extrabold"> google.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Finished</Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Deal</Trans> ￥217</Center>
								</Flex>
								<Flex backgroundColor={colors[index]}>
									<Center flex="1" h="22px" fontWeight="extrabold">amazon.j</Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Bidding</Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Now</Trans> ￥{nowPrice}</Center>
								</Flex>
								<Flex>
									<Center flex="1" h="22px" fontWeight="extrabold"> openai.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Following</Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Init</Trans> ￥10</Center>
								</Flex>
								<Flex>
									<Center flex="1" h="22px" fontWeight="extrabold"> facebook.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Following</Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Init</Trans> ￥50</Center>
								</Flex>
							</Stack>
						</Box>
				</Center>
				<BidBoard />
			</Container>
		</Center>
	);
}

export {Openrace};
