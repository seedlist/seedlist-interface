import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {etherClient, IWalletInfo} from '../../ethers/etherClient';
import {Trans} from "@lingui/macro";
import {Box} from "@chakra-ui/layout";
import {Button} from "@chakra-ui/button";
import {Image} from "@chakra-ui/react";
import {IBaseProps} from "../../interfaces/props";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "../../reducers/state";
import { walletConnectionAction} from "../../reducers/action";
import {useRecoilState} from "recoil";
import {chainIdState, tokenReceiverAddr} from "../../hooks/Atoms";

const WalletInfo: React.FC<IBaseProps> = (props:IBaseProps) => {
    const [walletInfo, setWalletInfo] = useState<IWalletInfo | null>(null);
	const action = useSelector((state:StateType)=>state.action);
	const [, setReceiverAddr] = useRecoilState(tokenReceiverAddr)
	const dispatch = useDispatch();
	const [chainId, setChainId] = useRecoilState(chainIdState);
	const [chainName, setChainName] = useState<string>("")

	useMemo(()=>{
/*
		if(walletInfo?.networkName==="bnb"){
			setChainName("BNB")
			setChainId(56)
		}
		if(walletInfo?.networkName==="homestead"){
			setChainName("ETH")
			setChainId(1)
		}
		if(walletInfo?.networkName==="matic"){
			setChainName("MATIC")
			setChainId(137)
		}
*/
		if(walletInfo?.chainId===3666){
			setChainName("Joule");
			setChainId(3666);
		}
	},[walletInfo?.chainId])

	useMemo(()=>{
		if(walletInfo?.address!==undefined){
			setReceiverAddr(walletInfo?.address)
		}
	},[walletInfo?.address])

	useMemo(()=>{
		console.log("chainid:", chainId);
		console.log("walletInfo.chainId:", walletInfo?.chainId);
		if(3666===walletInfo?.chainId){
			dispatch(walletConnectionAction(action, true));
		}else{
			console.log("====================")
			dispatch(walletConnectionAction(action, false));
		}
	}, [dispatch, walletInfo?.chainId, action, chainId]);

	useEffect(() => {
        const doSetWalletInfo = () => {
            doGetWalletInfo().then(
                (info) => {
                    if (info) {
	                    setWalletInfo(info);
                    }
                })
                .catch(() => {
                    /** ignore */
                })
                .finally(() => {
	                // setLoaded(true);
                });
        };
        doSetWalletInfo();
    }, []);


    async function connectWallet() {
        let info = await doGetWalletInfo();
    }

    return (
        <Box>
            <Button colorScheme="blackAlpha" bg="#2b2d32"
                    boxShadow="sm" onClick={connectWallet}
                    isLoading={false} >
	            {walletInfo && walletInfo.chainId === chainId&&(<>{chainName}</>)}
	            <Image src="./metamask.svg" width="22" height="22" />

                { !walletInfo && <div> <Trans> Use Joule Mainnet</Trans> </div>}

                {walletInfo && walletInfo.chainId !== chainId && (
	                <div> <Trans>Use Joule Mainnet</Trans> </div>
                )}

                {walletInfo && walletInfo.chainId === chainId &&(
					<div>
						{walletInfo.address.substr(0, 6)}...{walletInfo.address.substr(-4)}
					</div>
                )}
            </Button>
        </Box>
    );
};

export async function doGetWalletInfo() {
    await etherClient.loadProvider();
    return await etherClient.getWalletInfo();
}

export default WalletInfo;
