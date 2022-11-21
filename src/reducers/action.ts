import {ActionModel, ActionType } from "./state";

export function signupSpacenameAction(isConnection:boolean, value:string):ActionModel {
	return{
		type: ActionType.SIGNUP_INPUT_SPACENAME,
		walletConnection:isConnection,
		spaceNameValue:value
	}
}

export function signupPasswordAction(isConnection:boolean, value:string):ActionModel {
	return {
		type: ActionType.SIGNUP_INPUT_PASSWORD,
		walletConnection: isConnection,
		passwordValue:value
	}
}

export function signupAction(isConnection:boolean):ActionModel {
    return {
        type: ActionType.CLICK_SIGNUP,
	    walletConnection:isConnection
    }
}

export function queryAction(isConnection:boolean):ActionModel {
    return {
        type:ActionType.CLICK_QUERY,
	    walletConnection: isConnection
    }
}

export function saveAction(isConnection:boolean):ActionModel {
    return {
        type:ActionType.CLICK_SAVE,
	    walletConnection:isConnection
    }
}

export function passwordAction(action:ActionType, isConnection:boolean):ActionModel {
	return{
		type:action,
		password:true,
		walletConnection:isConnection
	}
}

export function cancelPasswordAction(action:ActionType, isConnection:boolean):ActionModel {
	return {
		type: action,
		password:false,
		walletConnection:isConnection
	}
}

export function walletConnectionAction(action:ActionType, isConnection:boolean):ActionModel {
	return {
		type:action,
		walletConnection:isConnection
	}
}