import { Text, HStack, Container } from "@chakra-ui/layout";
import styled from "@emotion/styled";
import {Link} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";
import {NavLink} from "react-router-dom";
import {useRecoilState} from "recoil";
import {languageState} from "../../hooks/Atoms";

const Footer:React.FC<IBaseProps>=(props:IBaseProps)=>{
	const [lang, ] = useRecoilState(languageState);
	const [docLink, setDocLink] = useState("");
	useMemo(()=>{
		if(lang === "en-US"){
			setDocLink("https://docs-en.seedlist.org");
		}

		if(lang === "zh-CN"){
			setDocLink("https://docs.seedlist.org");
		}
	},[lang]);
  return (
    <FooterContainer maxW="container.xl" centerContent>
      <HStack py={5} wrap="wrap" spacing={6}>

		  <Link href="https://github.com/seedlist" target="_blank">
			  <HStack spacing={2}>
				  <Text fontSize="1xl" fontWeight="">
					  <Trans>Github</Trans>: v1.0
				  </Text>
			  </HStack>
		  </Link>

	      <Link href="https://www.reddit.com/r/seedlist" target="_blank">
			  <HStack spacing={2}>
				  <Text fontSize="1xl" fontWeight="">
					  <Trans>Forum</Trans>
				  </Text>
			  </HStack>
	      </Link>

	      <Link href={docLink} target="_blank">
		      <HStack spacing={2}>
				  <Text fontSize="1xl" fontWeight="">
					 <Trans>Docs</Trans>
				  </Text>
			  </HStack>
	      </Link>

          <Link href="https://discord.gg/kQgg5kkpA5" target="_blank">
			  <HStack spacing={2}>
				  <Text fontSize="1xl" fontWeight="">
					  Discord
				  </Text>
			  </HStack>
          </Link>

	      <NavLink to="/donate">
		      <HStack spacing={2}>
			      <Text fontSize="1xl" fontWeight="">
				      <Trans>Donate Me </Trans>
			      </Text>
		      </HStack>
	      </NavLink>

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