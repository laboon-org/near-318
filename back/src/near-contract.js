import * as nearAPI from "near-api-js";
import "dotenv/config";

const { keyStores, KeyPair, connect, Contract } = nearAPI;

const {
  TGAS,
  NO_DEPOSIT,
  NO_ARGS,
  CONTRACT_ADDRESS,
  NEAR_NETWORK,
  PRIVATE_KEY,
  NODE_URL,
  WALLET_URL,
  HELPER_URL,
  EXPLORER_URL,
} = process.env;

const triggerContract = async() => {
  const myKeyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  await myKeyStore.setKey(nearNetwork, CONTRACT_ADDRESS, keyPair);
  // console.log(myKeyStore);

  const connectionConfig = {
    networkId: NEAR_NETWORK,
    keyStore: myKeyStore,
    nodeUrl: NODE_URL,
    walletUrl: WALLET_URL,
    helperUrl: HELPER_URL,
    explorerUrl: EXPLORER_URL,
  };

  const nearConnection = await connect(connectionConfig);
  const account = await nearConnection.account(CONTRACT_ADDRESS);
  const contract = new Contract(
    account, // the account object that is connecting
    CONTRACT_ADDRESS,
    {
      // name of contract you're connecting to
      viewMethods: ["get_tickets"], // view methods do not change state but usually return a value
      changeMethods: ["proceed_bingo"], // change methods modify state
    }
  );

  const response = await contract.proceed_bingo(NO_ARGS, TGAS, NO_DEPOSIT);
  // console.log(response);
}

export default triggerContract;