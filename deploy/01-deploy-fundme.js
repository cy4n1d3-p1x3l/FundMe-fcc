// function deployfunc() {
//   console.log("hello world");

// }
// module.exports.default = deployfunc;
const {
  networkConfig,
  developmentsChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (developmentsChains.includes(network.name)) {
    const x = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = x.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
};
module.exports.tags=["all", "fund"];
