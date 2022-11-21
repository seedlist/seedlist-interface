import {ethers, Signature, Wallet} from 'ethers';
import {syncScrypt} from "scrypt-js";
import CryptoJS from 'crypto-js';
import {hashMessage} from "@ethersproject/hash";
import {
	DOMAIN_SEPARATOR,
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
} from "../../constants/contract";
import {VaultHubEtherClient} from "../../ethers/etherClient";
import {ICryptoMachine} from "../interface";

export class SeedlistCryptor implements ICryptoMachine {
	encryptoLabel(vaultName:string, password:string, label:string):string{
		return "";
	}

	decryptoLabel(vaultName:string, password:string, encryptoLabel:string):string{
		return "";
	}

	encryptoContent(vaultName:string, password:string, content:string):string{
		return "";
	}

	decryptoContent(vaultName:string, password:string, encryptoContent:string):string{
		return "";
	}

	getMainWallet(vaultName: string, password: string): Wallet {
		return new ethers.Wallet("");
	}

	CHARS:string = "1qaz!QAZ2w?sx@WSX.(=]3ec#EDC/)P:4rfv$RF+V5t*IK<9og}b%TGB6OL>yhn^YHN-[d'_7ujm&UJ0p;{M8ik,l|";
	LABEL_SALT_LEN:number = 32;
	CONTENT_PASSWORD_SALT_LEN:number = 32;

	calculateOnceHash(str:string):string{
		return this.calculateMultiHash(str,1);
	}

	calculateMultiHash(str:string, n:number):string{
		var sha256Value = "";
		var tmpStr = str;
		for (var i=0;i<n;i++){
			sha256Value = ethers.utils.sha256(ethers.utils.toUtf8Bytes(tmpStr));
			tmpStr = sha256Value;
		}
		return sha256Value
	}

	calculatePairsBaseOnSeed(seed:string):{privKey:string, pubKey:string}{
		let secp256k1=require('secp256k1');
		seed = hashMessage(seed)
		let privKey = Buffer.from(seed.slice(2),'hex');
		//let privkey = ethers.utils.toUtf8Bytes(seed.slice(2))
		let pubKey=secp256k1.publicKeyCreate(privKey,false).slice(1);

		return {privKey:'0x'+privKey.toString("hex"), pubKey: pubKey.toString()};

	}

	getSaltChar(onceHash:string):string {
		let deep = onceHash.substring(0,6)+onceHash.substring(onceHash.length-4);
		return this.CHARS[parseInt(deep, 16)%this.CHARS.length];
	}

	calculateValidSeed(str1:string, str2:string):string{
		let h1 = this.calculateMultiHash(str1, 2);
		let h2 = this.calculateMultiHash(str2, 2);
		let pair1 = this.calculatePairsBaseOnSeed(h1+h2);
		let pair2 = this.calculatePairsBaseOnSeed(h2+h1);

		let signer1 = new ethers.utils.SigningKey(pair1.privKey)
		h2 = ethers.utils.joinSignature(signer1.signDigest(hashMessage(h1+h2)))

		let signer2 = new ethers.utils.SigningKey(pair2.privKey)
		h1 = ethers.utils.joinSignature(signer2.signDigest(hashMessage(h1+h2)))

		let saltStr = "";
		for(let i=0;i<this.LABEL_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.sha256(ethers.utils.toUtf8Bytes(h1+h2+saltStr)));
			saltStr += saltChar;
		}

		let scryptRes = syncScrypt(ethers.utils.toUtf8Bytes(h1+h2), ethers.utils.toUtf8Bytes(saltStr), 32,64,16,64);

		return ethers.utils.sha256(scryptRes);
	}

	encryptMessage(message:string, password:string):string{
		return CryptoJS.AES.encrypt(message, password).toString();
	}

	decryptMessage(message:string, password:string):string{
		return CryptoJS.AES.decrypt(message,password).toString(CryptoJS.enc.Utf8)
	}

	async signMessage(message:string, privKey:string):Promise<Signature>{
		let wallet = new ethers.Wallet(privKey)
		let flatSig = await wallet.signMessage(message)
		return ethers.utils.splitSignature(flatSig)
	}

	getLabelPassword(vaultName:string, pwd:string):string {
		let vHash = this.calculateOnceHash(vaultName);
		let vPwd = this.calculateOnceHash(pwd);
		let password = this.calculateMultiHash(vHash+vPwd, 2);
		let saltStr = "";
		for(let i=0;i<this.LABEL_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.sha256(ethers.utils.toUtf8Bytes(password+saltStr)));
			saltStr += saltChar;
		}

		let s1 = syncScrypt(ethers.utils.toUtf8Bytes(password), ethers.utils.toUtf8Bytes(saltStr), 32,64,16,64);
		return s1.toString();
	}

	async labelHash(label:string):Promise<string>{
		let h = this.calculateMultiHash(label, 2);
		let saltStr = "";
		for(let i=0;i<this.LABEL_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.sha256(ethers.utils.toUtf8Bytes(h+saltStr)));
			saltStr += saltChar;
		}

		let s1 = syncScrypt(ethers.utils.toUtf8Bytes(h), ethers.utils.toUtf8Bytes(saltStr), 32,64,16,64);
		let wallet =  new ethers.Wallet(this.calculateOnceHash(s1.toString()));
		return await wallet.getAddress()
	}

	getEncryptLabel(vaultName:string, pwd:string, label:string):string {
		let password = this.getLabelPassword(vaultName, pwd);
		return this.encryptMessage(label, password);
	}

	async getSomeDecryptLabels(vaultHub:VaultHubEtherClient, vaultName:string, pwd:string, total:number):Promise<Map<number, string>>{
		let encryptor = new VaultContractUtils();
		let labels = new Map<number, string>();

		for(let i=0; i<total; i++){
			let indexQueryParams = await encryptor.calculateGetLabelNameByIndexParams(vaultName, pwd, i);
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
		let vHash = this.calculateOnceHash(vaultName);
		let vPwd = this.calculateOnceHash(pwd);
		let vWheel = this.calculateOnceHash(wheelLabels);
		let password = this.calculateMultiHash(vHash+vPwd+vWheel, 2);
		let saltStr = "";
		for(let i=0;i<this.LABEL_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.sha256(ethers.utils.toUtf8Bytes(password+saltStr)));
			saltStr += saltChar;
		}

		let s1 = syncScrypt(ethers.utils.toUtf8Bytes(password), ethers.utils.toUtf8Bytes(saltStr), 32,64,16,64);
		return s1.toString();

	}

	getDecryptLabel(vaultName:string, pwd:string, cryptoLabel:string):string {
		let password = this.getLabelPassword(vaultName, pwd);
		return this.decryptMessage(cryptoLabel, password);
	}

	getContentPassword(vaultName:string, password:string, label:string):string {
		let h1 = this.calculateMultiHash(vaultName, 2);
		let h2 = this.calculateMultiHash(password, 2);
		let h3 = this.calculateMultiHash(label, 2);

		let pair1 = this.calculatePairsBaseOnSeed(h1+h2);
		let pair2 = this.calculatePairsBaseOnSeed(h2+h3);
		let pair3 = this.calculatePairsBaseOnSeed(h3+h1);

		let signer1	= new ethers.utils.SigningKey(pair1.privKey)
		h1 = ethers.utils.joinSignature(signer1.signDigest(hashMessage(h3+h2)))

		let signer2	= new ethers.utils.SigningKey(pair2.privKey)
		h1 = ethers.utils.joinSignature(signer2.signDigest(hashMessage(h1+h3)))

		let signer3	= new ethers.utils.SigningKey(pair3.privKey)
		h1 = ethers.utils.joinSignature(signer3.signDigest(hashMessage(h2+h1)))

		let originHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(h1+h2+h3))


		let saltStr = "";
		for(let i=0;i<this.LABEL_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.sha256(ethers.utils.toUtf8Bytes(originHash+saltStr)));
			saltStr += saltChar;
		}

		originHash = syncScrypt(ethers.utils.toUtf8Bytes(originHash), ethers.utils.toUtf8Bytes(saltStr), 32,64,16,64).toString();

		for(let i=0;i<this.CONTENT_PASSWORD_SALT_LEN; i++){
			let saltChar = this.getSaltChar(ethers.utils.sha256(ethers.utils.toUtf8Bytes(originHash)));
			let onceHash = this.calculateOnceHash(originHash);
			let random = onceHash.substring(0,6)+onceHash.substring(onceHash.length-4);
			let position = parseInt(random, 16)%originHash.length;
			originHash = originHash.substr(0, position)+ saltChar + originHash.substr(position, originHash.length-position);
		}

		return originHash;
	}
}

export class VaultContractUtils extends SeedlistCryptor{

	//////////////////////////////////
	calculateMainPairs(vaultName:string, password:string) {
		let seed = this.calculateValidSeed(vaultName, password);
		return this.calculatePairsBaseOnSeed(this.calculateOnceHash(seed));
	}

	async calculateVaultHasRegisterParams(vaultName:string, password:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[address, deadline, DOMAIN_SEPARATOR, VAULT_HAS_REGISTER_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateInitVaultHubParams(vaultName:string, password:string) {
		let pairs = this.calculateMainPairs(vaultName, password);

		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString()) / 1000 + 300;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[address, deadline, DOMAIN_SEPARATOR, INIT_VAULT_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateHasMintedParams(vaultName:string, password:string){
		let pairs = this.calculateMainPairs(vaultName, password);

		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString()) / 1000 + 300;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[address,  deadline, DOMAIN_SEPARATOR, HAS_MINTED_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: address
		}

	}

	async calculateSaveWithMintingParams(vaultName:string, password:string, content:string, label:string, labelHash:string, receiver:string) {
		let pairs = this.calculateMainPairs(vaultName, password);

		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString()) / 1000 + 300;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "string", "address", "address", "uint256", "bytes32", "bytes32"],
			[address, content, label, labelHash, receiver, deadline, DOMAIN_SEPARATOR, MINT_SAVE_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateSaveWithoutMintingParams(vaultName:string, password:string, content:string, label:string, labelHash:string) {
		let pairs = this.calculateMainPairs(vaultName, password);

		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString()) / 1000 + 300;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string","string","address", "uint256", "bytes32", "bytes32"],
			[address, content, label, labelHash, deadline, DOMAIN_SEPARATOR, SAVE_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return{
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateTotalSavedItemsParams(vaultName:string, password:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[address, deadline, DOMAIN_SEPARATOR, TOTAL_SAVED_ITEMS_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateLabelExistParams(vaultName:string, password:string, labelHash:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "address", "uint256", "bytes32", "bytes32"],
			[address, labelHash, deadline, DOMAIN_SEPARATOR, LABEL_EXIST_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateQueryByIndexParams(vaultName:string, password:string, index:number){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint64", "uint256", "bytes32", "bytes32"],
			[address, index, deadline, DOMAIN_SEPARATOR, INDEX_QUERY_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateQueryByNameParams(vaultName:string, password:string, labelHash:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "address", "uint256", "bytes32", "bytes32"],
			[address, labelHash, deadline, DOMAIN_SEPARATOR, NAME_QUERY_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateGetLabelNameByIndexParams(vaultName:string, password:string, index:number){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "uint64", "bytes32", "bytes32"],
			[address, deadline, index, DOMAIN_SEPARATOR, GET_LABEL_NAME_BY_INDEX],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculateQueryPrivateVaultAddressParams(vaultName:string, password:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint256", "bytes32", "bytes32"],
			[address, deadline, DOMAIN_SEPARATOR, QUERY_PRIVATE_VAULT_ADDRESS_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculatePrivateVaultLabelExistParams(vaultName:string, password:string, labelHash:string, domain:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address","address", "uint256", "bytes32", "bytes32"],
			[address, labelHash, deadline, domain, LABEL_EXIST_DIRECTLY_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculatePrivateVaultSaveWithoutMintingParams(vaultName:string, password:string, data:string, label:string, labelHash:string, domain:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+100;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "string","address", "uint256", "bytes32", "bytes32"],
			[address, data, label, labelHash, deadline, domain, SAVE_WITHOUT_MINTING_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculatePrivateVaultSaveWithMintingParams(vaultName:string, password:string, data:string, label:string, domain:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+100;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "string", "uint256", "bytes32", "bytes32"],
			[address, data, label, deadline, domain, SAVE_WITH_MINTING_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculatePrivateVaultGetDataByIndexParams(vaultName:string, password:string, index:number, domain:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint64", "uint256", "bytes32", "bytes32"],
			[address, index, deadline, domain, GET_PRIVATE_DATA_BY_INDEX_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculatePrivateVaultGetDataByNameParams(vaultName:string, password:string, label:string, domain:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "string", "uint256", "bytes32", "bytes32"],
			[address, label, deadline, domain, GET_PRIVATE_DATA_BY_NAME_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}

	async calculatePrivateVaultLabelNameParams(vaultName:string, password:string, index:number, domain:string){
		let pairs = this.calculateMainPairs(vaultName, password);
		let wallet = new ethers.Wallet(pairs.privKey);
		let address = await wallet.getAddress();
		let deadline = Date.parse(new Date().toString())/1000+3;

		let combineMessage = ethers.utils.solidityKeccak256(
			["address", "uint64", "uint256", "bytes32", "bytes32"],
			[address, index, deadline, domain, LABEL_NAME_PERMIT_TYPE_HASH],
		);
		let messageHash = ethers.utils.keccak256(ethers.utils.arrayify(combineMessage.toLowerCase()));

		let messageHashBytes = ethers.utils.arrayify(messageHash);
		let flatSig = await wallet.signMessage(messageHashBytes);
		let sig = ethers.utils.splitSignature(flatSig);

		return {
			deadline: deadline,
			signature: sig,
			address: address
		}
	}
}