// Get From Contract Interface By RPC
export const DOMAIN_SEPARATOR = "";

export const POLYGON_DOMAIN_SEPARATOR = "0xcaa373a87286947d7b122a2a705a47cebbe9270431f34436a9f8112472ef5db5";
export const BSC_DOMAIN_SEPARATOR = "0x71e21f3c9e0e120f022fc26f45867b4605e78e39d7eac4427ed9fae08c742c80";
export const ETH_DOMAIN_SEPARATOR = "0x99805167a4860a311555c62a50d498d04822861b80ceb9a63a639d1a33c81bc5";

// keccak256('savePrivateDataWithMinting(address addr, string memory data, string memory cryptoLabel, address labelHash,
// address receiver, uint256 deadline)');
export const MINT_SAVE_PERMIT_TYPE_HASH =
	"0xcdd3cc6eb42396c94a4d5d905327888ade5ae14c59a5d22ae3235b88283c0035";

// keccak256('savePrivateDataWithoutMinting(address addr, string memory data,
// string memory cryptoLabel, address labelHash, uint256 deadline)');
export const SAVE_PERMIT_TYPE_HASH = "0x50a5dca0d9658d6eb6282f2d7bdda2a899b962259e2708f7cce8c48021a63483";

//keccak256('queryPrivateDataByIndex(address addr, uint64 index, uint256 deadline)')
export const INDEX_QUERY_PERMIT_TYPE_HASH =
	"0xbcb00634c612072a661bb64fa073e7806d31f3790f1c827cd20f95542b5af679";

//keccak256('queryPrivateDataByName(address addr, address labelHash, uint256 deadline)')
export const NAME_QUERY_PERMIT_TYPE_HASH =
	"0xab4ac209d4a97678c29d0f2f4ef3539a24e0ce6dbd2dd481c818134b61d28ecc";

//keccak256('initPrivateVault(address addr, uint256 deadline)')
export const INIT_VAULT_PERMIT_TYPE_HASH = "0xef93604cd5c5e7d35e7ef7d38e1cac9e1cc450e49bc931effd1f65a5a993121d";

//keccak256('vaultHasRegister(address addr, uint256 deadline)')
export const VAULT_HAS_REGISTER_PERMIT_TYPE_HASH = "0x5a14c87645febe5840f128409acb12772ff89f3398b05142d7e039c76e0844e8";

//keccak256('hasMinted(address addr, uint256 deadline)')
export const HAS_MINTED_PERMIT_TYPE_HASH = "0xdbd66a895de1fdf2e44b84c83cf1e4f482f647eb80397d069bf7763a583ce1a5";

//keccak256('totalSavedItems(address addr, uint256 deadline)')
export const TOTAL_SAVED_ITEMS_PERMIT_TYPE_HASH = "0xf65e93839555276acb1b1c33eb49dff5fa6a88c6991b9b84b680dc961b85f847";

//keccak256('getLabelNameByIndex(address addr, uint256 deadline, uint64 index)')
export const GET_LABEL_NAME_BY_INDEX = "0xbd5bc3ca2c7ea773b900edfe638ad04ce3697bf85885abdbe90a2f7c1266d9ee";

//keccak256('queryPrivateVaultAddress(address addr, uint256 deadline)')
export const QUERY_PRIVATE_VAULT_ADDRESS_PERMIT_TYPE_HASH = "0x21b7e085fb49739c78b83ddb0a8a7e4b469211d08958f57d52ff68325943de04";

//keccak256('labelExist(address addr, address labelHash, uint256 deadline)')
export const LABEL_EXIST_TYPE_HASH = "0xac1275bd89417f307b1ae27de4967e4910dfab4abd173eb3e6a3352c21ae42fe";

// =========== private vault contract caller used ===========
//keccak256('labelNameDirectly(uint64 index, uint256 deadline)')
export const LABEL_NAME_PERMIT_TYPE_HASH =
	"0xcbb2475c190d2e287f7de56c688846f7612f70b210a3856ad34c475cbad0dda7";

//keccak256('getPrivateDataByNameDirectly(address name, uint256 deadline)')
export const  GET_PRIVATE_DATA_BY_NAME_PERMIT_TYPE_HASH =
	"0x91fb9dd060bd9ffe42a43373e9de88b3a9b106cbce07f242fd6f2c4a41ef921d";

//keccak256('getPrivateDataByIndexDirectly(uint64 index, uint256 deadline)')
export const  GET_PRIVATE_DATA_BY_INDEX_PERMIT_TYPE_HASH =
	"0x17558919af4007c4fb94572ba8e807922ff7db103814e127ad21ef481ca35d98";

//keccak256('saveWithoutMintingDirectly(string memory data, string memory cryptoLabel, address labelHash, uint256 deadline, bytes memory params)')
export const  SAVE_WITHOUT_MINTING_PERMIT_TYPE_HASH =
	"0xb5874d5c3f6f8ad0eddae31287a8b0ff49e374249cd2389616fb828f06f42f63";

//keccak256('saveWithMintingDirectly(string memory data, string memory cryptoLabel, address labelHash, uint256 deadline)')
export const SAVE_WITH_MINTING_PERMIT_TYPE_HASH =
	"0x8774f567563ee2634c371978f5cfa8e41e5d255912344cb6b7d652f94c66c8a4";

//keccak256('labelIsExistDirectly(address labelHash, uint256 deadline)')
export const LABEL_EXIST_DIRECTLY_PERMIT_TYPE_HASH = "0x5e9a0e1424c7f33522faa862eafa09a676e96246da16c8b58d5803ba8010584f";

//keccak256('updateValidator(address _privateValidator, uint256 deadline)')
const  UPDATE_VALIDATOR_PERMIT_TYPE_HASH = "0x79c473821b1882439e653292df5add05615ab1a78b695620f6cf37ab0fb6dbbc";

export const SAVING_PRIVATE_DATA_FEE = 3000000000000000;
export const ETHEREUM_SAVING_PRIVATE_DATA_FEE = 3000000000000000;
