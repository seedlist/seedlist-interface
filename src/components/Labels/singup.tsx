import React, { useMemo, useState} from "react";
import {Button} from "@chakra-ui/button";
import {Tooltip} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {signupAction} from "../../reducers/action";
import {Trans} from "@lingui/macro";
import {Text} from "@chakra-ui/layout";
import {IBaseProps} from "../../interfaces/props";
import { pageState, StateType} from "../../reducers/state";

const SignupLabel:React.FC<IBaseProps> = (props:IBaseProps) =>{
    const dispatch = useDispatch();
	const isConnection = useSelector((state:StateType)=>state.walletConnection);
	const [color, setColor] = useState<string>("gray");
	const page = useSelector((state:StateType)=>state.page);

	useMemo(()=>{
		if(page === pageState.SIGNUP){
			setColor("")
		}
	},[page])

	const labelExplain = useMemo(()=>{
		return(
			<Trans>
				User have to create a private vault before save or query content.
			</Trans>
		)
	},[])

    return(
        <Tooltip placement="left" hasArrow={true} fontSize={18} bg={'#2b2d32'} label={labelExplain}>
            <Button
                colorScheme="blackAlpha"
                fontSize="xl"
                onClick={()=>dispatch(signupAction(isConnection))}
                w={["32", "40"]}
            >
	            <Text color={color}> <Trans> Create Vault </Trans> </Text>
            </Button>
        </Tooltip>
    );
}
export {SignupLabel};