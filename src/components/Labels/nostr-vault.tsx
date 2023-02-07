import React, {useState, useEffect} from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {generatorState, labelState, nostrLabelState} from "../../hooks/Atoms";
import {Text} from "@chakra-ui/layout";


const NostrVaultLabel:React.FC<IBaseProps> = (iprops:IBaseProps)=>{
	const [color, setColor] = useState<string>("gray");
	const [label, setNostrLabel] = useRecoilState(nostrLabelState)
	const [, setGeneratorState] = useRecoilState(generatorState);

	useEffect(()=>{
		if(label==="nostr-vault"){
			setColor("")
			setGeneratorState("vault");
		}else{
			setColor("gray")
		}
	},[label])

	return(
		<Button
			colorScheme="blackAlpha"
			fontSize="xl"
			onClick={()=>{setNostrLabel("nostr-vault")}}
			w={["32", "60"]}
		>
			<Text color={color}> <Trans>Base on Vault</Trans> </Text>
		</Button>

	);
}
export {NostrVaultLabel};
