import React from "react";
import {IBaseProps} from "../interfaces/props";
import {Provider} from "react-redux"
import {newStore} from "./store";

const ReduxProvider:React.FC<IBaseProps> = (props:IBaseProps)=>{
    return(
        <Provider store={newStore()}>
            {props.children}
        </Provider>
    );
}

export {ReduxProvider}