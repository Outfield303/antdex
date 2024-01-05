import { ethers } from "ethers";
import {
  chainId as LineaTestnetChainId,
  testnet_chain,
  MyETHEREUMAddress,
  MyUSDCoinAddress,
  MyAntDexAddress,
  MyAntCoinAddress,
} from "../utils/constants";

import EthAbi from "../contracts/ETHEREUM.json";
import USDCAbi from "../contracts/USDCoin.json";
import AntDexAbi from "../contracts/AntDex.json";
import AntCoinAbi from "../contracts/AntCoin.json";

export const getProviderAndSigner = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
};

export const getEthContract = async () => {
  const { provider } = await getProviderAndSigner();
  const ethContractInstance = new ethers.Contract(
    MyETHEREUMAddress,
    EthAbi,
    provider
  );
  return ethContractInstance;
};

export const getUsdcContract = async () => {
  const { provider } = await getProviderAndSigner();
  const usdcContractInstance = new ethers.Contract(
    MyUSDCoinAddress,
    USDCAbi,
    provider
  );
  return usdcContractInstance;
};

export const getAntCoinContract = async () => {
  const { provider } = await getProviderAndSigner();
  const antCoinContractInstance = new ethers.Contract(
    MyAntCoinAddress,
    AntCoinAbi,
    provider
  );
  return antCoinContractInstance;
};

export const getAntDexContract = async () => {
  const { provider } = await getProviderAndSigner();

  const antDexContractInstance = new ethers.Contract(
    MyAntDexAddress,
    AntDexAbi,
    provider
  );

  return antDexContractInstance;
};
