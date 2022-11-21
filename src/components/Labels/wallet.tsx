import React from "react";
import {ButtonGroup} from "@chakra-ui/button";
import {Center} from "@chakra-ui/layout";
import {IBaseProps} from "../../interfaces/props";
import {BitcoinLabel} from "./bitcoin";
import {EthereumLabel} from "./ethereum";
import {WalletGeneratorSetting} from "../menu/brainwallet";

const WalletLabels:React.FC<IBaseProps>=(props:IBaseProps)=>{
	return(
		<Center>
			<ButtonGroup>
				<BitcoinLabel />
				<Center>
					<WalletGeneratorSetting />
				</Center>
				<EthereumLabel />
			</ButtonGroup>
		</Center>
	);
}

export {WalletLabels};
