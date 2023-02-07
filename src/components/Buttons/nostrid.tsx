import React, {useCallback, useMemo, useState} from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {
	bitcoinWalletState, chainIdState,
	ethereumWalletState,
	generatorState, genNostridWaitingState,
	labelState, languageState, NostrIdsState, nostrLabelState,
	vaultNameState,
	vaultPasswordState
} from "../../hooks/Atoms";
import {puzzleState} from "../../hooks/Atoms";
import {useWarningToast} from "../../hooks/useToast";
import {etherClient} from "../../ethers/etherClient";
import {CryptoMachine2022} from "../../lib/crypto";
import {WarningIcon} from "@chakra-ui/icons";
import {useSelector} from "react-redux";
import {StateType} from "../../reducers/state";

const NostridGeneratorButton:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const isConnection = useSelector((state:StateType)=>state.walletConnection);
	const [label,] = useRecoilState(nostrLabelState)
	const [puzzle,] = useRecoilState(puzzleState)
	const [vaultName,] = useRecoilState(vaultNameState);
	const [password, ] = useRecoilState(vaultPasswordState);
	const [, setNostrIdsState] = useRecoilState(NostrIdsState);
	const [generator, ] = useRecoilState(generatorState);
	const [lang, ] = useRecoilState(languageState)
	const [chainId, ] = useRecoilState(chainIdState);
	const warningToast = useWarningToast()
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isGenNostridWaiting, setIsGenNostridWaiting] = useRecoilState<boolean>(genNostridWaitingState);

	const doClick = useCallback(async ()=>{
		if(generator === "puzzle"){
			if(puzzle==="" || puzzle===undefined){
				if(lang==="zh-CN"){
					warningToast("密码短语不许为空")
				}
				if(lang==="en-US"){
					warningToast("Puzzle not allow empty")
				}
				setIsGenNostridWaiting(false);
				return;
			}

			if(puzzle.length<16){
				if(lang==="zh-CN"){
					warningToast("密码短语长度最少16位")
				}
				if(lang==="en-US"){
					warningToast("Puzzle length must more than 16 chars")
				}
				setIsGenNostridWaiting(false);
				return;
			}
		}

		if(generator === "vault"){
			setIsGenNostridWaiting(true);
			if(vaultName==="" || password==="" || vaultName===undefined || password===undefined){
				if(lang==="zh-CN"){
					warningToast("保险库名称及密码不许为空")
				}
				if(lang==="en-US"){
					warningToast("Vault name and password not allow empty")
				}
				setIsGenNostridWaiting(false);
				return;
			}



			etherClient.connectSeedlistContract()
			etherClient.connectSigner()
			if(!etherClient.client){
				warningToast("connect signer error in signup")
				if(lang === "en-US"){
					warningToast("Wallet Maybe ERROR")
				}

				if(lang === "zh-CN"){
					warningToast("钱包连接出错")
				}
				setIsGenNostridWaiting(false);
				return;
			}

			let encryptor = new CryptoMachine2022(vaultName, password, chainId);
			await encryptor.generateWallet(vaultName, password);
			let params = await encryptor.calculateVaultHasRegisterParams();
			let res = await etherClient.client?.vaultHasRegister(params.address, params.deadline, params.signature.r, params.signature.s, params.signature.v);
			if(res === false){
				if(lang === "en-US"){
					warningToast("vault space does not exist, init firstly");
				}
				if(lang==="zh-CN"){
					warningToast("保险库空间不存在，请先注册");
				}
				setIsGenNostridWaiting(false);
				return;
			}

		}

		if(label==="nostr-vault" || label==="nostr-puzzle"){
			setIsGenNostridWaiting(true);
			setNostrIdsState(true);
			console.log("isGenNostridWaiting:", isGenNostridWaiting);
		}
		console.log("isGenNostridWaiting:", isGenNostridWaiting);
		//setIsLoading(false);
	},[label, puzzle,isGenNostridWaiting, generator, lang, vaultName, password, chainId])

	const activeButton = useMemo(()=>{
		return(
			<Button
				colorScheme="blackAlpha"
				fontSize="xl"
				onClick={()=>doClick()}
				isLoading={isGenNostridWaiting}
				w="100%"
			>
				<Trans>Let's Generate </Trans>
			</Button>
		);

	},[doClick, isGenNostridWaiting]);

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
			{isConnection!==true && generator==="vault" && inactiveButton}
			{isConnection!==true && generator==="puzzle" && activeButton}
		</>
	);


}

export {NostridGeneratorButton};
