import { ConditionStore } from './ConditionStore';
import { TimerStore } from './TimerStore';
import { InitialWalletProps, WalletStore } from './WalletStore';
import { PageStore } from './PageStore';
import { RoundStore } from './RoundStore';
import { contractAddress, networkInUse } from '../ultilities/contract_address';
import { RatioStore } from './NearRatiosStore';

const initialWallet: InitialWalletProps = {
  createAccessKeyFor: contractAddress,
  network: networkInUse,
}

export type RootStoreHydration = {};

export class RootStore {
  pageStore: PageStore;
  walletStore: WalletStore;
  roundStore: RoundStore;
  ratioStore: RatioStore;
  timerStore: TimerStore;
  conditionStore: ConditionStore;

  constructor() {
    this.pageStore = new PageStore();
    this.walletStore = new WalletStore(initialWallet);
    this.roundStore = new RoundStore();
    this.ratioStore = new RatioStore();
    this.timerStore = new TimerStore();
    this.conditionStore = new ConditionStore();
  }

  // hydrate(_data: RootStoreHydration) {
  //   console.log("hydrate");
  // }
}
