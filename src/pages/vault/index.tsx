import React from "react";
import {Center, Container, Text} from "@chakra-ui/layout";
import {useSelector} from "react-redux";
import { IBaseProps } from "../../interfaces/props";
import {pageState, StateType } from "../../reducers/state";
import {SignBoard} from "../../components/Board/signup";
import {SaveBoard} from "../../components/Board/save";
import {QueryBoard} from "../../components/Board/query";

const Vault:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const label= useSelector((state:StateType)=>state.page);

	return(
				<Center>
					<Container>
						<Center>
							<Text fontSize="4xl" fontWeight="extrabold">
								IN CRYPTO, WE TRUST
							</Text>
						</Center>
						{label === pageState.SIGNUP && <SignBoard />}
						{label === pageState.QUERY && <QueryBoard />}
						{label === pageState.SAVE && <SaveBoard />}
					</Container>
				</Center>
	);
}

export {Vault};
