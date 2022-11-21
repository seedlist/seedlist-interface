import React, {useCallback, useMemo} from "react";
import {Button} from "@chakra-ui/button";
import {NotAllowedIcon, WarningIcon} from "@chakra-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {passwordAction} from "../../reducers/action";
import {Trans} from "@lingui/macro";
import {IBaseProps} from "../../interfaces/props";
import {ActionType, StateType} from "../../reducers/state";

const SaveButton:React.FC<IBaseProps> = (props:IBaseProps)=>{
    const dispatch = useDispatch();

	const isConnection = useSelector((state:StateType)=>state.walletConnection);
    const doSave = useCallback(()=>{
    	dispatch(passwordAction(ActionType.CLICK_SAVE, isConnection));
    },[dispatch]);

    const activeButton = useMemo(()=>{
	    return (
		    <>
			    <Button width="100%" colorScheme="blackAlpha"
			            size="lg" disabled={true} onClick={doSave} >
				    <NotAllowedIcon w={5} h={5} color=".500"/>
				    <Trans>Add More</Trans>
			    </Button>
			    <Button
				    width="100%"
				    colorScheme="blackAlpha"
				    size="lg"
				    onClick={()=>doSave() }
			    >
				    <Trans>Let's Save</Trans>
			    </Button>
		    </>
	    );

    },[isConnection]);

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

    },[isConnection]);

	return(
		<>
			{isConnection===true && activeButton}
			{isConnection!==true && inactiveButton}
		</>
	);
}

export {SaveButton};
