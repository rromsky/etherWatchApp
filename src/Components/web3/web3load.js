import { useEffect, useState } from "react";
import Web3 from "web3";
import { loadContract } from "./utils/load-contract";
import detectEthereumProvider from "@metamask/detect-provider";
import "./web3.css";

const web3Problem = () => (
  <>
    <main className="h-100 is-flex ai-c jc-c">
      <div className="box is-flex flex-column ai-c jc-c">
        <h4>MetaMask is not installed!</h4>
        <a className="button is-light is-info" href="/some">
          Install MetaMask
        </a>
      </div>
    </main>
  </>
);

const Web3Load = (props) => {
  const [web3Api, setWeb3] = useState({
    web3: null,
    provider: null,
    contract: null,
    isProviderLoaded: false,
  });
  const [account, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [cannotConnect, setConnect] = useState(false);
  const [isRequstHere, setRequest] = useState(false);
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };

  const requestAccount = async () => {
    const time = setTimeout(() => {
      setLoading(false);
      setConnect(true);
    }, 6500);
    try {
      await web3Api.provider.request({ method: "eth_requestAccounts" });
    } catch (e) {
      setRequest(true);
    }
    setLoading(false);
    window.clearTimeout(time);
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        const contract = await loadContract("EtherWatch", web3);
        setAccountListener(provider);
        setWeb3({
          web3,
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3((api) => ({ ...api, isProviderLoaded: true }));
        console.error("Please, install Metamask.");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    // const { web3 } = web3Api;
    if (web3Api.web3) {
      const getAccount = async () => {
        const accounts = await web3Api.web3.eth.getAccounts();
        if (accounts[0]) {
          setAccount(accounts[0]);
          props.setAccount(accounts[0]);
          props.setWeb3(web3Api);
        }
      };
      getAccount();
    }
  }, [web3Api.web3]);

  const accountProblem = () => (
    <>
      <main className="h-100 is-flex ai-c jc-c ">
        <div
          className="box is-flex ai-c jc-c flex-column"
          style={{ padding: 32 }}
        >
          <h4 style={{ fontSize: 16, marginBottom: 8 }}>
            {isLoading
              ? "Connecting to network..."
              : cannotConnect
              ? isRequstHere
                ? "Check your MetaMask extension"
                : "Something went worng. Try again"
              : "Account is not connected!"}
          </h4>
          <button
            style={{
              background: "#eee",
              borderRadius: 10,
              padding: 5,
              fontSize: 16,
            }}
            onClick={() => {
              setLoading(true);
              requestAccount();
            }}
          >
            {isLoading ? (
              <>
                <i class="fa fa-spinner fa-spin"></i> {"  "}loading...
              </>
            ) : (
              "Connect Account"
            )}
          </button>
        </div>
      </main>
    </>
  );

  const getContent = () => <>{account ? "" : accountProblem()}</>;

  return <>{web3Api?.web3 ? getContent() : web3Problem()}</>;
};
export default Web3Load;
