/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {VaultHub__factory, PrivateVault__factory} from "../types";
import { ethers, Signer, PayableOverrides } from "ethers";
import type { Web3Provider, Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";

//const EVOLUTION_CONTRACT_ADDRESS = "0x49e0e90064256a92AfCA34c513925ef3a14026C7";
// const provider = new ethers.providers.JsonRpcProvider(RPC_HOST)

export interface IWalletInfo {
    address: string;
    networkName: string;
    chainId: number;
    balance: string;
}
// rinkeby id
/*
export const contractChainId = 1500;
export const contractChainName = "Goerli";
*/

export class VaultHubEtherClient {
    seedlistContractAddress: string;
    winProvider?: any;
    provider?: Web3Provider;
    client?: SeedlistClient;
    //     readonly onAccountsDidChange = new Emitter<string[]>();
    //     onAccountsChange = this.onAccountsDidChange.event;

    constructor(seedlistContractAddress: string) {
        this.seedlistContractAddress = seedlistContractAddress;
    }

    async loadProvider() {
        if (this.provider) {
            return;
        }
        this.winProvider = await detectEthereumProvider();
        if (this.winProvider) {
            // change event bind
            this.winProvider.on("accountsChanged", (accounts: string[]) => {
                // this.onAccountsDidChange.fire(accounts);
	            window.location.reload();
            });
            this.winProvider.on("chainChanged", () => {
                window.location.reload();
            });
            this.provider = new ethers.providers.Web3Provider(this.winProvider);
            return;
        }
        throw new Error("there are no eth provider.");
    }

    async getWalletInfo(): Promise<IWalletInfo | undefined> {
        if (this.provider) {
            await this.winProvider.request({ method: "eth_requestAccounts" });
            const address = await this.provider.getSigner().getAddress();
            const balance = await this.provider.getBalance(address);
            const network = await this.provider.getNetwork();
            return {
                address,
                networkName: network.name,
                chainId: network.chainId,
                balance: ethers.utils.formatEther(balance),
            };
        }
        throw new Error("get wallet info failed");
    }

    connectSeedlistContract() {
        if (this.provider) {
            this.client = new SeedlistClient();
            this.client.connectProvider(this.seedlistContractAddress, this.provider);
            this.client.setWaitConfirmations(1);
        }
    }

    connectSigner() {
        if (this.client && this.provider) {
            this.client.setWaitConfirmations(1);
            const signer = this.provider.getSigner();
            this.client.connectSigner(signer);
        }
    }

    resetClientConfirmations() {
        if (this.client) {
            this.client.setWaitConfirmations(1); // set number of confirmations to wait default is 5 blocks
        }
    }
}

class SeedlistClient {
	private seedlist: any | undefined;
	private provider: Provider | undefined;
	private signer: Signer | undefined;
	private _waitConfirmations = 3;

	constructor() {
		this._waitConfirmations = 3;
	}

	public connectProvider(address: string, provider: Provider): SeedlistClient {
		this.provider = provider;
		this.seedlist = VaultHub__factory.connect(address, this.provider);

		return this;
	}

	public connectSigner(signer: Signer): SeedlistClient {
		this.signer = signer;
		return this;
	}

	public setWaitConfirmations(num: number): void {
		this._waitConfirmations = num;
	}

	public contract(): Promise<any> {
		if (this.provider === undefined || this.seedlist === undefined) {
			return Promise.reject("need to connect a valid provider");
		}
		return Promise.resolve(this.seedlist);
	}

	public async initPrivateVault(
		addr:string,
		r:string, s:string, v:number, deadline:number,
		config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		const gas=await this.seedlist.connect(this.signer).estimateGas.initPrivateVault( addr, deadline, v, r, s, {...config})

		const transaction = await this.seedlist.connect(this.signer).initPrivateVault(
			addr, deadline, v, r, s, { gasLimit:gas.mul(13).div(10), ...config })

		const receipt = await transaction.wait(this._waitConfirmations);
		return receipt;
	}

	public async vaultHasRegister(addr:string, deadline:number, r:string,
	                              s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.vaultHasRegister(addr, deadline, v, r, s);
	}

	public async saveDataWithMinting(
		addr:string, data:string, cryptoLabel:string, labelHash:string, receiver:string, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		const gas=await this.seedlist.connect(this.signer).estimateGas.savePrivateDataWithMinting( addr, data, cryptoLabel, labelHash, receiver, deadline, v, r, s, {...config})

		const transaction = await this.seedlist.connect(this.signer).savePrivateDataWithMinting(
			addr, data, cryptoLabel, labelHash, receiver, deadline, v, r, s, { gasLimit:gas.mul(13).div(10), ...config })

		const receipt = await transaction.wait(this._waitConfirmations);
		return receipt;
	}

	public async saveDataWithoutMinting(
		addr:string, data:string, cryptoLabel:string, labelHash:string, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		const gas=await this.seedlist.connect(this.signer).estimateGas.savePrivateDataWithoutMinting( addr, data, cryptoLabel, labelHash, deadline, v, r, s, {...config})

		const transaction = await this.seedlist.connect(this.signer).savePrivateDataWithoutMinting(
			addr, data, cryptoLabel, labelHash, deadline, v, r, s, { gasLimit:gas.mul(13).div(10), ...config })

		const receipt = await transaction.wait(this._waitConfirmations);
		return receipt;
	}

	public async labelName(addr:string ,index:number, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.getLabelNameByIndex(addr, deadline, index, v, r, s);
	}

	public async queryDataByIndex(addr:string ,index:number, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.queryPrivateDataByIndex(addr, index, deadline, v, r, s);
	}

	public async queryDataByLabelName(addr:string ,labelHash:string, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.queryPrivateDataByName(addr, labelHash, deadline, v, r, s);
	}

	public async hasMinted(addr:string, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.hasMinted(addr, deadline, v, r, s);
	}

	public async totalSavedItems(addr:string, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.totalSavedItems(addr, deadline, v, r, s);
	}

	public async labelExist(addr:string, labelHash:string, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.labelExist(addr, labelHash, deadline, v, r, s);
	}

	public async queryPrivateVaultAddress(addr:string, deadline:number, r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.queryPrivateVaultAddress(addr, deadline, v, r, s);
	}
	//end
}

export class PrivateVaultEtherClient {
	seedlistContractAddress: string;
	winProvider?: any;
	provider?: Web3Provider;
	client?: PrivateVaultClient;
	//     readonly onAccountsDidChange = new Emitter<string[]>();
	//     onAccountsChange = this.onAccountsDidChange.event;

	constructor(seedlistContractAddress: string) {
		this.seedlistContractAddress = seedlistContractAddress;
	}

	async loadProvider() {
		if (this.provider) {
			return;
		}
		this.winProvider = await detectEthereumProvider();
		if (this.winProvider) {
			// change event bind
			this.winProvider.on("accountsChanged", (accounts: string[]) => {
				// this.onAccountsDidChange.fire(accounts);
			});
			this.winProvider.on("chainChanged", () => {
				window.location.reload();
			});
			this.provider = new ethers.providers.Web3Provider(this.winProvider);
			return;
		}
		throw new Error("there are no eth provider.");
	}

	async getWalletInfo(): Promise<IWalletInfo | undefined> {
		if (this.provider) {
			await this.winProvider.request({ method: "eth_requestAccounts" });
			const address = await this.provider.getSigner().getAddress();
			const balance = await this.provider.getBalance(address);
			const network = await this.provider.getNetwork();
			return {
				address,
				networkName: network.name,
				chainId: network.chainId,
				balance: ethers.utils.formatEther(balance),
			};
		}
		throw new Error("get wallet info failed");
	}

	connectSeedlistContract() {
		if (this.provider) {
			this.client = new PrivateVaultClient();
			this.client.connectProvider(this.seedlistContractAddress, this.provider);
			this.client.setWaitConfirmations(1);
		}
	}

	connectSigner() {
		if (this.client && this.provider) {
			this.client.setWaitConfirmations(1);
			const signer = this.provider.getSigner();
			this.client.connectSigner(signer);
		}
	}

	resetClientConfirmations() {
		if (this.client) {
			this.client.setWaitConfirmations(1); // set number of confirmations to wait default is 5 blocks
		}
	}
}

class PrivateVaultClient {
	private seedlist: any | undefined;
	private provider: Provider | undefined;
	private signer: Signer | undefined;
	private _waitConfirmations = 3;

	constructor() {
		this._waitConfirmations = 3;
	}

	public connectProvider(address: string, provider: Provider): PrivateVaultClient {
		this.provider = provider;
		this.seedlist = PrivateVault__factory.connect(address, this.provider);

		return this;
	}

	public connectSigner(signer: Signer): PrivateVaultClient {
		this.signer = signer;
		return this;
	}

	public setWaitConfirmations(num: number): void {
		this._waitConfirmations = num;
	}

	public contract(): Promise<any> {
		if (this.provider === undefined || this.seedlist === undefined) {
			return Promise.reject("need to connect a valid provider");
		}
		return Promise.resolve(this.seedlist);
	}

	public async privateVaultHasMinted(config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.minted();
	}

	public async privateVaultTotalSavedItems(config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.total();
	}

	public async privateVaultDomainHash(config:PayableOverrides={}):Promise<any>{
		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		return this.seedlist.DOMAIN_SEPARATOR();

	}

	/*
	send bytes:
	ethers.utils.defaultAbiCoder.encode( ["address", "uint24"], ["0xf32d39ff9f6aa7a7a64d7a4f00a54826ef791a55", 500])
	 */
	public async privateVaultSaveDataWithoutMinting(
		data:string, cryptoLabel:string, labelHash:string, params:string, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}
		const gas=await this.seedlist.connect(this.signer).estimateGas.saveWithoutMintingDirectly( data, cryptoLabel, labelHash, deadline, v, r, s, params, {...config})
		const transaction = await this.seedlist.connect(this.signer).saveWithoutMintingDirectly(
			data, cryptoLabel, labelHash, deadline, v, r, s, params,{ gasLimit:gas.mul(13).div(10), ...config })

		const receipt = await transaction.wait(this._waitConfirmations);
		return receipt;
	}

	public async privateVaultSaveDataWithMinting(
		data:string, cryptoLabel:string, labelHash:string, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		const gas=await this.seedlist.connect(this.signer).estimateGas.saveWithMintingDirectly(data, cryptoLabel, labelHash, deadline, v, r, s, {...config})

		const transaction = await this.seedlist.connect(this.signer).saveWithMintingDirectly(
			data, cryptoLabel, labelHash, deadline, v, r, s, { gasLimit:gas.mul(13).div(10), ...config })

		const receipt = await transaction.wait(this._waitConfirmations);
		return receipt;
	}

	public async privateVaultGetDataByIndex(
		index:number, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		return this.seedlist.getPrivateDataByIndexDirectly(index, deadline, v, r, s)
	}

	public async privateVaultLabelExist(
		labelHash:string, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		return this.seedlist.labelIsExistDirectly(labelHash, deadline, v, r, s)

	}

	public async privateVaultGetDataByName(
		label:string, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		return this.seedlist.getPrivateDataByNameDirectly(label, deadline, v, r, s)

	}

	public async privateVaultLabelName(
		index:number, deadline:number,
		r:string, s:string, v:number, config:PayableOverrides={}):Promise<any>{

		if(this.provider === undefined || this.seedlist === undefined || this.signer === undefined){
			return Promise.reject("need to connect a valid provider and signer")
		}

		return this.seedlist.labelNameDirectly(index, deadline, v, r, s)
	}
	//end
}

const INFURA_KEY = process.env.REACT_APP_VAULTHUB_CONTRACT_ADDR;
if (typeof INFURA_KEY === 'undefined') {
    throw new Error(`REACT_APP_VAULTHUB_CONTRACT_ADDR must be a defined environment variable`)
}

export const etherClient = new VaultHubEtherClient(process.env.REACT_APP_VAULTHUB_CONTRACT_ADDR?process.env.REACT_APP_VAULTHUB_CONTRACT_ADDR:"");
