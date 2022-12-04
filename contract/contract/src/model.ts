export class Ticket {
  chosenNumber: number[];
  betAmount: string;

  constructor({ chosenNumber, betAmount }: Ticket) {
    this.chosenNumber = chosenNumber;
    this.betAmount = betAmount;
  }
}

export class Player {
  playerId: string;
  tickets: Ticket[];

  constructor({ playerId, tickets }: Player) {
    this.playerId = playerId;
    this.tickets = tickets;
  }
}

export class PlayerStorage {
  round: number;
  players: Player[];

  constructor({round, players}: PlayerStorage) {
    this.round = round;
    this.players = players;
  }
}

export class Round {
  round: number;
  result: number[];
  startTime: Date;
  endTime: Date;
  prizePot: string;
  
  constructor({round, result, startTime, endTime, prizePot}) {
    this.round = round;
    this.result = result;
    this.startTime = startTime;
    this.endTime = endTime;
    this.prizePot = prizePot;
  }
}

export class WinnerDetails {
  wonNumber: number[];
  betAmount: string;
  prizeAmount: string;

  constructor({ wonNumber, betAmount, prizeAmount }: WinnerDetails) {
    this.wonNumber = wonNumber;
    this.betAmount = betAmount;
    this.prizeAmount = prizeAmount;
  }
}

export class Winner {
  winner: string;
  details: WinnerDetails[];
  prizeSum: string;
  isTransfered: boolean;

  constructor({ winner, details, prizeSum, isTransfered}: Winner) {
    this.winner = winner;
    this.details = details;
    this.prizeSum = prizeSum;
    this.isTransfered = isTransfered;
  }
}

export class WinnerStorage {
  round: number;
  winners: Winner[];

  constructor({round, winners}: WinnerStorage) {
    this.round = round;
    this.winners = winners;
  }
}
