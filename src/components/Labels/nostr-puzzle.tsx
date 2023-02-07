import React, {useState, useEffect} from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {generatorState, labelState, nostrLabelState} from "../../hooks/Atoms";
import {Text} from "@chakra-ui/layout";


const NostrPuzzleLabel:React.FC<IBaseProps> = (iprops:IBaseProps)=>{
	const [color, setColor] = useState<string>("gray");
	const [label, setNostrLabel] = useRecoilState(nostrLabelState)
	const [,setGeneratorState] = useRecoilState(generatorState);
	useEffect(()=>{
		console.log("label:",label);
		if(label==="nostr-puzzle"){
			setColor("")
			setGeneratorState("puzzle");
		}else{
			setColor("gray")
		}
	},[label])

	return(
		<Button
			colorScheme="blackAlpha"
			fontSize="xl"
			onClick={()=>{setNostrLabel("nostr-puzzle")}}
			w={["32", "60"]}
		>
			<Text color={color}> <Trans> Base on Puzzle </Trans> </Text>
		</Button>

	);
}
export {NostrPuzzleLabel};
