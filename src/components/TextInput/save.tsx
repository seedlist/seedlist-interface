import {Box, HStack, Stack, VStack} from "@chakra-ui/layout";
import {TextInput} from "./textinput";
import React, {useMemo, useState} from "react";
import {IBaseProps} from "../../interfaces/props";
import {useSelector} from "react-redux";
import {StateType} from "../../reducers/state";
import {useRecoilState} from "recoil";
import {languageState, labelNameState, vaultNameState, savedContentState} from "../../hooks/Atoms";

const SaveArea:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const isConnection = useSelector((state:StateType)=>state.walletConnection);

	const [lang, ] = useRecoilState(languageState)
	const [content, setContent] = useRecoilState(savedContentState);
	const [labelName, setLabelName] = useRecoilState(labelNameState);
	const [vaultName, setVaultName] = useRecoilState(vaultNameState);

	const [vaultNameHolder, setVaultNameHolder]	= useState<string>("Enter vault name ...")
	const [labelHolder, setLabelHolder] = useState<string>("label ...")
	const [contentHolder, setContentHolder] = useState<string>("saved content ...")

	const handleVaultNameChange = (event: React.FormEvent<HTMLInputElement>)=>setVaultName(event.currentTarget.value)
	const handleContentChange = (event: React.FormEvent<HTMLInputElement>)=>setContent(event.currentTarget.value)
	const handleLabelChange = (event: React.FormEvent<HTMLInputElement>)=>setLabelName(event.currentTarget.value)

	useMemo(()=>{
		if(lang==='zh-CN'){
			setVaultNameHolder("输入保险库空间名称 ...")
			setLabelHolder("标签名")
			setContentHolder("存储内容 ...")
		}

		if(lang==='en-US'){
			setVaultNameHolder("Enter vault name ...")
			setLabelHolder("label ...")
			setContentHolder("saved content ...")
		}
	},[lang, vaultName, labelName, content])

    return(
        <VStack spacing={0}  color="black">
            <Box
                w="100%"
                bg="whiteAlpha"
                p={4}
                borderRadius={8}
                boxShadow="lg"
            >
                <Stack spacing={2}>
                    <TextInput
	                    placeholder={vaultNameHolder}
	                    type={'text'}
	                    disabled={!isConnection}
	                    value={vaultName}
	                    onChange={handleVaultNameChange}
                    />
                </Stack>
            </Box>
            <Box
                w="100%"
                bg="whiteAlpha"
                p={4}
                borderRadius={8}
                boxShadow="lg"
            >
                <HStack spacing={2}>
                    <Box w="30%">
                        <TextInput
	                        placeholder={labelHolder}
	                        type={'text'}
	                        disabled={!isConnection}
	                        value={labelName}
	                        onChange={handleLabelChange}
                        />
                    </Box>

                    <Box w="70%">
                        <TextInput
	                        placeholder={contentHolder}
	                        type={'text'}
	                        disabled={!isConnection}
	                        value={content}
	                        onChange={handleContentChange}
                        />
                    </Box>

                </HStack>
            </Box>
        </VStack>

    );
}

export {SaveArea};