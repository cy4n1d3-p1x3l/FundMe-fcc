const { getUsedIdentifiers } = require("typechain");

require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("hardhat-deploy-ethers");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: process.env.RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      sepolia: process.env.PRIVATE_KEY, // here this will by default take the first account as deployer
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gasreport.txt",
    noColors: true,
    currency: "USD",
    token: "MATIC",
  },
};
