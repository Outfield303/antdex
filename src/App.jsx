import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SwapPage from "./pages/Swap";
import PoolsPage from "./pages/Pools";
import PageNotFound from "./pages/PageNotFound";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { DexContextProvider } from "./contexts/DexContext";
import { metadata, projectId, testnet_chain } from "./utils/constants";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NewSwap from "./pages/NewSwap";

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [testnet_chain],
  projectId,
});

export default function App() {
  
  return (
    <DexContextProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Navigate to="/swap" />} />
          <Route path="/newSwap" element={<NewSwap />} />

          

          <Route path="/swap" element={<SwapPage />} />
          <Route path="/pools" element={<PoolsPage />} />

          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page-not-found" />} />
        </Routes>
      </BrowserRouter>
    </DexContextProvider>
  );
}
