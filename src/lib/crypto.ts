import {ethers, Signature} from 'ethers';
import {syncScrypt} from "scrypt-js";
import CryptoJS from 'crypto-js';
import {
	BSC_DOMAIN_SEPARATOR, ETH_DOMAIN_SEPARATOR, POLYGON_DOMAIN_SEPARATOR,
	GET_LABEL_NAME_BY_INDEX,
	GET_PRIVATE_DATA_BY_INDEX_PERMIT_TYPE_HASH,
	GET_PRIVATE_DATA_BY_NAME_PERMIT_TYPE_HASH,
	HAS_MINTED_PERMIT_TYPE_HASH,
	INDEX_QUERY_PERMIT_TYPE_HASH,
	INIT_VAULT_PERMIT_TYPE_HASH,
	LABEL_EXIST_DIRECTLY_PERMIT_TYPE_HASH,
	LABEL_EXIST_TYPE_HASH,
	LABEL_NAME_PERMIT_TYPE_HASH,
	MINT_SAVE_PERMIT_TYPE_HASH,
	NAME_QUERY_PERMIT_TYPE_HASH,
	QUERY_PRIVATE_VAULT_ADDRESS_PERMIT_TYPE_HASH,
	SAVE_PERMIT_TYPE_HASH,
	SAVE_WITH_MINTING_PERMIT_TYPE_HASH,
	SAVE_WITHOUT_MINTING_PERMIT_TYPE_HASH,
	TOTAL_SAVED_ITEMS_PERMIT_TYPE_HASH,
	VAULT_HAS_REGISTER_PERMIT_TYPE_HASH
} from "../constants/contract";
import {VaultHubEtherClient} from "../ethers/etherClient";
const EthCrypto = require('eth-crypto');

class CryptoConstants{
	CHARS:string = "1qaz!QAZ2w?sx@WSX.(=]3ec#EDC/)P:4rfv$RF+V5t*IK<9og}b%TGB6OL>yhn^YHN-[d'_7ujm&UJ0p;{M8ik,l|";
	SALT_LEN:number = 32;
	CONTENT_PASSWORD_SALT_LEN:number = 32;

	SCRYPT_N:number = 1024; //math.pow(2,10)
	SCRYPT_r:number = 64;
	SCRYPT_p:number = 16;
	SCRYPT_dkLen:number = 128;
	TIMEOUT_DURATION:number = 180;

}

class CryptoTools extends CryptoConstants{
	calculatePairsBaseOnSeed(seed:string):{privKey:string, pubKey:string}{
		let secp256k1=require('secp256k1');
		seed = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(seed));
		let privKey = Buffer.from(seed.slice(2),'hex');
		//let privkey = ethers.utils.toUtf8Bytes(seed.slice(2))
		let pubKey=secp256k1.publicKeyCreate(privKey,false).slice(1);

		return {privKey:'0x'+privKey.toString("hex"), pubKey: pubKey.toString()};

	}

	getSaltChar(onceHash:string):string {
		let deep = onceHash.substring(0,6)+onceHash.substring(onceHash.length-4);
		return this.CHARS[parseInt(deep, 16)%this.CHARS.length];
	}

	calculateValidSeed(str1:string, str2:string, salt:string=""):string{
		let h1 = ethers.utils.sha512(ethers.utils.toUtf8Bytes(str1+salt));
		let h2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str2+salt));
		let saltStr = "";
		for(let i=0;i<this.SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(h1+h2+saltStr)));
			saltStr += saltChar;
		}
		let scryptRes = syncScrypt(ethers.utils.toUtf8Bytes(h1+h2), ethers.utils.toUtf8Bytes(saltStr), this.SCRYPT_N,this.SCRYPT_r,this.SCRYPT_p,this.SCRYPT_dkLen);
		return ethers.utils.sha512(scryptRes);
	}

	async signMessage(message:string, privKey:string):Promise<Signature>{
		let wallet = new ethers.Wallet(privKey)
		let flatSig = await wallet.signMessage(message)
		return ethers.utils.splitSignature(flatSig)
	}

	//CryptoJS supports AES-128, AES-192, and AES-256.
	// It will pick the variant by the size of the key you pass in.
	// If you use a passphrase, then it will generate a 256-bit key.
	encryptMessage(message:string, password:string):string{
		return CryptoJS.AES.encrypt(message, password).toString();
	}

	decryptMessage(message:string, password:string):string{
		return CryptoJS.AES.decrypt(message,password).toString(CryptoJS.enc.Utf8)
	}

	async multiEncryptMessage(message:string, password:string):Promise<string>{
		let pair = this.calculatePairsBaseOnSeed(password)
		let innerCryptoMsg =  CryptoJS.AES.encrypt(message, password+ethers.utils.sha512(pair.privKey)).toString();
		const publicKey = EthCrypto.publicKeyByPrivateKey(pair.privKey);
		let encryptMsg = await EthCrypto.encryptWithPublicKey(publicKey, innerCryptoMsg);
		return EthCrypto.cipher.stringify(encryptMsg);
	}

	async  multiDecryptMessage(message:string, password:string):Promise<string>{
		let pair = this.calculatePairsBaseOnSeed(password)
		let decryptMsg = await EthCrypto.decryptWithPrivateKey(pair.privKey, EthCrypto.cipher.parse(message))
		return CryptoJS.AES.decrypt(decryptMsg,password+ethers.utils.sha512(pair.privKey)).toString(CryptoJS.enc.Utf8)
	}

	calculateMainPairs(vaultName:string, password:string, salt:string="") {
		let seed = this.calculateValidSeed(vaultName, password, salt);
		return this.calculatePairsBaseOnSeed(seed);
	}

}

class CryptoMachine2022 extends CryptoTools{
	Wallet: ethers.Wallet;
	mainAddress: string ="";
	domainSeparator: string = "";

	constructor(vaultName:string, password:string, chainId:number) {
		super();
		if(chainId===1){
			this.domainSeparator = ETH_DOMAIN_SEPARATOR;
		}
		if(chainId===56){
			this.domainSeparator = BSC_DOMAIN_SEPARATOR;
		}
		if(chainId===137){
			this.domainSeparator = POLYGON_DOMAIN_SEPARATOR;
		}
		let pairs = this.calculateMainPairs(vaultName, password, this.domainSeparator);
		this.Wallet = new ethers.Wallet(pairs.privKey);
	}
	async generateWallet(vaultName:string, password:string){
		this.mainAddress= await this.Wallet.getAddress();
	}

	getLabelPassword(vaultName:string, pwd:string):string {
		let password = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(vaultName+pwd));
		let saltStr = "";
		for(let i=0;i<this.SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(password+saltStr)));
			saltStr += saltChar;
		}

		let s1 = syncScrypt(ethers.utils.toUtf8Bytes(password), ethers.utils.toUtf8Bytes(saltStr), this.SCRYPT_N,this.SCRYPT_r,this.SCRYPT_p,this.SCRYPT_dkLen);
		return ethers.utils.sha512(s1);
	}

	async labelHash(label:string):Promise<string>{
		let wallet =  new ethers.Wallet(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label)))
		return await wallet.getAddress()
	}

	getEncryptLabel(vaultName:string, pwd:string, label:string):string {
		let password = this.getLabelPassword(vaultName, pwd);
		return this.encryptMessage(label, password);
	}

	async getSomeDecryptLabels(vaultHub:VaultHubEtherClient, vaultName:string, pwd:string, total:number):Promise<Map<number, string>>{
		//let encryptor = new CryptoMachine2022(vaultName, pwd);
		let labels = new Map<number, string>();
		//await encryptor.generateWallet(vaultName, pwd);

		for(let i=0; i<total; i++){
			let indexQueryParams = await this.calculateGetLabelNameByIndexParams(i);
			let eLabelName = await vaultHub.client?.labelName(indexQueryParams.address, i, indexQueryParams.deadline, indexQueryParams.signature.r,
				indexQueryParams.signature.s, indexQueryParams.signature.v);
			if(i===0){
				labels.set(i, this.getDecryptLabel(vaultName, pwd, eLabelName));
				continue;
			}

			let wheelLabels = "";
			for(let j=0;j<i;j++){
				wheelLabels = wheelLabels + labels.get(j);
			}

			let wPassword = this.getWheelLabelPassword(vaultName, pwd, wheelLabels);
			labels.set(i, this.decryptMessage(eLabelName, wPassword));
		}

		return labels;
	}

	getWheelLabelPassword(vaultName:string, pwd:string, wheelLabels:string):string{
		let password = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(vaultName+pwd+wheelLabels))
		let saltStr = "";
		for(let i=0;i<this.SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(password+saltStr)));
			saltStr += saltChar;
		}

		let s1 = syncScrypt(ethers.utils.toUtf8Bytes(password), ethers.utils.toUtf8Bytes(saltStr), this.SCRYPT_N,this.SCRYPT_r,this.SCRYPT_p,this.SCRYPT_dkLen);
		return ethers.utils.sha512(s1);

	}

	getDecryptLabel(vaultName:string, pwd:string, cryptoLabel:string):string {
		let password = this.getLabelPassword(vaultName, pwd);
		return this.decryptMessage(cryptoLabel, password);
	}

	getContentPassword(vaultName:string, password:string, label:string):string {
		let s1 = ethers.utils.sha256(ethers.utils.toUtf8Bytes(vaultName));
		let s2 = ethers.utils.sha512(ethers.utils.toUtf8Bytes(password));
		let s3 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
		let saltStr = "";
		for(let i=0;i<this.SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(s1+s2+s3+saltStr)));
			saltStr += saltChar;
		}

		let originHash = syncScrypt(ethers.utils.toUtf8Bytes(s1+s2+s3), ethers.utils.toUtf8Bytes(saltStr), this.SCRYPT_N,this.SCRYPT_r,this.SCRYPT_p,this.SCRYPT_dkLen);
		let hash512 = ethers.utils.sha512(originHash)
		for(let i=0;i<this.CONTENT_PASSWORD_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.ripemd160(ethers.utils.toUtf8Bytes(hash512)));
			let onceHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(hash512));
			let random = onceHash.substring(0,6)+onceHash.substring(onceHash.length-4);
			let position = parseInt(random, 16)%hash512.length;
			hash512 = hash512.substr(0, position)+ saltChar + hash512.substr(position, hash512.length-position);
		}

		return hash512;
	}

	async calculateVaultHasRegisterParams(){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, deadline, this.domainSeparator, VAULT_HAS_REGISTER_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateInitVaultHubParams() {
		let deadline = Date.parse(new Date().toString()) / 1000 + this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, deadline, this.domainSeparator, INIT_VAULT_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateHasMintedParams(){
		let deadline = Date.parse(new Date().toString()) / 1000 + this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress,  deadline, this.domainSeparator, HAS_MINTED_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}

	}

	async calculateSaveWithMintingParams(content:string, label:string, labelHash:string, receiver:string) {
		let deadline = Date.parse(new Date().toString()) / 1000 + this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "string", "address", "address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, content, label, labelHash, receiver, deadline, this.domainSeparator, MINT_SAVE_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateSaveWithoutMintingParams(content:string, label:string, labelHash:string) {
		let deadline = Date.parse(new Date().toString()) / 1000 + this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string","string","address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, content, label, labelHash, deadline, this.domainSeparator, SAVE_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateTotalSavedItemsParams(){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, deadline, this.domainSeparator, TOTAL_SAVED_ITEMS_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateLabelExistParams(labelHash:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, labelHash, deadline, this.domainSeparator, LABEL_EXIST_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateQueryByIndexParams(index:number){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint64", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, index, deadline, this.domainSeparator, INDEX_QUERY_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateQueryByNameParams(labelHash:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, labelHash, deadline, this.domainSeparator, NAME_QUERY_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateGetLabelNameByIndexParams(index:number){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "uint64", "bytes32", "bytes32"],
			[this.mainAddress, deadline, index, this.domainSeparator, GET_LABEL_NAME_BY_INDEX],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculateQueryPrivateVaultAddressParams(){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, deadline, this.domainSeparator, QUERY_PRIVATE_VAULT_ADDRESS_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculatePrivateVaultLabelExistParams(labelHash:string, domain:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address","address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, labelHash, deadline, domain, LABEL_EXIST_DIRECTLY_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	//let params = ethers.utils.defaultAbiCoder.encode( ["address", "uint24"], ["0xf32d39ff9f6aa7a7a64d7a4f00a54826ef791a55", 500]);
	async calculatePrivateVaultSaveWithoutMintingParams(data:string, label:string, labelHash:string, domain:string, params:string="None"){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "string","bytes", "address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, data, label, params, labelHash, deadline, domain, SAVE_WITHOUT_MINTING_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculatePrivateVaultSaveWithMintingParams(data:string, label:string, labelHash:string, domain:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "string", "address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, data, label, labelHash, deadline, domain, SAVE_WITH_MINTING_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculatePrivateVaultGetDataByIndexParams(index:number, domain:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint64", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, index, deadline, domain, GET_PRIVATE_DATA_BY_INDEX_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculatePrivateVaultGetDataByNameParams(label:string, domain:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "address", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, label, deadline, domain, GET_PRIVATE_DATA_BY_NAME_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}

	async calculatePrivateVaultLabelNameParams(index:number, domain:string){
		let deadline = Date.parse(new Date().toString())/1000+this.TIMEOUT_DURATION;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint64", "uint256", "bytes32", "bytes32"],
			[this.mainAddress, index, deadline, domain, LABEL_NAME_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await this.Wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: this.mainAddress
		}
	}
}

export {CryptoMachine2022, CryptoTools}