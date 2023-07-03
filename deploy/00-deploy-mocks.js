const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const {
  developmentsChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  log("hell");
  if (developmentsChains.includes(network.name)) {
    log("deploying");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("deployed-----------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
