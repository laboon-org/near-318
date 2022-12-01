import { utils } from "near-api-js";
import { WalletStore } from "../stores/WalletStore";

export interface TicketDetails {
  chosenNumber: number[];
  betAmount: string;
}

export interface Player {
  playerAddress: string;
  tickets: TicketDetails[];
}

export interface PlayerList {
  round: number;
  players: Player[];
  
}

export interface WinnerDetails {
  wonNumber: number[];
  betAmount: string;
  prizeAmount: string;
}

export interface Winner {
  winner: string;
  details: WinnerDetails[];
  prizeSum: string;
  isTransfered: boolean;
}

export interface WinnerList {
  round: number;
  winners: Winner[]
}

export class Contract {
  contractId: string;
  wallet: WalletStore;

  constructor({contractId, walletToUse}: {contractId: string, walletToUse: WalletStore}) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getContractBalance(): Promise<string> {
    let balance = '';
    let balanceResult = await this.wallet.viewMethod({
      contractId: this.contractId, 
      method: "get_contract_balance",
    });
    if (balanceResult) {
      balance = utils.format.formatNearAmount(balanceResult);
    }
    return balance;
  }

  async getTicketsByPlayer({player}: {player: string}): Promise<PlayerList[]> {
    let tickets = await this.wallet.viewMethod({
      contractId: this.contractId, 
      method: "get_tickets_by_player",
      args: {
        player: player,
      }
    });
    return tickets as PlayerList[];
  }

  async getTicketsByPlayerAndRound({player, round}: {player: string, round: number}): Promise<PlayerList[]>{
    let tickets = await this.wallet.viewMethod({
      contractId: this.contractId, 
      method: "get_tickets_by_player_and_round",
      args: {
        player: player,
        round: round
      }
    });
    return tickets as PlayerList[];
  }

  async getWinnersByPlayer({player}: {player: string}): Promise<WinnerList[]>{
    let tickets = await this.wallet.viewMethod({
      contractId: this.contractId, 
      method: "get_winner_by_player",
      args: {
        player: player,
      }
    });
    return tickets as WinnerList[];
  }

  async getWinnersByRound({round}: {round: number}): Promise<WinnerList[]> {
    let tickets = await this.wallet.viewMethod({
      contractId: this.contractId, 
      method: "get_winner_by_round",
      args: {
        round: round
      }
    });
    return tickets as WinnerList[];
  }

  async addTickets({chosenNumber, betAmount}: {chosenNumber: number[], betAmount: number}) {
    let deposit = utils.format.parseNearAmount(betAmount.toString());
    let response = await this.wallet.callMethod({
      contractId: this.contractId, 
      method: "add_ticket",
      args: {
        chosenNumber: chosenNumber,
      },
      deposit: deposit,
    });
    return response;
  }

  async transferPrize({round}: {round: number}) {
    let response = await this.wallet.callMethod({
      contractId: this.contractId, 
      method: "transfer_prize",
      args: {
        round: round,
      },
    });
    return response;
  }
}