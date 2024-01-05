import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import ETHImg from "../assets/ETH.svg";
import USDCImg from "../assets/USDC.svg";
import ANTImg from "../assets/ANT.png";
import HomeLayout from "../layouts/HomeLayout";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalState,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import {
  ArrowPathRoundedSquareIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import {
  chainId as LineaTestnetChainId,
  testnet_chain,
  MyETHEREUMAddress,
  MyUSDCoinAddress,
  MyAntDexAddress,
} from "../utils/constants";
import { changeNetwork } from "../utils/wallet";

import { getAntDexContract } from "../utils/contact";

// const getPriceOnTokenA = async (tokenA, tokenB) => {
//   const tokenAAddress = "0x..."; // The address of token A
//   const tokenBAddress = "0x..."; // The address of token B

//   const spotPrice = await contract.getSpotPrice(tokenAAddress, tokenBAddress);

//   console.log(`The current spot price of token A in terms of token B is ${spotPrice}`);
// }

const CoinImg = {
  USDC: USDCImg,
  ETH: ETHImg,
  ANT: ANTImg
};

export default function SwapPage() {
  const {
    chainId: metaMaskSelectedChain,
    isConnected,
    address,
  } = useWeb3ModalAccount();

  const { selectedNetworkId: inCodeSelectedChain } = useWeb3ModalState();

  const { open, close } = useWeb3Modal();

  const [validNetwork, setValidNetwork] = useState(false);

  React.useEffect(() => {
    if (
      metaMaskSelectedChain === inCodeSelectedChain &&
      metaMaskSelectedChain === LineaTestnetChainId
    ) {
      setValidNetwork(true);
    } else {
      setValidNetwork(false);
    }
  }, [metaMaskSelectedChain, inCodeSelectedChain]);

  const [tokenA, setTokenA] = useState({
    name: "ETH",
    address: MyETHEREUMAddress,
    balance: "0.0",
    typedAmount: "",
  });
  const [tokenB, setTokenB] = useState({
    name: "USDC",
    address: MyUSDCoinAddress,
    balance: "0.0",
    typedAmount: "",
  });

  const showUserBalance = async () => {
    if (isConnected) {
      // const { ethContractInstance, usdcContractInstance, userAccountAddress } = await getCoinContracts();
      const { antDexContractInstance } = await getAntDexContract();

      const balances = await antDexContractInstance.getBalances(
        MyETHEREUMAddress,
        MyUSDCoinAddress
      );

      const ethBal = balances[0];
      const usdcBal = balances[1];

      if (tokenA.name === "ETH") {
        setTokenA((obj) => ({
          ...obj,
          balance: ethers.formatEther(ethBal),
        }));
        setTokenB((obj) => ({
          ...obj,
          balance: ethers.formatEther(usdcBal),
        }));
      } else {
        setTokenA((obj) => ({
          ...obj,
          balance: ethers.formatEther(usdcBal),
        }));
        setTokenB((obj) => ({
          ...obj,
          balance: ethers.formatEther(ethBal),
        }));
      }
    }
  };

  const onSwap = () => {};

  useEffect(() => {
    showUserBalance();
    // getLpBalanceOfUser();
  }, [isConnected]);

  return (
    <HomeLayout>
      <div>
        {validNetwork ? (
          ""
        ) : (
          <>
            {isConnected && (
              <div className="bg-red-500 text-white text-center py-2 px-4">
                <span className="text-white">
                  Please connect to Linea Testnet! &nbsp;
                  <span
                    onClick={changeNetwork}
                    className="underline underline-offset-4 cursor-pointer"
                  >
                    Click here to switch network.
                  </span>
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-full text-center text-white mt-12  leading-snug">
        <h1 className="text-4xl font-extrabold antialiased">
          Swap. Transfer. Bridge.
        </h1>
        <h2 className="text-lg mt-2 font-semibold antialiased">
          ...with AntSwap DEX
        </h2>

        <div className="mt-6">
          <button
            className="flex mx-auto bg-gradient-to-r from-blue-400 to-purple-600 px-4 py-2 rounded-lg shadow
          mt-4 font-bold text-lg text-white hover:from-purple-600 hover:to-blue-400
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>
            Watch Video
          </button>
        </div>

        <hr
          className="border-t border-gray-500 mx-auto mt-6"
          style={{ width: "60%" }}
        />
      </div>

      <div
        style={{ width: "44rem" }}
        className="border border-slate-900 bg-slate-900 rounded-lg shadow-lg p-6  mx-auto mt-8 mb-8"
      >
        <div
          className="mx-auto my-3 justify-center items-center"
          style={{ width: "95%" }}
        >
          <div className="md:flex items-center mt-8">
            <div className="w-full flex flex-col">
              <label className="font-semibold leading-none text-gray-300 border-b pb-2 border-gray-300">
                From
              </label>
              <div className="flex justify-between mt-4">
                <input
                  type="text"
                  value={tokenA.typedAmount}
                  onChange={(e) =>
                    setTokenA((obj) => ({
                      ...obj,
                      typedAmount: e.target.value,
                    }))
                  }
                  placeholder="0.0"
                  className="flex w-full leading-none text-gray-50 px-5 py-3 focus:outline-none focus:border-blue-700 border-0 bg-gray-800 rounded"
                />

                <img
                  src={CoinImg[tokenA.name]}
                  alt="coin"
                  className="h-8 w-fit flex ml-3 mt-1"
                />

                <select
                  value={tokenA.name}
                  onChange={(e) => {
                    setTokenA((obj) => ({ ...obj, name: e.target.value }));
                    setTokenB((obj) => ({
                      ...obj,
                      name: e.target.value == "ETH" ? "USDC" : "ETH",
                    }));
                  }}
                  className="flex w-fit bg-gray-800 text-gray-300 focus:outline-none focus:border-blue-700 border-0 rounded ml-2 px-2"
                >
                  <option>ETH</option>
                  <option>USDC</option>
                  <option>ANT</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <span className="text-gray-300 mt-2">
              Balance: {tokenA.balance}
            </span>
          </div>

          <div>
            <button
              onClick={() => {
                const temp = tokenA;
                setTokenA(tokenB);
                setTokenB(temp);
              }}
              className="flex mx-auto bg-gradient-to-r from-blue-400 to-purple-600 px-2 py-2 rounded-full shadow
              mt-0 font-bold text-lg text-white hover:from-purple-600 hover:to-blue-400
              "
            >
              <ArrowPathRoundedSquareIcon className="w-7 h-7 " />
            </button>
          </div>

          <div className="md:flex items-center mt-2">
            <div className="w-full flex flex-col">
              <label className="font-semibold leading-none text-gray-300 border-b pb-2 border-gray-300">
                To
              </label>
              <div className="flex justify-between mt-4">
                <input
                  type="text"
                  value={tokenB.typedAmount}
                  placeholder="0.0"
                  className="flex w-full leading-none cursor-not-allowed text-gray-50 px-5 py-3 focus:outline-none focus:border-blue-700 border-0 bg-gray-800 rounded"
                  disabled
                />

                <img
                  src={CoinImg[tokenB.name]}
                  alt="coin"
                  className="h-8 w-fit flex ml-3 mt-1"
                />

                <select
                  value={tokenB.name}
                  onChange={(e) => {
                    setTokenB((obj) => ({ ...obj, name: e.target.value }));
                    setTokenA((obj) => ({
                      ...obj,
                      name: e.target.value == "ETH" ? "USDC" : "ETH",
                    }));
                  }}
                  className="flex w-fit bg-gray-800 text-gray-300 focus:outline-none focus:border-blue-700 border-0 rounded ml-2 px-2"
                >
                  <option>ETH</option>
                  <option>USDC</option>
                  <option>ANT</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <span className="text-gray-300 mt-2">
              Balance: {tokenB.balance}
            </span>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={onSwap}
              className=" mx-auto bg-gradient-to-r from-blue-400 to-purple-600 w-full flex justify-center text-center py-2 rounded-lg shadow
              mt-4 font-bold text-lg text-white hover:from-purple-600 hover:to-blue-400
          "
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
