import React from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
  useWeb3Modal,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import {
  MyETHEREUMAddress,
  MyUSDCoinAddress,
  MyAntDexAddress,
} from "../utils/constants";
import ETHERABI from "../contracts/ETHEREUM.json";
import MyUSDCoinABI from "../contracts/USDCoin.json";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { truncate } from "../utils/truncate";

export default function Topbar() {
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const getBalance = async () => {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const USDTContract = new Contract(
      MyUSDCoinAddress,
      MyUSDCoinABI.USDCoin.abi,
      signer
    );
    const USDTBalance = await USDTContract.balanceOf(address);

    console.log(formatUnits(USDTBalance, 18));
  };

  return (
    <header>
      <nav className=" inset-x-0 top-0 z-10 w-full px-4 bg-white shadow-md border-slate-500 dark:bg-[#0c1015] transition duration-700 ease-out">
        <div className="flex justify-between px-8 py-2">
          <div
            className="text-[1.5rem] leading-[3rem] mr-4 tracking-tight font-bold
          text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600
       "
          >
            Ant Swap Finance
          </div>

          <ul className="md:flex mx-auto font-semibold text-lg space-x-16 text-white align-middle mt-3">
            <li>
              <Link to="/swap" className="hover:text-gray-300">
                Swap
              </Link>
            </li>
            <li>
              <Link to="/pools" className="hover:text-gray-300">
                Pools
              </Link>
            </li>
            <li>
              <button
                onClick={() =>
                  Swal.fire({
                    title: "Bridge function is coming soon!",
                    icon: "info",
                  })
                }
                className="hover:text-gray-300"
              >
                Bridge
              </button>
            </li>
          </ul>

          <div className="flex items-center space-x-4 text-lg font-semibold tracking-tight">
            {isConnected ? (
              <button
                onClick={() => open()}
                className="text-sm flex items-center justify-center align-middle shadow
                px-5 py-1.5 text-black transition duration-700 ease-out bg-white border border-black rounded-lg hover:bg-black hover:border hover:text-white dark:border-white dark:bg-inherit dark:text-white dark:hover:bg-white dark:hover:text-black
                "
              >
                <UserCircleIcon className="w-6 h-6 mr-1" /> {truncate(address, { nPrefix: 10 })}
              </button>
            ) : (
              <button
                onClick={() => open()}
                className="px-6 py-1 text-black transition duration-700 ease-out bg-white border border-black rounded-lg hover:bg-black hover:border hover:text-white dark:border-white dark:bg-inherit dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
