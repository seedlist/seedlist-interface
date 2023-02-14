import React, {useCallback, useMemo } from "react";
import {Button} from "@chakra-ui/button";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {useRecoilState} from "recoil";
import {
	biddingPriceState,
	 chainIdState,
	generatorState, genNostridWaitingState,
	 languageState, nowPriceState,
} from "../../hooks/Atoms";
import {puzzleState} from "../../hooks/Atoms";
import {useWarningToast} from "../../hooks/useToast";
import {WarningIcon} from "@chakra-ui/icons";
import {useSelector} from "react-redux";
import {StateType} from "../../reducers/state";

const NostridGeneratorButton:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const isConnection = useSelector((state:StateType)=>state.walletConnection);
	const [lang, ] = useRecoilState(languageState)
	const [chainId, ] = useRecoilState(chainIdState);
	const warningToast = useWarningToast()
	const [biddingPrice,] = useRecoilState(biddingPriceState);
	const [nowPrice, setNowPrice] = useRecoilState(nowPriceState);

	const doClick = useCallback(async ()=>{
		if(biddingPrice===0 || biddingPrice===undefined){
			if(lang==="zh-CN"){
				warningToast("价格不许为空")
			}
			if(lang==="en-US"){
				warningToast("Price not allow empty")
			}
			return;
		}

		if(biddingPrice <= nowPrice){
			if(lang === "zh-CN"){
				warningToast("出价必须高于当前价格");
			}

			if(lang === "en-US"){
				warningToast("Bidding price need more than current");
			}

			return;
		}
		setNowPrice(biddingPrice);


		if(lang === "zh-CN"){
			warningToast("出价成功");
		}

		if(lang === "en-US"){
			warningToast("Bidding Price Success");
		}

		return;



	},[biddingPrice, lang, chainId])

	const activeButton = useMemo(()=>{
		return(
			<Button
				colorScheme="blackAlpha"
				fontSize="xl"
				onClick={()=>doClick()}
				w="100%"
			>
				<Trans>Let's Race </Trans>
			</Button>
		);

	},[doClick]);

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
			{isConnection===false && inactiveButton}
		</>
	);


}

export {NostridGeneratorButton};
