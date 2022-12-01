import { WalletStore } from './WalletStore';
import { action, makeAutoObservable, makeObservable, observable } from 'mobx';
import { Contract } from '../ultilities/near-interface';

export interface Round {
  round: number;
  result: number[];
  startTime: Date;
  endTime: Date;
  prizePot: string;
}


export class RoundStore {
  rounds: Round[] = [];

  constructor() {
    makeAutoObservable(this);
    this.rounds = [];
  }

  addRounds = (rounds: Round[]) => {
    this.rounds = rounds;
  }

  fetchAllRounds = async(contractId: string | undefined, wallet: WalletStore): Promise<boolean> => {
    if (contractId) {
      const rounds: Round[] = await wallet.viewMethod({
        contractId: contractId, 
        method: "get_rounds",
      });
      console.log(rounds);
      if (rounds.length > this.rounds.length) {
        this.addRounds(rounds);
        return true;
      }
      return false;
    }
    else throw Error(` 
      Cannot fetch rounds
      \n ContractId: ${contractId}
    `)
  }
}