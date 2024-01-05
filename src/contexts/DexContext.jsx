import React from "react";

const initialState = {
  isWalletConnected: false,
  walletAddress: "",
};

export const DexContext = React.createContext({
  state: initialState,
  setState: (e) => {},
});

export const DexContextProvider = ({ children }) => {
  const [state, setState] = React.useState(initialState);

  const setNewState = (newState) => {
    setState(newState);
  };

  return (
    <DexContext.Provider value={{ state, setState: setNewState }}>
      {children}
    </DexContext.Provider>
  );
};

export const useDexContext = () => React.useContext(DexContext);
