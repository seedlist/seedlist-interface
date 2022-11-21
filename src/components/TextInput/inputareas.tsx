import React from "react";
import {QueryArea} from "./query";
import {SaveArea} from "./save";
import {SignupArea} from "./signup";
import {useSelector} from "react-redux";
import {pageState, StateType} from "../../reducers/state";
import {IBaseProps} from "../../interfaces/props";

const InputAreas:React.FC<IBaseProps> = (props:IBaseProps) => {
    const label = useSelector((state:StateType)=>state.page);

    return(
        <div>
            {label===pageState.SIGNUP && <SignupArea />}
            {label===pageState.SAVE && <SaveArea />}
            {label === pageState.QUERY && <QueryArea />}
        </div>
    );
}

export {InputAreas} ;