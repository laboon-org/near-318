// near api js
import { providers} from 'near-api-js';
import { makeAutoObservable } from 'mobx';

// wallet selector UI
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal } from '@near-wallet-selector/modal-ui';
import NearIconUrl from '@near-wallet-selector/near-wallet/assets/near-wallet-icon.png';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';

// wallet selector options
import { Network, NetworkId, setupWalletSelector, Wallet, WalletSelector } from '@near-wallet-selector/core';

import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';

import {getAccountBalance} from '../ultilities/near-balance';

const TGAS = '300000000000000';
const NO_DEPOSIT = '0';

export interface InitialWalletProps  {
  createAccessKeyFor: string | undefined;
  network: NetworkId | Network;
}

export class WalletStore {
  walletSelector: WalletSelector | undefined;
  wallet: Wallet | undefined;
  network: NetworkId | Network;
  createAccessKeyFor: string | undefined;
  accountId: string | undefined;
  accountBalance: string | undefined;
  isSignedIn: boolean | undefined;

  constructor({ createAccessKeyFor, network }: InitialWalletProps) {
    makeAutoObservable(this);

    // Login to a wallet passing a contractId will create a local key
    // so the user can skip signing non-payable transactions
    // Ommiting accountId will result in the user being asked to sign all transactions.
    this.createAccessKeyFor = createAccessKeyFor;
    this.network = network;
  }

  // To be called when the website loads
  startUp = async(): Promise<void> => {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [
        setupNearWallet({ iconUrl: NearIconUrl.src }), 
        // setupMyNearWallet({ iconUrl: MyNearIconUrl.src }),
        // setupLedger({ iconUrl: LedgerIconUrl.src})
      ]
    });

    const isSignedIn = this.walletSelector.isSignedIn();

    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet();
      this.accountId = this.walletSelector.store.getState().accounts[0].accountId;
      this.isSignedIn = isSignedIn;
    }
  }
  
  signIn = (): void => {
    if (this.walletSelector && this.createAccessKeyFor) {
      const description = 'Please select a wallet to sign in.';
      const modal = setupModal(this.walletSelector, { contractId: this.createAccessKeyFor, description});
      modal.show();
    }
    else throw `
      Cannot sign in NEAR Wallet 
      \nWalletSelector: ${this.walletSelector}
      \nContractID: ${this.createAccessKeyFor}
    `
  }

  signOut = (): void => {
    if (this.wallet) {
      this.wallet.signOut();
      this.wallet = this.accountId = this.createAccessKeyFor = undefined;
      window.location.replace(window.location.origin + window.location.pathname);
    }
    else throw `Cannot sign out! \nWallet: ${this.wallet}`
  }

  // Make a read-only call to retrieve information from network
  viewMethod = async({ contractId, method, args = {}}: any) => {
    if (this.walletSelector) {
      const { network } = this.walletSelector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })
      // console.log(method);
      // console.log(args);
      let res = await provider.query({
        request_type: 'call_function',
        account_id: contractId,
        method_name: method,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic',
      });
      // @ts-ignore
      return JSON.parse(Buffer.from(res.result).toString());
    }
    else throw `
      Cannot use view method 
      \nWalletSelector: ${this.walletSelector}
    `
  };

  // Call a method that changes the contract's state
  callMethod = async({ 
      contractId, 
      method, 
      args = {}, 
      gas = TGAS, 
      deposit = NO_DEPOSIT
    }: any) => {

    if (this.wallet) {
      return await this.wallet.signAndSendTransaction({
        signerId: this.accountId,
        receiverId: contractId,
        actions: [{
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        }],
      });

    } else throw `
      Cannot use call method
      \nWallet: ${this.wallet}
    `
  };

  getTransactionResult = async(txhash: string) => {
    if (this.walletSelector) {
      const { network } = this.walletSelector.options;
      const provider = new providers.JsonRpcProvider({url: network.nodeUrl});

      // Retrieve transaction result from the network
      const transaction = await provider.txStatus(txhash, 'unnused');
      return providers.getTransactionLastResult(transaction);
    }
  }

  setUserBalance = async (): Promise<void> => {
    if (this.accountId) {
      const balance = await getAccountBalance(this.accountId);
      this.accountBalance = balance.nBalance;
    } else throw `
      Cannot set account balance
      \nAccountID: ${this.accountId}
    `
  }
}