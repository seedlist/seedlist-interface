import React, {useMemo, useState} from "react";
import {IBaseProps} from "../../../interfaces/props";
import {useRecoilState} from "recoil";
import {puzzleState} from "../../../hooks/Atoms";
import {languageState} from "../../../hooks/Atoms";
import {Box, Stack, VStack} from "@chakra-ui/layout";
import {TextInput} from "../textinput";
import {useSelector} from "react-redux";
import {StateType} from "../../../reducers/state";

const NostridPuzzleArea:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const [puzzleValue, setPuzzleValue] = useState<string>("")
	const [, setPuzzle] = useRecoilState(puzzleState)
	const isConnection = useSelector((state:StateType)=>state.walletConnection);
	const handlePuzzleChange = (event: React.FormEvent<HTMLInputElement>)=>{
		setPuzzleValue(event.currentTarget.value)
		setPuzzle(event.currentTarget.value)
	}

	const [lang, ] = useRecoilState(languageState)
	const [phraseHolder, setPhraseHolder]	= useState<string>("enter your stronger phrase ...")
	useMemo(()=>{
		if(lang==='zh-CN'){
			setPhraseHolder("请输入amazon.j竞标价 ...")
		}

		if(lang==='en-US'){
			setPhraseHolder("enter amazon.j price ...")
		}
	},[lang])


	return(
		<VStack spacing={0}  color="black">
			<Box
				w="100%"
				bg="whiteAlpha"
				p={4}
				borderRadius={8}
				boxShadow="lg"
			>
				<Stack spacing={2} width={"450px"}>
					<TextInput
						placeholder={phraseHolder}
						type={'number'}
						disabled={!isConnection}
						value={puzzleValue}
						onChange={handlePuzzleChange}
					/>
				</Stack>
			</Box>
		</VStack>

	);
}
export {NostridPuzzleArea};
