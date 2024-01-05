import React, { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import HomeLayout from "../layouts/HomeLayout";
import web3 from "web3";
import EthAbi from "../contracts/ETHEREUM.json";
import USDCAbi from "../contracts/USDCoin.json";
import AntDexAbi from "../contracts/AntDex.json";
import AntCoinAbi from "../contracts/AntCoin.json";
import { changeNetwork } from "../utils/wallet";

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
  MyAntCoinAddress,
} from "../utils/constants";
import { getAntDexContract } from "../utils/contact";

/*

How to get user Ownership of the pool?
const lpBalance = await contract.getLpBalance(lpAddress, tokenAAddress, tokenBAddress);
const totalLpTokens = await contract.getTotalLpTokens(tokenAAddress, tokenBAddress);
const lpBalancePercentage = (lpBalance / totalLpTokens) * 100;
console.log(`The LP balance is ${lpBalancePercentage}% of the total LP tokens`);


---

lpfee = 0.3% of the total lp tokens | 30 == 0.3%


---
To use the `getSpotPrice` function in the frontend, you would need to make a call to this 
function with the addresses of the two tokens you're interested in. 
This function will return the current spot price of token A in terms of token B.
*/

const CONTRACT_MAP = {
  ETH: {
    address: MyETHEREUMAddress,
    abi: EthAbi,
  },
  USDC: {
    address: MyUSDCoinAddress,
    abi: USDCAbi,
  },
  ANT: {
    address: MyAntCoinAddress,
    abi: AntCoinAbi,
  },
};

const Pools = [
  {
    name: "ETH-USDC",
    fee: "",
    coin0: {
      name: "ETH",
      balance: 0,
    },
    coin1: {
      name: "USDC",
      balance: 0,
    },

    userLpBalance: 0, // call getLpBalance in AntDex | your liquidity
    poolLpTotalBalance: 0, // total lp token  of all users in pool | getTotalLpTokens | TVL
    userPercentage: 0,
  },
  {
    name: "ETH-ANT",
    coin0: {
      name: "ETH",
      balance: 0,
    },
    coin1: {
      name: "ANT",
      balance: 0,
    },

    userLpBalance: 0, // call getLpBalance in AntDex
    poolLpTotalBalance: 0, // total lp token  of all users in pool | getTotalLpTokens
    userPercentage: 0,
  },
  {
    name: "USDC-ANT",
    coin0: {
      name: "USDC",
      balance: 0,
    },
    coin1: {
      name: "ANT",
      balance: 0,
    },

    userLpBalance: 0, // call getLpBalance in AntDex
    poolLpTotalBalance: 0, // total lp token  of all users in pool | getTotalLpTokens
    userPercentage: 0,
  },
];

export default function PoolsPage() {
  const {
    address,
    chainId: metaMaskSelectedChain,
    isConnected,
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

  const [poolData, setPoolData] = useState(Pools);

  const fetchRequiredData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const dexContract = await getAntDexContract();

    await Promise.all(
      poolData.map(async (pool) => {
        const { coin0, coin1 } = pool;

        // const coin0Contract = new ethers.Contract(
        //   CONTRACT_MAP[coin0.name].address,
        //   CONTRACT_MAP[coin0.name].abi,
        //   provider
        // );

        // const coin1Contract = new ethers.Contract(
        //   CONTRACT_MAP[coin1.name].address,
        //   CONTRACT_MAP[coin1.name].abi,
        //   provider
        // );

        // const coin0Balance = await coin0Contract.balanceOf(address);
        // const coin1Balance = await coin1Contract.balanceOf(address);

        const [coin0PoolBalance, coin1PoolBalance] =
          await dexContract.getBalances(
            CONTRACT_MAP[coin0.name].address,
            CONTRACT_MAP[coin1.name].address
          );

        // this gets users liquidity in the pool
        const userLpBalance = await dexContract.getLpBalance(
          address,
          CONTRACT_MAP[coin0.name].address,
          CONTRACT_MAP[coin1.name].address
        );

        // this gets the total liquidity in the pool
        const poolLpTotalBalance = await dexContract.getTotalLpTokens(
          CONTRACT_MAP[coin0.name].address,
          CONTRACT_MAP[coin1.name].address
        );

        const divided = poolLpTotalBalance > 0 ? Number(userLpBalance / poolLpTotalBalance) / 1000 : 0;

        return {
          ...pool,
          coin0: {
            ...pool.coin0,
            balance: coin0PoolBalance, //total volume in pool
          },
          coin1: {
            ...pool.coin1,
            balance: coin1PoolBalance,
          },
          userLpBalance,
          poolLpTotalBalance,
          userPercentage: divided ,
        };
      })
    ).then((updatedPoolData) => {
      setPoolData(updatedPoolData);
      console.log(updatedPoolData);
    });
  };

  React.useEffect(() => {
    if (isConnected) {
      fetchRequiredData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <h1 className="text-4xl font-extrabold antialiased">Pools</h1>

        <hr
          className="border-t border-gray-500 mx-auto mt-6"
          style={{ width: "60%" }}
        />
      </div>

      <div
       
        className="flex w-fit flex-col border align-middle border-slate-700 bg-slate-900 rounded-lg shadow-lg p-6  mx-auto mt-8 "
      >
        <div className=" border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-sm font-normal text-left  text-gray-500 dark:text-gray-400"
                >
                  <span>Pool Name | Fee </span>
                </th>
                <th
                  scope="col"
                  className="px-12 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400"
                >
                  TokenA Balance
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400"
                >
                  TokenB Balance
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400"
                >
                  Total Pool Liquidity
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                >
                  Your Liqidity (%)
                </th>

                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                >
                  Options
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {poolData.map((pool) => {
                const {
                  name,
                  coin0,
                  coin1,
                  userLpBalance,
                  poolLpTotalBalance,
                } = pool;

                return (
                  <>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                        <h2 className="font-medium text-gray-800 dark:text-white ">
                          {name} &nbsp;
                          <div className="inline px-2 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                            0.3%
                          </div>
                        </h2>
                      </td>
                      <td className="text-white px-4 py-4 text-sm whitespace-nowrap pl-8">
                        {web3.utils.toWei(coin0.balance, "wei")}
                      </td>
                      <td className="text-white px-4 py-4 text-sm whitespace-nowrap">
                        {web3.utils.toWei(coin1.balance, "wei")}
                      </td>
                      <td className="text-white px-4 py-4 text-sm whitespace-nowrap">
                        {web3.utils.toWei(poolLpTotalBalance.toString(), "wei")}
                      </td>
                      <td className="text-white px-4 py-4 text-sm whitespace-nowrap">
                        {/* {web3.utils.toWei(, "wei")} */}
                        0
                      </td>
                      <td className="text-white px-4 py-4 text-sm whitespace-nowrap">
                        <button className="px-1 py-1 bg-blue-500 text-white transition-colors
                         duration-200 rounded-lg  hover:bg-blue-700">
                          Add Liquidity
                        </button>
                        <button className="px-1 py-1 bg-red-500 text-white transition-colors
                         duration-200 rounded-lg  hover:bg-red-700 ml-3">
                          Remove Liquidity
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}

              {/* <tr>
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                  <h2 className="font-medium text-gray-800 dark:text-white ">
                    Catalog &nbsp;
                    <div className="inline px-2 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                      0.3%
                    </div>
                  </h2>
                </td>
                <td className="px-12 py-4 text-sm font-medium whitespace-nowrap"></td>
                <td className="px-4 py-4 text-sm whitespace-nowrap"></td>
                <td className="px-4 py-4 text-sm whitespace-nowrap"></td>
                <td className="px-4 py-4 text-sm whitespace-nowrap"></td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                    Add Liquidity
                  </button>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
}
