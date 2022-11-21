import {Store} from "redux"

export enum ActionType {
    CLICK_SIGNUP = 'signup',
    CLICK_SAVE = 'save',
    CLICK_QUERY = 'query',
    INPUT_PASSWORD = 'save-password',
	SIGNUP_INPUT_SPACENAME = 'signup-input-spacename',
	SIGNUP_INPUT_PASSWORD = 'signup-input-password'
}

export enum pageState {
    DISCONNECT,
    SIGNUP,
    SAVE,
    QUERY,
    PASSWORD,
}

export interface StateType {
    page:pageState,
	action:ActionType,
    password?: boolean,
    walletConnection:boolean
	spaceNameValue?: string
	passwordValue?: string
	labelValue?: string
	contentValue?: string
}

export interface ActionModel {
    type: ActionType,
	page?: pageState,
    password?: boolean,
    walletConnection: boolean
	spaceNameValue?: string
	passwordValue?: string
	labelValue?: string
	contentValue?: string
}

export type StoreType = Store<StateType, ActionModel>;
