import { WalletStore } from './../stores/WalletStore';
import { contractAddress, networkInUse } from './contract_address';

export const viewOnlyWallet = async(): Promise<WalletStore> => {
  const wallet = new WalletStore({ createAccessKeyFor: contractAddress, network: networkInUse })
  await wallet.startUp()
  return wallet;
}