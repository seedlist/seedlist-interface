import React, {useMemo, useState} from "react";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {Box} from "@chakra-ui/layout";
import {
	IconButton,
	Menu,
	MenuButton,
	MenuItemOption,
	MenuList,
	MenuOptionGroup
} from "@chakra-ui/react";
import {SettingsIcon} from "@chakra-ui/icons";
import {useRecoilState} from "recoil";
import {languageState} from "../../hooks/Atoms";
import {generatorState} from "../../hooks/Atoms";


const WalletGeneratorSetting:React.FC<IBaseProps> = (iprops:IBaseProps)=>{
	const [lang, ] = useRecoilState(languageState)
	const [groupTitle, setGroupTitle]	= useState<string>("Generate By")
	const [, setGenerator] = useRecoilState(generatorState)
	useMemo(()=>{
		if(lang==='zh-CN'){
			setGroupTitle("生成方式")
		}

		if(lang==='en-US'){
			setGroupTitle("Generate By")
		}
	},[lang])

	return(
		<>
			<Box width="10px" /> <Box>
			<Menu
				autoSelect={false}
				closeOnSelect={true}
			>
				<MenuButton
					as={IconButton}
					aria-label='Options'
					icon={<SettingsIcon color={"gray"} />}
					variant='outline'
					colorScheme={"blackAlpha.100"}
					bg={"#2b2d32"}
					borderRadius='md'
					borderWidth='0px'
					_hover={{ bg: '#2b2d32' }}
					_expanded={{ bg: '#2b2d32' }}
					_focus={{ boxShadow: 'outline', bg:"#2b2d32" }}
				/>
				<MenuList maxWidth='100px' bgColor={"#2b2d32"} borderColor={"black"}>
					<MenuOptionGroup defaultValue='puzzle' title={groupTitle} type='radio'>
						<MenuItemOption
							_hover={{ bg: 'blackAlpha.500'}}
							value='entropy'
							onClick={()=>setGenerator('entropy')}
						>
							<Trans> VaultName&Password </Trans>
						</MenuItemOption>
						<MenuItemOption
							_hover={{ bg: 'blackAlpha.500'}}
							value='puzzle'
							onClick={()=>setGenerator('puzzle')}
						>
							<Trans> Random Puzzle</Trans>
						</MenuItemOption>
					</MenuOptionGroup>
				</MenuList>
			</Menu>
		</Box>
		</>
	);
}
export {WalletGeneratorSetting};
