import {SeedlistCryptor} from "./official/crypto";

export let versions =["seedlist"];

export let CryptoMachines = {
	"seedlist": new SeedlistCryptor()
}
