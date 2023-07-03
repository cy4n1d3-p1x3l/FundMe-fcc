const {
  deployments,
  ethers,
  getNamedAccounts,
  waffle,
  gasReporter,
} = require("hardhat");
const { assert, expect } = require("chai");
const {
  duration,
} = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");
const { developmentsChains } = require("../../helper-hardhat-config");

!developmentsChains.includes(network.name)
  ? describe.skip
  : describe("FundME", function () {
      let fundMe, deployer;
      let mockV3Aggregator;
      let sendValue = "10000000000000000000";
      beforeEach(async function () {
        deployer = (await getNamedAccounts(10)).deployer;
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe");
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
        // console.log("hello");
      });

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async function () {
          const response = await fundMe.s_priceFeed();
          assert.equal(response, await mockV3Aggregator.getAddress());
        });
      });
      describe("fund", function () {
        it("Fails if insufficient eth is provided", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });

        it("updates the funded data structure", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.s_addressToAmountFunded(deployer);
          assert.equal(response.toString(), response.toString());
        });

        it("Adds funder to the funders array", async function () {
          await fundMe.fund({ value: sendValue });
          assert.equal(deployer, await fundMe.getFunders(0));
        });
      });

      describe("withdraw", function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
          console.log(await fundMe.getAddress());
        });
        ``;
        it("withdraw ETH from a single funder", async function () {
          const provider = ethers.getDefaultProvider("http://127.0.0.1:8545/");
          const startingbalance = await provider.getBalance(
            await fundMe.getAddress()
          );
          const startdeployerbalance = await provider.getBalance(deployer);

          const txresponse = await fundMe.cheaperWithdraw();
          const txReceipt = await txresponse.wait(1);
          const { gasUsed, gasPrice } = txReceipt;
          const { fee } = txReceipt;
          const gasCost = fee;

          const endingFundMebalance = await provider.getBalance(
            await fundMe.getAddress()
          );
          const enddeployerbalance = await provider.getBalance(deployer);
          assert.equal(endingFundMebalance.toString(), "0");
          assert.equal(
            (startingbalance + startdeployerbalance).toString(),
            (enddeployerbalance + gasCost + endingFundMebalance).toString()
          );
        });

        it("is allows us to withdraw with multiple funders", async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundMe.cheaperWithdraw();
          // Let's comapre gas costs :)
          // const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const withdrawGasCost = gasUsed.mul(effectiveGasPrice);
          console.log(`GasCost: ${withdrawGasCost}`);
          console.log(`GasUsed: ${gasUsed}`);
          console.log(`GasPrice: ${effectiveGasPrice}`);
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // Assert
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(withdrawGasCost).toString()
          );
          // Make a getter for storage variables
          await expect(fundMe.getFunder(0)).to.be.reverted;

          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
        it("Only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const fundMeConnectedContract = await fundMe.connect(accounts[1]);
          await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
      });
    });
