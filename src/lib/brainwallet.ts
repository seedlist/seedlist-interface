import  {encode} from "bs58check"
import * as bip39 from "bip39"
import {fromSeed, BIP32Interface} from "bip32";
import { ethers } from "ethers";
import {CryptoTools} from "./crypto";

function addr(node:BIP32Interface):string {
	let version = 0x0;
	let hash = node.identifier; // hash160 of the publicKey

	const payload = Buffer.allocUnsafe(21);
	payload.writeUInt8(version, 0);

	hash.copy(payload, 1);

	return  encode(payload);
}

function WIFPrivKey(node:BIP32Interface):string {
	let prefix = "80";
	let hexPrivKey = node.privateKey?.toString("hex");
	let payload = Buffer.from(prefix + hexPrivKey, "hex");
	return  encode(payload);
}

export function GenBitcoinBrainWalletByPuzzle(from:number=0, end:number, puzzle:string, passphrase:string=""){
	let addrs:string[] = [];
	let privkeys: string[] = [];
	let hexPrivkeys: string[] = [];
	puzzle = puzzle.trim();
	let cryptor = new CryptoTools();
	puzzle = cryptor.calculateValidSeed(puzzle, puzzle);
	let entropy = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(puzzle)).substring(2);
	let mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy, "hex"));
	let seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
	let master = fromSeed(seed); // m

// generate btc addresses...
	for (let i = from; i < end; i++) {
		let node = master.derivePath("m/44'/0'/0'/1/" + i);
		if(node.privateKey===undefined) continue;

		privkeys[i] = WIFPrivKey(node);
		let address = addr(node);
		addrs[i] =address;
	}

	return {
		addrs: addrs,
		privkeys:privkeys
	};
}

export function GenBitcoinBrainWalletByEntropy(from:number=0, end:number, vaultName:string, password:string, passphrase:string=""){
	let addrs:string[] = [];
	let privkeys: string[] = [];
	vaultName = vaultName.trim();
	password = password.trim();
	let cryptor = new CryptoTools();
	let puzzle = cryptor.calculateValidSeed(vaultName, password);
	let entropy = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(puzzle)).substring(2);
	let mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy, "hex"));
	let seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
	let master = fromSeed(seed); // m

// generate btc addresses...
	for (let i = from; i < end; i++) {
		let node = master.derivePath("m/44'/0'/0'/1/" + i);
		if(node.privateKey===undefined) continue;

		privkeys[i] = WIFPrivKey(node);
		let address = addr(node);
		addrs[i] =address;
	}

	return {
		addrs: addrs,
		privkeys:privkeys
	};
}

export function GenEthereumBrainWalletByEntropy(from:number=0, end:number, vaultName:string, password:string, passphrase:string="") {
	let addrs:string[] = [];
	let privkeys:string[] = [];
	vaultName = vaultName.trim();
	password = password.trim();
	let cryptor = new CryptoTools();
	let puzzle = cryptor.calculateValidSeed(vaultName, password);
	let entropy = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(puzzle)).substring(2);

	let mnemonic = bip39.entropyToMnemonic(entropy);

	let hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic, passphrase);

	for (let i = from; i < end; i++) {
		let node = hdnode.derivePath("m/44'/60'/0'/0/" + i);
		addrs[i] = node.address;
		privkeys[i] = node.privateKey;
	}
	return {addrs:addrs, privkeys:privkeys};
}

export function GenEthereumBrainWalletByPuzzle(from:number=0, end:number, puzzle:string, passphrase:string="") {
	let addrs:string[] = [];
	let privkeys:string[] = [];
	puzzle = puzzle.trim();
	let cryptor = new CryptoTools();
	puzzle = cryptor.calculateValidSeed(puzzle, puzzle);
	let entropy = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(puzzle)).substring(2);

	let mnemonic = bip39.entropyToMnemonic(entropy);

	let hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic, passphrase);

	for (let i = from; i < end; i++) {
		let node = hdnode.derivePath("m/44'/60'/0'/0/" + i);
		addrs[i] = node.address;
		privkeys[i] = node.privateKey;
	}
	return {addrs:addrs, privkeys:privkeys};
}