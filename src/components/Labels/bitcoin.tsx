import React, {useState, useEffect} from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {labelState} from "../../hooks/Atoms";
import {Text} from "@chakra-ui/layout";


const BitcoinLabel:React.FC<IBaseProps> = (iprops:IBaseProps)=>{
	const [color, setColor] = useState<string>("gray");
	const [label, setLabel] = useRecoilState(labelState)

	useEffect(()=>{
		if(label==="bitcoin"){
			setColor("")
		}else{
			setColor("gray")
		}
	},[label])

	return(
		<Button
			colorScheme="blackAlpha"
			fontSize="xl"
			onClick={()=>{setLabel("bitcoin")}}
			w={["32", "40"]}
		>
			<Text color={color}> <Trans> Bitcoin </Trans> </Text>
		</Button>

	);
}
export {BitcoinLabel};
