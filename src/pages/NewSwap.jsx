import React, { useState } from "react";

import Web3Modal from "web3modal";
import { ethers } from "ethers";
import ETHImg from "../assets/ETH.svg";
import USDCImg from "../assets/USDC.svg";
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

import {  getAntDexContract } from "../utils/contact";

const CoinImg = {
  USDC: USDCImg,
  ETH: ETHImg,
};

const TokenInput = ({ token, setToken, tokens }) => {
  return (
    <div className="flex justify-between mt-4">
      <input
        type="text"
        value={token.typedAmount}
        onChange={(e) =>
          setToken((obj) => ({
            ...obj,
            typedAmount: e.target.value,
          }))
        }
        placeholder="0.0"
        className="flex w-full leading-none text-gray-50 px-5 py-3 focus:outline-none focus:border-blue-700 border-0 bg-gray-800 rounded"
      />

      <img
        src={CoinImg[token.name]}
        alt="coin"
        className="h-8 w-fit flex ml-3 mt-1"
      />

      <select
        value={token.name}
        onChange={(e) => {
          setToken((obj) => ({ ...obj, name: e.target.value }));
          setToken(tokens.find((t) => t.name !== e.target.value));
        }}
        className="flex w-fit bg-gray-800 text-gray-300 focus:outline-none focus:border-blue-700 border-0 rounded ml-2 px-2"
      >
        {tokens.map((t) => (
          <option key={t.name}>{t.name}</option>
        ))}
      </select>
    </div>
  );
};

const Swap = () => {
  const [tokenA, setTokenA] = useState({ name: "ETH", typedAmount: "" });
  const [tokenB, setTokenB] = useState({ name: "USDC", typedAmount: "" });

  const tokens = [
    { name: "ETH", balance: "100" },
    { name: "USDC", balance: "200" },
    { name: "ANT", balance: "300" },
  ];

  return (
    <div>
      {/* Token A */}
      <div className="md:flex items-center mt-2 w-1/2 bg-black">
        <div className="w-full flex flex-col">
          <label className="font-semibold leading-none text-gray-300 border-b pb-2 border-gray-300">
            From
          </label>
          <TokenInput token={tokenA} setToken={setTokenA} tokens={tokens} />
          <div className="flex justify-start">
            <span className="text-gray-300 mt-2">
              Balance: {tokenA.balance}
            </span>
          </div>
        </div>
      </div>

      {/* Swap Button */}
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

      {/* Token B */}
      <div className="md:flex items-center mt-2">
        <div className="w-full flex flex-col">
          <label className="font-semibold leading-none text-gray-300 border-b pb-2 border-gray-300">
            To
          </label>
          <TokenInput token={tokenB} setToken={setTokenB} tokens={tokens} />
        </div>
      </div>
    </div>
  );
};

export default Swap;
