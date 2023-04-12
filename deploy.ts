import { ethers } from "ethers";
import { GelatoRelay } from "@gelatonetwork/relay-sdk";


// Set up Gelato Relay
const relay = new GelatoRelay();

async function main() {
  // Set up provider and signer
  //const provider = ethers.getDefaultProvider("mumbai"); If you use Metamask
  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  const privateKey = "f8c8ea1fad03de01cca8f439ffdb021f459d8b7579d09730c533168fea6a50fe"; // Our account
  const signer = new ethers.Wallet(privateKey, provider);

  // Set up SplitFundsContractFactory contract
  const factoryAbi = [
    "function createContract(address[] memory addresses, string calldata title, string calldata ercAddress) external returns (address)",
    "function getAllAddresses() public view returns (address[] memory)"
  ];
  const factoryAddress = "0xa46C3583c871E206AEb7691580d0248d309F2d36";
  const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, signer);

  // Set up arguments for createContract function
  const addresses: string[] = [];
  const title = "My SplitFunds Contract";
  const ercAddress = 0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1;

  // Get transaction data for createContract function
  const createContractData = factoryContract.interface.encodeFunctionData("createContract", [addresses, title, ercAddress]);

  // Set up request object
  const request = {
    chainId: 80001, // Mumbai
    target: factoryAddress,
    data: createContractData,
  };
  

  // Set up sponsor API key
  const sponsorApiKey = "Ojyefg2_hBHRdor1_9q8r1KJRStsw172iFGM999RzXY_"; //Gelato API

  // Execute sponsored transaction
  const relayResponse = await relay.sponsoredCall(request, sponsorApiKey);
  const taskId = relayResponse.taskId;

  console.log(`https://relay.gelato.digital/tasks/status/${taskId}`);
}


main().catch((error) => console.error(error));