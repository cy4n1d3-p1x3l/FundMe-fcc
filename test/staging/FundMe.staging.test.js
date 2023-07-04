const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentsChains } = require("../../helper-hardhat-config");
require("dotenv").config();

developmentsChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Tests", function () {
      let deployer;
      let fundMe;
      const url = process.env.PRC_URL;
      const sendValue = "100000000000000000";
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe");
      });

      it("allows people to fund and withdraw", async function () {
        const fundTxResponse = await fundMe.fund({ value: sendValue });
        await fundTxResponse.wait(1);
        const withdrawTxResponse = await fundMe.withdraw();
        await withdrawTxResponse.wait(1);
        const provider = ethers.getDefaultProvider(url);
        const endingFundMeBalance = await provider.getBalance(
          await fundMe.getAddress()
        );
        console.log(
          endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        );
        assert.equal(endingFundMeBalance.toString(), "0");
      });
    });
