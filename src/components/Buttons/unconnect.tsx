import React from "react";
import { Button } from "@chakra-ui/button";
import {WarningIcon} from "@chakra-ui/icons";
import {IBaseProps} from "../../interfaces/props";
import {Trans} from "@lingui/macro";

const DisconnectButton:React.FC<IBaseProps> = (props:IBaseProps) =>{
    return(

    <Button width="100%" colorScheme="blackAlpha" disabled={true} size="lg" >
        <WarningIcon w={5} h={5} color="red.500" />
        <Trans>Please connect wallet firstly </Trans>
    </Button>
);
}
export { DisconnectButton };