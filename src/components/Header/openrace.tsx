import {HStack, Text} from "@chakra-ui/layout";
import React, {useCallback, useState} from "react";
import {IBaseProps} from "../../interfaces/props";
import {Menu, MenuButton, IconButton} from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
import {Trans} from "@lingui/macro";

const Openrace:React.FC<IBaseProps>=(props:IBaseProps) => {
	const [version, setVersion] = useState<string>("1.0");
	const doSelectVersion = useCallback((value:string)=>{
			setVersion(value);
	},[])
    return(
			<HStack spacing={2}>
				<Text fontWeight="extrabold" fontSize="4xl">
					openrace
				</Text>

				<Menu matchWidth={true} autoSelect={false} >
					<MenuButton maxH="30px" as={IconButton} rightIcon={<HamburgerIcon />}
					            variant='outline' colorScheme={"blackAlpha.100"}
					            bg={"#1a1d22"} borderRadius='md'
					            borderWidth='0px' _hover={{ bg: '#2b2d32' }}
					            _expanded={{ bg: '#2b2d32' }} _focus={{ boxShadow: 'outline', bg:"#2b2d32" }}
					>
						<Text fontSize="15px">
						<Trans>version</Trans>: {version}
						</Text>
					</MenuButton>
{/*
					<MenuList maxWidth='60px' bgColor={"#2b2d32"} borderColor={"black"} defaultValue="2022">
						<MenuItem maxH="20px" _hover={{ bg: 'blackAlpha.500'}} value="2022" onClick={()=>doSelectVersion("2022")}>2022</MenuItem>
					</MenuList>
*/}
				</Menu>
			</HStack>
    );
}

export {Openrace};