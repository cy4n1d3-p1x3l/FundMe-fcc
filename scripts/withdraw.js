const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const sendValue = "10000000000000000";
  const fundMe = await ethers.getContract("FundMe");
  console.log("Funding contract");
  const txresponse = await fundMe.withdraw();
  const txreceipt = await txresponse.wait(2);
  console.log("Withdrawn!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
