// import "@nomiclabs/hardhat-etherscan";
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

require("./tasks/accounts")
require("./tasks/deploy")
require("./tasks/check")
require("./tasks/destroy")

const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

module.exports = {
  solidity: "0.8.9",
  defaultnetwork: "hardhat",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: {
        count: 10,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    hardhat: {
      loggingEnabled: true,
      chainId: 1337,
      accounts: {
        count: 10,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

