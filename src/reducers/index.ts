import {ActionModel, ActionType, pageState, StateType} from "./state";

function initializeState():StateType {
    return {
        page: pageState.SIGNUP,
	    action:ActionType.CLICK_SIGNUP,
	    walletConnection:false
    }
}

let initialState: StateType = initializeState();

function reducers(state=initialState , action: ActionModel) {
    let newState:StateType = {...state};

    switch (action.type) {
        case ActionType.CLICK_SIGNUP:
            newState.page = pageState.SIGNUP
	        newState.action = ActionType.CLICK_SIGNUP
	        newState.walletConnection = action.walletConnection
            break

	    case ActionType.SIGNUP_INPUT_SPACENAME:
	    	newState.page = pageState.SIGNUP
		    newState.action = ActionType.SIGNUP_INPUT_SPACENAME
		    newState.walletConnection = action.walletConnection
		    newState.spaceNameValue = action.spaceNameValue
		    break

	    case ActionType.SIGNUP_INPUT_PASSWORD:
		    newState.page = pageState.SIGNUP
		    newState.action = ActionType.SIGNUP_INPUT_PASSWORD
		    newState.walletConnection = action.walletConnection
		    newState.passwordValue = action.passwordValue
		    break

	    case ActionType.CLICK_QUERY:
            newState.page = pageState.QUERY
	        newState.action = ActionType.CLICK_QUERY
            newState.password = action.password
	        newState.walletConnection = action.walletConnection
            break

        case ActionType.CLICK_SAVE:
            newState.page = pageState.SAVE
	        newState.action = ActionType.CLICK_SAVE
            newState.password = action.password
	        newState.walletConnection = action.walletConnection
            break

        default:
            return state;
    }

    return newState;
}

export {reducers}
