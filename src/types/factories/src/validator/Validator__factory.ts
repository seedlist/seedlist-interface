/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Validator,
  ValidatorInterface,
} from "../../../src/validator/Validator";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "isValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newWorker",
        type: "address",
      },
    ],
    name: "updateWorker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "worker",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600080546001600160a01b031916905534801561002057600080fd5b50600180546001600160a01b0319163317905561048b806100426000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80630a03e7381461005c5780634d547ada1461008457806380e4cc9d146100af5780638da5cb5b146100c4578063f2fde38b146100d7575b600080fd5b61006f61006a366004610326565b6100ea565b60405190151581526020015b60405180910390f35b600054610097906001600160a01b031681565b6040516001600160a01b03909116815260200161007b565b6100c26100bd3660046103d7565b61017c565b005b600154610097906001600160a01b031681565b6100c26100e53660046103d7565b61024c565b600080546001600160a01b031661010357506000919050565b600054604051633a27652360e01b81526001600160a01b0390911690633a27652390610133908590600401610407565b6020604051808303816000875af1158015610152573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610176919061045c565b92915050565b6001546001600160a01b031633146101db5760405162461bcd60e51b815260206004820152601760248201527f56616c696461746f723a206175746820696e76616c696400000000000000000060448201526064015b60405180910390fd5b6001600160a01b03811661022a5760405162461bcd60e51b815260206004820152601660248201527556616c696461746f723a5a45524f206164647265737360501b60448201526064016101d2565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b0316331461029f5760405162461bcd60e51b815260206004820152601660248201527515985b1a59185d1bdc8e985d5d1a081a5b9d985b1a5960521b60448201526064016101d2565b6001600160a01b0381166102ee5760405162461bcd60e51b815260206004820152601660248201527556616c696461746f723a5a45524f206164647265737360501b60448201526064016101d2565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561033857600080fd5b813567ffffffffffffffff8082111561035057600080fd5b818401915084601f83011261036457600080fd5b81358181111561037657610376610310565b604051601f8201601f19908116603f0116810190838211818310171561039e5761039e610310565b816040528281528760208487010111156103b757600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000602082840312156103e957600080fd5b81356001600160a01b038116811461040057600080fd5b9392505050565b600060208083528351808285015260005b8181101561043457858101830151858201604001528201610418565b81811115610446576000604083870101525b50601f01601f1916929092016040019392505050565b60006020828403121561046e57600080fd5b8151801515811461040057600080fdfea164736f6c634300080c000a";

type ValidatorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ValidatorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Validator__factory extends ContractFactory {
  constructor(...args: ValidatorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Validator> {
    return super.deploy(overrides || {}) as Promise<Validator>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Validator {
    return super.attach(address) as Validator;
  }
  override connect(signer: Signer): Validator__factory {
    return super.connect(signer) as Validator__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ValidatorInterface {
    return new utils.Interface(_abi) as ValidatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Validator {
    return new Contract(address, _abi, signerOrProvider) as Validator;
  }
}
