const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase:
              "very indoor spoon mystery orphan knife myth elbow artwork retreat fix country",
          },
          providerOrUrl:
            "wss://sepolia.infura.io/ws/v3/52724ba4b2fe448ca4c4ae275dc1f5f8",
          addressIndex: 0,
        }),
      network_id: "11155111",
      gasPrice: "2500000000",
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 2,
    },
  },
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};
