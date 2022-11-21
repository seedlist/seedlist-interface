import {Wallet} from "ethers";

export interface ICryptoMachine {
	getMainWallet(vaultName:string, password:string):Wallet;
	encryptoLabel(vaultName:string, password:string, label:string):string;
	decryptoLabel(vaultName:string, password:string, encryptoLabel:string):string;

	encryptoContent(vaultName:string, password:string, content:string):string;
	decryptoContent(vaultName:string, password:string, encryptoContent:string):string;
}