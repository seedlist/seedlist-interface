import  {encode} from "bs58check"
import * as bip39 from "bip39"
import {fromSeed, BIP32Interface} from "bip32";
import { ethers } from "ethers";
import {CryptoTools} from "./crypto";
import {generatePrivateKey, getPublicKey, nip19} from "nostr-tools";

export function GenNostrIdByPuzzle(from:number=0, end:number, puzzle:string, passphrase:string=""){
	let publickeys:string[] = [];
	let privkeys: string[] = [];
	let nsecs:string[] = [];
	let npubs: string[] = [];
	puzzle = puzzle.trim();
	let cryptor = new CryptoTools();
	puzzle = cryptor.calculateValidSeed(puzzle, puzzle);
	let entropy = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(puzzle)).substring(2);
	let mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy, "hex"));
	let seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
	let master = fromSeed(seed); // m

	for (let i = from; i < end; i++) {
		let node = master.derivePath("m/44'/1237'/0'/1/" + i);
		if(node.privateKey===undefined || node.publicKey===undefined) continue;

		privkeys[i] = node.privateKey.toString("hex");
		nsecs[i] = nip19.nsecEncode(privkeys[i]);

		publickeys[i] = getPublicKey(privkeys[i]);
		npubs[i] = nip19.npubEncode(publickeys[i]);
	}

	return {
		publickeys: publickeys,
		privkeys:privkeys,
		nsecs:nsecs,
		npubs:npubs
	};
}

export function GenNostrIdByEntropy(from:number=0, end:number, vaultName:string, password:string, passphrase:string=""){
	let publickeys:string[] = [];
	let privkeys: string[] = [];
	let nsecs:string[] = [];
	let npubs: string[] = [];
	vaultName = vaultName.trim();
	password = password.trim();
	let cryptor = new CryptoTools();
	let puzzle = cryptor.calculateValidSeed(vaultName, password);
	let entropy = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(puzzle)).substring(2);
	let mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy, "hex"));
	let seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
	let master = fromSeed(seed); // m

	for (let i = from; i < end; i++) {
		let node = master.derivePath("m/44'/1237'/0'/1/" + i);
		if(node.privateKey===undefined || node.publicKey===undefined) continue;

		privkeys[i] = node.privateKey.toString("hex");
		nsecs[i] = nip19.nsecEncode(privkeys[i]);

		publickeys[i] = getPublicKey(privkeys[i]);
		npubs[i]=nip19.npubEncode(publickeys[i]);
	}

	return {
		publickeys: publickeys,
		privkeys:privkeys,
		nsecs:nsecs,
		npubs:npubs
	};

}
