import Chinema from "./general";
import { useState } from "react";
import Web3Load from "./Components/web3/web3load";
export default function App() {
  const [account, setAccount] = useState("");
  const [web3Api, setWeb3] = useState({
    web3: null,
    provider: null,
    contract: null,
    isProviderLoaded: false,
  });
  return (
    <>
      {account ? (
        <Chinema web3Api={web3Api} account={account} />
      ) : (
        <Web3Load setAccount={setAccount} setWeb3={setWeb3} />
      )}
    </>
  );
}
