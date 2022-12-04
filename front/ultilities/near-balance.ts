import { connect, keyStores, utils } from 'near-api-js';

// Config for testnet
const getConfigTestnet = (myKeyStore: keyStores.BrowserLocalStorageKeyStore) => {
  return {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  }
}

// // Config for mainnet
// const getConfigMainnet = (myKeyStore: keyStores.BrowserLocalStorageKeyStore) => {
//   return {
//     networkId: "mainnet",
//     keyStore: myKeyStore,
//     nodeUrl: "https://rpc.mainnet.near.org",
//     walletUrl: "https://wallet.mainnet.near.org",
//     helperUrl: "https://helper.mainnet.near.org",
//     explorerUrl: "https://explorer.mainnet.near.org",
//   }
// }

// Check if balance is integer or float
export const checkBalanceNear = (balance: string): string => {
  let fixedBalance = balance.replace(',', '');
  if (Number.isInteger(Number(fixedBalance))) {
    return fixedBalance;
  } else {
    return Number(fixedBalance).toFixed(4);
  }
}

export interface BalanceInterface {
  yBalance: string;
  nBalance: string;
}

export const getAccountBalance = async(accountId: string) => {
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

  const connectionConfigTestnet = getConfigTestnet(myKeyStore);

  // const connectionConfigMainnet = getConfigMainnet(myKeyStore);

  const nearConnection = await connect(connectionConfigTestnet);

  const account = await nearConnection.account(accountId);
  const balance = await account.getAccountBalance();

  return {
    ynBalance: balance.available,
    nBalance: checkBalanceNear(utils.format.formatNearAmount(balance.available)),
  };
}

export const convertYoctoToNear = (yocto: string) => {
  console.log(yocto);
  return checkBalanceNear(utils.format.formatNearAmount(yocto));
}