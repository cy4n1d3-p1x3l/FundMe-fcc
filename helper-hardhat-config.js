const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const developmentsChains = ["hardhat", "localhost"];
const DECIMALS = 0;
const INITIAL_ANSWER = 200000000000;
module.exports = {
  networkConfig,
  developmentsChains,
  DECIMALS,
  INITIAL_ANSWER,
};
