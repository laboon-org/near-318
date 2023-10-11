import * as nearAPI from "near-api-js";
import "dotenv/config";

const {keyStores, KeyPair, connect, Contract} = nearAPI;

const TGAS = 300000000000000;
const NO_DEPOSIT = 0;
const NO_ARGS = {};

const contractAddress = process.env.CONTRACT_ADDRESS;
const triggerContract = async() => {
  const myKeyStore = new keyStores.InMemoryKeyStore();
  const { PRIVATE_KEY } = process.env;
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  await myKeyStore.setKey("testnet", contractAddress, keyPair);
  // console.log(myKeyStore);

  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  const nearConnection = await connect(connectionConfig);
  const account = await nearConnection.account(contractAddress);
  const contract = new Contract(
    account, // the account object that is connecting
    contractAddress,
    {
      // name of contract you're connecting to
      viewMethods: ["get_tickets"], // view methods do not change state but usually return a value
      changeMethods: ["proceed_bingo"], // change methods modify state
    }
  );

  const response = await contract.proceed_bingo(NO_ARGS, TGAS, NO_DEPOSIT);
  console.log(response);
}

export default triggerContract;