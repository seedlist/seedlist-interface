import React, {useCallback, useMemo} from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useSelector} from "react-redux";
import {StateType} from "../../reducers/state";
import {WarningIcon} from "@chakra-ui/icons";
import {CryptoMachine2022} from "../../lib/crypto";
import {useSuccessToast, useWarningToast} from "../../hooks/useToast";
import {etherClient} from "../../ethers/etherClient";
import {useRecoilState} from "recoil";
import {chainIdState, languageState, signupBtnIsLoadingState} from "../../hooks/Atoms";

const SignupButton:React.FC<IBaseProps> = (props:IBaseProps) => {
	const isConnection = useSelector((state:StateType)=>state.walletConnection);

	const successToast = useSuccessToast();
	const warningToast = useWarningToast();
	const spaceName = useSelector((state:StateType)=>state.spaceNameValue);
	const password = useSelector((state:StateType)=>state.passwordValue);
	const [lang, ] = useRecoilState(languageState);
	const [chainId, ] = useRecoilState(chainIdState);
	const [signupIsLoading, setSignupIsLoading] = useRecoilState(signupBtnIsLoadingState);

	const signup = useCallback(async ()=>{
		setSignupIsLoading(true);
		if(spaceName===undefined || password===undefined || spaceName === "" || password===""){
			if(lang === "en-US"){
				warningToast("Vault name and password is EMPTY")
			}

			if(lang === "zh-CN"){
				warningToast("保险库名称或密钥不允许为空")
			}
			setSignupIsLoading(false);
			return
		}

		if(spaceName.length<8 || password.length<8){
			if(lang === "en-US"){
				warningToast("content length must more than 8 chars")
			}

			if(lang === "zh-CN"){
				warningToast("内容长度必须大于8位")
			}
			setSignupIsLoading(false);
			return

		}

		let encryptor = new CryptoMachine2022(spaceName, password, chainId);
		etherClient.connectSeedlistContract()
		etherClient.connectSigner()
		if(!etherClient.client){
			if(lang === "en-US"){
				warningToast("Wallet Maybe ERROR")
			}

			if(lang === "zh-CN"){
				warningToast("钱包连接出错")
			}
			setSignupIsLoading(false);
			return;
		}
		await encryptor.generateWallet(spaceName, password);
		let params = await encryptor.calculateVaultHasRegisterParams();
		let res = await etherClient.client?.vaultHasRegister(params.address, params.deadline, params.signature.r, params.signature.s, params.signature.v);
		if(res === true){
			if(lang === "en-US"){
				warningToast("Same information has been registed.");
			}
			if(lang==="zh-CN"){
				warningToast("相同的保险库名和密钥已被注册");
			}
			setSignupIsLoading(false);
			return;
		}

		let vaultParams = await encryptor.calculateInitVaultHubParams();
		try {
			let res0 = await etherClient.client?.initPrivateVault(vaultParams.address, vaultParams.signature.r, vaultParams.signature.s, vaultParams.signature.v ,vaultParams.deadline);
		}catch (e) {
			setSignupIsLoading(false);
			return;
		}
		let _params = await encryptor.calculateVaultHasRegisterParams()
		let _res = await etherClient.client?.vaultHasRegister(_params.address, _params.deadline, _params.signature.r, _params.signature.s, _params.signature.v);
		if(_res === true){
			if(lang==="zh-CN"){
				successToast("保险库空间名称注册成功");
			}
			if(lang=== "en-US"){
				successToast("Init Vault Spacename Success");
			}
		}else{
			if(lang==="zh-CN"){
				warningToast("保险库空间名称注册失败");
			}
			if(lang=== "en-US"){
				warningToast("Init Vault Spacename Fail");
			}

		}
		setSignupIsLoading(false);

	},[spaceName, password, chainId])

	const activeButton = useMemo(()=>{
		return(
			<Button
				colorScheme="blackAlpha"
				fontSize="xl"
				onClick={signup}
				isLoading={signupIsLoading}
				w="100%"
			>
				<Trans>Let's Create</Trans>
			</Button>
		);

	},[signup, signupIsLoading]);

	const inactiveButton = useMemo(()=>{
		return(
			<Button
				width="100%"
				colorScheme="blackAlpha"
				disabled={true}
				size="lg"
			>
				<WarningIcon w={5} h={5} color="red.500" /> <Trans> Please connect wallet firstly </Trans>
			</Button>
		);

	},[]);

	return(
		<>
			{isConnection===true && activeButton}
			{isConnection!==true && inactiveButton}
		</>
	);
}

export {SignupButton};
