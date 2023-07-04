import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect");
const fundButton = document.getElementById("fund-button");
const getBalanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
    connectButton.innerHTML = "Connected!";
  } else {
    console.log("No Metamask");
    fundButton.innerHTML = "Install Metamask ";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log(signer);
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const txresponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
    await txmined(txresponse, provider);
  } catch (error) {
    console.log(error);
  }
}
function txmined(txresponse, provider) {
  console.log(`mining ${txresponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(txresponse.hash, (transactionReceipt) => {
      console.log(
        `completed with ${transactionReceipt.comfirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    console.log("Withdrawing Funded Eth..");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const txresponse = await contract.withdraw();
      await txmined(txresponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
