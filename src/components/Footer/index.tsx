import { Text, HStack, Container } from "@chakra-ui/layout";
import styled from "@emotion/styled";
import {Link} from "@chakra-ui/react";
import React, {useCallback} from "react";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";
import {useRecoilState} from "recoil";
import {chatOpenState} from "../../hooks/Atoms";
import {ChatIcon, CheckCircleIcon} from "@chakra-ui/icons";
import {Button} from "@chakra-ui/button";

const Footer:React.FC<IBaseProps>=(props:IBaseProps)=>{
	const [isOpen, setChatOpen] = useRecoilState(chatOpenState);

	const doClick = useCallback(()=>{
		setChatOpen(!isOpen);
	},[setChatOpen,isOpen])

  return (
    <FooterContainer maxW="container.xl" centerContent>
      <HStack py={5} wrap="wrap" spacing={6}>
	      <Link href="http://jnsdao.com" target="_blank">
		      <HStack spacing={2}>
			      <Text fontSize="1xl" fontWeight="">
				      <Trans>JNSDAO</Trans>
			      </Text>
		      </HStack>
	      </Link>
	      <HStack spacing={2}>
		      <Text fontSize="1xl" fontWeight="">
{/*
			      <Trans>Copyright © 2023 OpenRace</Trans>
*/}
			      ©OpenRace
		      </Text>
	      </HStack>

	      <HStack spacing={2}>
		      <Text fontSize="1xl" fontWeight="">
			      <Trans>Relay</Trans> <CheckCircleIcon color="green" boxSize={3}/>
		      </Text>
	      </HStack>

	      <HStack spacing={1}>
		      <Button
			      colorScheme="#1a1d22"
			      width="60px"
			      onClick={()=>doClick()}
		      >
		      <Text fontSize="1xl" fontWeight="">
			      <Trans>Chat</Trans> <ChatIcon />
		      </Text>
		      </Button>
	      </HStack>

      </HStack>
    </FooterContainer>
  );
}


const FooterContainer = styled(Container)`
    position:fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
`

export {Footer};