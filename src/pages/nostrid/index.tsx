import React from "react";
import {Box, Center, Container, HStack, Stack, Text} from "@chakra-ui/layout";
import { IBaseProps } from "../../interfaces/props";
import {Flex, Image, Spacer} from "@chakra-ui/react";
import {NostridBoard} from "../../components/Board/nostrid";
import {Trans} from "@lingui/macro";
import {NostridPuzzleArea} from "../../components/TextInput/nostrid/PuzzelArea";
import {NostridVaultArea} from "../../components/TextInput/nostrid/VaultArea";
import {NostridGeneratorButton} from "../../components/Buttons/nostrid";
import {NostrIds} from "../../components/Dialog/NostrIds";

const NostrId:React.FC<IBaseProps> = (props:IBaseProps)=>{
	return(
		<Center>
			<Container>
				<Center>
					<Text fontSize="4xl" fontWeight="extrabold">
					<Trans>chess without regrets </Trans>
					</Text>
				</Center>


				<Center>
						<Box bgColor="#2b2d32" p="5" w="90%" maxW="lg" borderRadius="8" >
							<Stack spacing={6} w="100%">
								<Center>
									<Text fontSize="2xl" fontWeight="extrabold"><Trans>Race List</Trans>:</Text>
								</Center>
								<Flex >
									<Center flex="1" h="22px"  fontWeight="extrabold" marginY="0px"> apple.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Finished </Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Deal</Trans> ￥126 </Center>
								</Flex>
								<Flex >
									<Center flex="1" h="22px" fontWeight="extrabold"> google.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Finished </Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Deal</Trans>￥217 </Center>
								</Flex>
								<Flex backgroundColor="#975A16">
									<Center flex="1" h="22px" fontWeight="extrabold"> amazon.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Bidding </Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Now</Trans>￥311</Center>
								</Flex>
								<Flex>
									<Center flex="1" h="22px" fontWeight="extrabold"> openai.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"> <Trans>Coming </Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Init</Trans> ￥10 </Center>
								</Flex>
								<Flex>
									<Center flex="1" h="22px" fontWeight="extrabold"> joule.j </Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans> Coming </Trans></Center>
									<Spacer />
									<Center flex="1" h="22px" fontWeight="extrabold"><Trans>Init</Trans> ￥50 </Center>
								</Flex>
							</Stack>
						</Box>
				</Center>
				<NostridBoard />
			</Container>
		</Center>
	);
}

export {NostrId};
