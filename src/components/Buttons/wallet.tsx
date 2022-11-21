import React, {useCallback, useState} from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {
	bitcoinWalletState, chainIdState,
	ethereumWalletState,
	generatorState,
	labelState, languageState,
	vaultNameState,
	vaultPasswordState
} from "../../hooks/Atoms";
import {puzzleState} from "../../hooks/Atoms";
import {useWarningToast} from "../../hooks/useToast";
import {etherClient} from "../../ethers/etherClient";
import {CryptoMachine2022} from "../../lib/crypto";

const WalletButton:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const [label,] = useRecoilState(labelState)
	const [puzzle,] = useRecoilState(puzzleState)
	const [vaultName,] = useRecoilState(vaultNameState);
	const [password, ] = useRecoilState(vaultPasswordState);
	const [, setBitcoinWallet] = useRecoilState(bitcoinWalletState);
	const [, setEthereumWallet] = useRecoilState(ethereumWalletState);
	const [generator, ] = useRecoilState(generatorState);
	const [lang, ] = useRecoilState(languageState)
	const [chainId, ] = useRecoilState(chainIdState);
	const warningToast = useWarningToast()
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const doClick = useCallback(async ()=>{
		if(generator === "puzzle"){
			if(puzzle==="" || puzzle===undefined){
				if(lang==="zh-CN"){
					warningToast("密码短语不许为空")
				}
				if(lang==="en-US"){
					warningToast("Puzzle not allow empty")
				}
				return;
			}

			if(puzzle.length<16){
				if(lang==="zh-CN"){
					warningToast("密码短语长度最少16位")
				}
				if(lang==="en-US"){
					warningToast("Puzzle length must more than 16 chars")
				}
				return;
			}
		}

		if(generator === "entropy"){
			setIsLoading(true);
			if(vaultName==="" || password==="" || vaultName===undefined || password===undefined){
				if(lang==="zh-CN"){
					warningToast("保险库名称及密码不许为空")
				}
				if(lang==="en-US"){
					warningToast("Vault name and password not allow empty")
				}
				setIsLoading(false);
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
				setIsLoading(false);
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
				setIsLoading(false);
				return;
			}

		}

		if(label==="ethereum"){
			setEthereumWallet(true);
			setBitcoinWallet(false);
		}
		if(label==="bitcoin"){
			setBitcoinWallet(true);
			setEthereumWallet(false);
		}
		setIsLoading(false);
	},[label, puzzle, generator, lang, vaultName, password, chainId])

	return(
		<Button
			colorScheme="blackAlpha"
			fontSize="xl"
			onClick={()=>doClick()}
			isLoading={isLoading}
			w="100%"
		>
			<Trans>Let's Generate </Trans>
		</Button>
	);
}

export {WalletButton};
