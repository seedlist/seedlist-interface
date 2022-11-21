import React from "react";
import{QueryLabel} from "./query";
import {SaveLabel} from "./save";
import {SignupLabel} from "./singup";
import {ButtonGroup} from "@chakra-ui/button";
import {Center} from "@chakra-ui/layout";
import {IBaseProps} from "../../interfaces/props";

const Labels:React.FC<IBaseProps>=(props:IBaseProps)=>{
    return(
        <Center>
            <ButtonGroup spacing="1">
                <SignupLabel />
                <SaveLabel />
                <QueryLabel />
            </ButtonGroup>
        </Center>
    );
}

export {Labels};