export const RINKEBY_ENCRYPT_CONTRACT_ADDR:string = "0x6d89587672fb830A6B9Fb66E665528A38779e4c1"

export const MAINNET_ENCRYPT_CONTRACT_ADDR:string = "0x6d89587672fb830A6B9Fb66E665528A38779e4c1"

type ChainName = "goerli" | "mainnet" |"local"

type ChainList = {
	readonly [chainName in ChainName]:{
		Addr:string,
		Name:string,
		ChainId:number
	}
}
export const NetworkConfig:ChainList = {
	"goerli":{
		Addr:RINKEBY_ENCRYPT_CONTRACT_ADDR,
		Name:"Rinkeby",
		ChainId:4
	},
	"mainnet":{
		Addr:MAINNET_ENCRYPT_CONTRACT_ADDR,
		Name:"Mainnet",
		ChainId:1
	},
	"local":{
		Name:"Local",
		ChainId:1500,
		Addr:""
	}
}