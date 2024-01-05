import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useWeb3Modal,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { chainId as LineaTestnetChainId, testnet_chain } from "./constants";
import web3 from "web3";
import { toast } from "react-toastify";
import { ethers } from "ethers";

// const getContract = async () => {
  

  // if (typeof window.ethereum !== 'undefined') {
  //   const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  //   setProvider(web3Provider);

  //   try {
  //     // Request account access if needed
  //     await window.ethereum.request({ method: 'eth_requestAccounts' });

  //     // Get the current connected account
  //     const accounts = await web3Provider.listAccounts();
  //     setAccount(accounts[0]);

  //     // Load the contract with ABI and address
  //     const abi = require('./contractABI.json'); // Replace with your ABI file path
  //     const contractAddress = 'YOUR_CONTRACT_ADDRESS';
  //     const contractInstance = new ethers.Contract(contractAddress, abi, web3Provider);
  //     setContract(contractInstance);
  //   } catch (error) {
  //     console.error('Error connecting to wallet:', error);
  //   }
//   }
// }



export const changeNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(LineaTestnetChainId) }],
    });
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    toast(err.message, {
      type: "error",
    });
    if (err.code === 4902) {
      await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: testnet_chain.name,
              chainId: web3.utils.toHex(LineaTestnetChainId),
              rpcUrls: [testnet_chain.rpcUrl],

              nativeCurrency: {
                name: testnet_chain.currency,
                symbol: "LineaETH",
                decimals: 18,
              },
              blockExplorerUrls: [testnet_chain.explorerUrl],
            },
          ],
        })
        .catch((err2) => {
          toast(err2.message, {
            type: "error",
          });
        });
    }
  }
};
