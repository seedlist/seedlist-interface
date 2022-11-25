import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ethers} from 'ethers';
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter, DrawerCloseButton, Input, Checkbox, RadioGroup, Radio
} from "@chakra-ui/react";
import {Box, Stack, Text} from "@chakra-ui/layout";
import {Button} from "@chakra-ui/button";
import {useDispatch, useSelector} from "react-redux";
import {ActionType, StateType} from "../../reducers/state";
import {cancelPasswordAction} from "../../reducers/action";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";
import {useRecoilState} from "recoil";
import {
	languageState,
	tokenReceiverAddr,
	vaultNameState,
	labelNameState,
	savedContentState,
	vaultPasswordState, saveBtnIsLoadingState, chainIdState
} from "../../hooks/Atoms";
import { ChangeEvent } from "react";
import {TextInput} from "../TextInput/textinput";
import {CryptoMachine2022} from "../../lib/crypto";
import {etherClient, PrivateVaultEtherClient} from "../../ethers/etherClient";
import {useSuccessToast, useWarningToast} from "../../hooks/useToast";
import {ETHEREUM_SAVING_PRIVATE_DATA_FEE, SAVING_PRIVATE_DATA_FEE} from "../../constants/contract";
import {InfoIcon} from "@chakra-ui/icons";

const PasswordInSave:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const [isOpen, setOpen] = useState<boolean>(false)
	const dispatch = useDispatch();

	const isPassword = useSelector((state:StateType)=>state.password);
	const isConnection = useSelector((state:StateType)=>state.walletConnection);

	const [vaultName, ] = useRecoilState(vaultNameState);
	const [labelName, ] = useRecoilState(labelNameState);
	const [savedContent,] = useRecoilState(savedContentState);
	const [password, setPassword] = useRecoilState(vaultPasswordState);
	const [receiverAddr,] = useRecoilState(tokenReceiverAddr)
	const [lang, ] = useRecoilState(languageState)
	const [saveBtnLoading, setSaveBtnIsLoading] = useRecoilState(saveBtnIsLoadingState);
	const [chainId,] = useRecoilState(chainIdState);
	const [passwordHolder, setPasswordHolder]	= useState<string>("password ...")
	const [checked, setChecked] = useState<boolean>(false)
	const handleCheckChange = (event: ChangeEvent<HTMLInputElement>)=>setChecked(event.target.checked)
	const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>)=>setPassword(event.currentTarget.value)

	const warningToast = useWarningToast()
	const successToast = useSuccessToast()
	useMemo(()=>{
		if(lang==='zh-CN'){
			setPasswordHolder("密钥...")
		}

		if(lang==='en-US'){
			setPasswordHolder("password ...")
		}
	},[lang])

	const tokenReceiverAddress = useMemo(()=>{
		if(checked===false) return;
		return(
			<Stack spacing='24px'>
				<Box>
					<Text fontSize="15px" color="white">
						<Trans>Token Receiver: </Trans>
					</Text>
					<Input  id='username' placeholder={receiverAddr.substr(0,10)+" ... "+ receiverAddr.substr(-8)} />
					<Text marginY="10px" color="white">
						<Trans>Token Address:</Trans>
					</Text>
					<Text marginY="10px" color="white"> {process.env.REACT_APP_SEED_TOKEN_ADDR} </Text>
				</Box>
			</Stack>
		);
	},[checked])

	const economicModelDesc = useMemo(()=>{
		if(checked===false) return;
		return(
			<Box marginY="20px">
					<Text marginY="10px" color="white">
						<Trans>1. 21 million tokens are given to community users as an incentive cycle;</Trans>
					</Text>
					<Text marginY="10px" color="white">
						<Trans>2. Incentives are generated along with the user's storage behavior. If there is no storage, there will be no incentives;</Trans>
					</Text>
					<Text marginY="10px" color="white">
						<Trans>3. In the first cycle, the excitation amount is 2100 each time it is stored; </Trans>
					</Text>
					<Text marginY="10px" color="white">
						<Trans>4. When entering the next cycle, each excitation amount is half of the previous cycle;</Trans>
					</Text>
					<Text marginY="10px" color="white">
						<Trans>5. With each user's token incentive, a 10% increment will be issued to the treasury address;</Trans>
					</Text>
					<Text marginY="10px" color="white">
						<Trans>6. Using the displacement halving, the total amount of token incentives for a complete cycle is about 23.1 million;</Trans>
					</Text>
			</Box>
		)
	},[checked])

	useEffect(()=>{
		if(isPassword===true){
			setOpen(true);
		}
	},[isPassword])

	const doCancel = useCallback(()=>{
		dispatch(cancelPasswordAction(ActionType.CLICK_SAVE, isConnection))
		setOpen(isOpen)

		// clear memory data
	},[dispatch])

	const doSubmit = useCallback(async ()=>{
		setSaveBtnIsLoading(true);
		if(vaultName===undefined || password===undefined || savedContent === undefined || labelName===undefined ||
			vaultName==="" || password === "" || savedContent === "" || labelName === ""){
			if(lang==='zh-CN'){
				warningToast("输入内容不许为空,请检查")
			}

			if(lang==='en-US'){
				warningToast("Undefined input contents, check again")
			}
			setSaveBtnIsLoading(false);
			return
		}

		etherClient.connectSeedlistContract()
		etherClient.connectSigner()
		if(!etherClient.client){
			console.error("connect signer error in signup")
			setSaveBtnIsLoading(false);
			return;
		}
		let encryptor = new CryptoMachine2022(vaultName, password, chainId);
		await encryptor.generateWallet(vaultName, password);
		let params = await encryptor.calculateVaultHasRegisterParams();
		let res = await etherClient.client?.vaultHasRegister(params.address, params.deadline, params.signature.r, params.signature.s, params.signature.v);
		if(res === false){
			if(lang==='zh-CN'){
				warningToast("请您先注册空间名");
			}

			if(lang==='en-US'){
				warningToast("Regist vault name firstly");
			}
			setSaveBtnIsLoading(false);
			return;
		}
		let labelHash = await encryptor.labelHash(labelName);
		let labelExistParams = await encryptor.calculateLabelExistParams(labelHash);
		let exist:boolean = await etherClient.client?.labelExist(labelExistParams.address, labelHash, labelExistParams.deadline,
			labelExistParams.signature.r, labelExistParams.signature.s, labelExistParams.signature.v);

		if(exist === true){
			if(lang==='zh-CN'){
				warningToast("一个标签只能是用一次");
			}

			if(lang==='en-US'){
				warningToast("A label is forbidden used twice");
			}
			setSaveBtnIsLoading(false);
			return;
		}

		let totalItemsParams = await encryptor.calculateTotalSavedItemsParams();
		let total:number = await etherClient.client?.totalSavedItems(totalItemsParams.address, totalItemsParams.deadline, totalItemsParams.signature.r,
			totalItemsParams.signature.s, totalItemsParams.signature.v);

		let cryptoLabel = "";
		let cryptoContent = "";
		let contentPassword = "";
		let savingPrivateDataFee = 0;
		if(chainId===1){
			savingPrivateDataFee = ETHEREUM_SAVING_PRIVATE_DATA_FEE;
		}else{
			savingPrivateDataFee = SAVING_PRIVATE_DATA_FEE;
		}

		if(total <=0 ){
			cryptoLabel = encryptor.getEncryptLabel(vaultName, password, labelName);
			contentPassword = encryptor.getContentPassword(vaultName, password, labelName);
		}else{
			let deLabels = await encryptor.getSomeDecryptLabels(etherClient, vaultName, password, total)	;
			let wheelLabels = "";
			for(let j=0;j<total;j++){
				wheelLabels = wheelLabels + deLabels.get(j);
			}
			let wheelPassword = encryptor.getWheelLabelPassword(vaultName, password, wheelLabels);
			contentPassword = encryptor.getContentPassword(vaultName, password, wheelLabels+labelName);
			cryptoLabel = encryptor.encryptMessage(labelName, wheelPassword);
		}
		cryptoContent = await encryptor.multiEncryptMessage(savedContent, contentPassword);

		if(checked === true){
			let hasMintedParams = await  encryptor.calculateHasMintedParams();
			let hasMintedRes = await etherClient.client?.hasMinted(hasMintedParams.address, hasMintedParams.deadline, hasMintedParams.signature.r,
				hasMintedParams.signature.s, hasMintedParams.signature.v);
			if(hasMintedRes === true){
				if(lang==='zh-CN'){
					warningToast("一个存储空间，只能参与一次通证铸造");
				}
				if(lang==='en-US'){
					warningToast("Mint only once with same vault name");
				}
				setSaveBtnIsLoading(false);
				return
			}

			let mintedSaveParams = await encryptor.calculateSaveWithMintingParams(cryptoContent, cryptoLabel, labelHash, receiverAddr);
			try {
				let mintedSaveRes = await etherClient.client?.saveDataWithMinting(mintedSaveParams.address, cryptoContent, cryptoLabel, labelHash,
					receiverAddr, mintedSaveParams.deadline, mintedSaveParams.signature.r,
					mintedSaveParams.signature.s, mintedSaveParams.signature.v,{value:savingPrivateDataFee});
			}catch (e) {
				setSaveBtnIsLoading(false);
				return;
			}

			if(lang==='zh-CN'){
				successToast("存储成功，并完成通证铸造");
			}

			if(lang==='en-US'){
				successToast("save with mint success");
			}
			setSaveBtnIsLoading(false);
		}else{
			let saveParams = await encryptor.calculateSaveWithoutMintingParams(cryptoContent, cryptoLabel, labelHash);
			try {
				let saveRes = await etherClient.client?.saveDataWithoutMinting(saveParams.address, cryptoContent, cryptoLabel, labelHash,
					saveParams.deadline, saveParams.signature.r,
					saveParams.signature.s, saveParams.signature.v, {value:savingPrivateDataFee});
			}catch (e) {
					setSaveBtnIsLoading(false);
					return;
			}

			if(lang==='zh-CN'){
				successToast("存储成功");
			}

			if(lang==='en-US'){
				successToast("save success");
			}
			setSaveBtnIsLoading(false);
		}

	},[vaultName, savedContent, labelName, password, receiverAddr, checked, chainId])

	return(
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={doCancel}
			closeOnOverlayClick={false}
			size = "sm"
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader borderBottomWidth='1px'>

					<Text fontSize="18px" color="white">
						<Trans> Please enter your password </Trans>
					</Text>
				</DrawerHeader>

				<DrawerBody>
					<Stack spacing='24px'>
						<Box>
							<Text fontSize="18px" color="white"> </Text>
							<TextInput
								placeholder={passwordHolder}
								type={'password'}
								value={password}
								onChange={handlePasswordChange}
							/>

						</Box>
					</Stack>


					<Stack spacing='30px' marginY='20px'>
						<Box>
							<Checkbox
								size='md'
								colorScheme='orange'
								isChecked={checked}
								onChange={handleCheckChange}
							>
								<Text color="white">
									<Trans>I want to mint seed incentive token</Trans>
								</Text>
							</Checkbox>
							{economicModelDesc}
							{tokenReceiverAddress}
						</Box>
					</Stack>

				</DrawerBody>

				<DrawerFooter borderTopWidth='1px'>
					<Button variant='outline' colorScheme='whiteAlpha' mr={3} onClick={doCancel}>
						<Trans>Cancel</Trans>
					</Button>
					<Button colorScheme='blackAlpha' isLoading={saveBtnLoading} mr={3} onClick={doSubmit}>
						<Trans>Submit</Trans>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
export {PasswordInSave};
