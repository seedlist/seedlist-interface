import React from "react";
import {SignupButton} from "./signup";
import {SaveButton} from "./save";
import {QueryButton} from "./query";
import {useSelector} from "react-redux";
import {pageState, StateType} from "../../reducers/state";
import {IBaseProps} from "../../interfaces/props";

const Buttons:React.FC<IBaseProps> = (props:IBaseProps) => {
    const label = useSelector((state:StateType)=>state.page);

    return(
        <>
            {label === pageState.SIGNUP && <SignupButton />}
            {label === pageState.SAVE && <SaveButton />}
            {label === pageState.QUERY && <QueryButton />}
        </>
    );
}

export {Buttons};