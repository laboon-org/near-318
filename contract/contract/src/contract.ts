import { NearBindgen, near, call, view, initialize, NearPromise, bytes } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

import { PlayerStorage, Ticket, Round, WinnerStorage, Winner, Player, WinnerDetails } from './model';

const FIVE_TGAS = BigInt("50000000000000");
const NO_DEPOSIT = BigInt(0);
const NO_ARGS = bytes(JSON.stringify({}));

function get_date(): Date {
  const dateNano = near.blockTimestamp();
  const dateMili = dateNano / BigInt(1000000);
  const fixDate = new Date(Number(dateMili));
  const date = new Date(fixDate.getFullYear(), fixDate.getMonth(), fixDate.getDay(), fixDate.getHours(), (fixDate.getMinutes() + (10 - (fixDate.getMinutes() % 10))), 0)
  return date;
}

function check_duplicate_value(target: number[], val: number): number {
  let count = 0;
  target.forEach(item => {
    if (item === val) count++;
  })
  return count;
}


@NearBindgen({})
class Bingo {
  playerStorage: PlayerStorage[] = [];
  rounds: Round[] = [];
  winnerStorage: WinnerStorage[] = [];

  @initialize({})
  init() {
    const firstRound: Round = new Round({
      round: 1,
      result: [],
      startTime: get_date(),
      endTime: new Date(get_date().getTime() + 10 * 60000),
    });
    this.rounds = [firstRound];
    this.playerStorage = [];
    this.winnerStorage = [];
  }

  @call({privateFunction: true})
  reset_player_store() {
    this.playerStorage = [];
    near.log("Reset player store");
  }

  @call({privateFunction: true})
  set_first_round() {
    const firstRound: Round = new Round({
      round: 1,
      result: [],
      startTime: get_date(),
      endTime: new Date(get_date().getTime() + 10 * 60000),
    });
    this.rounds = [firstRound];
    near.log("Create first round");
  }

  @call({privateFunction: true})
  reset_winner_store() {
    const firstWinnerStore: WinnerStorage = new WinnerStorage({
      round: 1,
      winners: [],
    });
    this.winnerStorage = [firstWinnerStore];
    near.log("Reset winner store");
  }

  @call({privateFunction: true})
  reset() {
    this.reset_player_store();
    this.reset_winner_store();
    this.set_first_round();
  }

  @call({payableFunction: true}) // This method changes the state, for which it cost gas
  add_ticket({ chosenNumber }: { chosenNumber: number[]}): string {
    const currentPlayer: AccountId = near.predecessorAccountId();
    const round = this.get_last_round().round;
    const betAmount = near.attachedDeposit().toString();
    const newTicket = new Ticket({chosenNumber, betAmount});
    const roundInfo = this.playerStorage.find(item => item.round === round);
    // Storage already have current round
    if (roundInfo) {
      const playerInfo = roundInfo.players.find(item => item.playerId === currentPlayer);
      // Storage of current round already have caller
      if (playerInfo) {
        playerInfo.tickets = [...playerInfo.tickets, newTicket];
      }
      // Storage of current round doesnt have caller
      else {
        const newPlayer: Player = new Player({playerId: currentPlayer, tickets: [newTicket]});
        roundInfo.players = [...roundInfo.players, newPlayer];
      }
    } 
    // Storage doesnt have current round
    else {
      const newPlayer: Player = new Player({playerId: currentPlayer, tickets: [newTicket]});
      const newStore: PlayerStorage = new PlayerStorage({round: round, players: [newPlayer]});
      this.playerStorage = [...this.playerStorage, newStore]
    }
    return (`Saved: Ticket of ${currentPlayer} on round ${round}: ${chosenNumber}`);
  }


  @call({privateFunction: true})
  generate_result() {
    const currentRound: Round = this.rounds[this.rounds.length - 1];
    const randomString = near.randomSeed();
    if (currentRound.result.length < 1) {
      for(let i = 0; i < 3; i++) {
        const randomNumber = (randomString.charCodeAt(i) % 6) + 1;
        near.log("Random number: ", randomNumber);
        currentRound.result = [...currentRound.result, randomNumber];
      }
      return (`Set result of round #${currentRound.round}: ${currentRound.result}`);
    }
  }

  @call({privateFunction: true})
  set_winners({round}: {round: number}) {
    const storeOfSelectedRound = this.get_ticket_store_by_round({round: round})
    const selectedRound = this.get_specific_round({selectedRound: round});
    // When selected round has result and store of this round have tickets
    if (selectedRound.length > 0 && selectedRound[0].result.length > 0 && storeOfSelectedRound.length > 0 && storeOfSelectedRound[0].players.length > 0) {
      let winners: Winner[] = [];
      // Check each player in store
      storeOfSelectedRound[0].players.forEach(player => {
        let winnerDetails: WinnerDetails[] = [];
        let prizeSum: bigint = BigInt(0);

        // Check each ticket of player
        player.tickets.forEach(ticket => {
          let prizeAmount = '';
          // If number quantity of ticket is 3
          if (ticket.chosenNumber.length === 3) {
            // If round result is match 3
            if (check_duplicate_value(selectedRound[0].result, selectedRound[0].result[0]) === 3) {
              // This is "Any 3 matching numbers" type
              if (ticket.chosenNumber[0] === 0) {
                prizeAmount = (BigInt(ticket.betAmount) * BigInt(20)).toString();
              }
              // This is normal type
              else {
                if (check_duplicate_value(selectedRound[0].result, ticket.chosenNumber[0]) === 3) {
                  prizeAmount = (BigInt(ticket.betAmount) * BigInt(120)).toString();
                }
              }
            }
          } 
          // If number quantity of ticket is 2
          else if (ticket.chosenNumber.length === 2) {
            if (check_duplicate_value(selectedRound[0].result, ticket.chosenNumber[0]) === 2) {
              prizeAmount = ((BigInt(ticket.betAmount) * BigInt(75)) / BigInt(10)).toString();
            }
          }
          // If  number quantity of ticket is 1
          else if (ticket.chosenNumber.length === 1) {
            // If matching numbers is greater than 1 (2 or 3)
            const matchQuantity = check_duplicate_value(selectedRound[0].result, ticket.chosenNumber[0]);
            if (matchQuantity > 1) {
              prizeAmount = (BigInt(ticket.betAmount) * BigInt(matchQuantity)).toString();
            }
            // If matching numbers is 1
            else if (matchQuantity === 1) {
              prizeAmount = ((BigInt(ticket.betAmount) * BigInt(12)) / BigInt(10)).toString();
            }
          }

          if (prizeAmount) {
            prizeSum += BigInt(prizeAmount)
            const details = new WinnerDetails({
              wonNumber: ticket.chosenNumber,
              betAmount: ticket.betAmount,
              prizeAmount: prizeAmount,
            })
            winnerDetails = [...winnerDetails, details];
          }
        })

        const newWinner: Winner = new Winner({
          winner: player.playerId, 
          details: winnerDetails, 
          prizeSum: prizeSum.toString(), 
          isTransfered: false,
        })
        winners = [...winners, newWinner];
      })

      let winnerStore = this.winnerStorage.find(item => item.round === round);
      if (winnerStore) {
        winnerStore.winners = winners;
      } else {
        this.winnerStorage = [...this.winnerStorage, {round, winners}]
      }
      return `Set winners of round #${round}`;
    }
    else if (selectedRound.length === 0  || selectedRound[0].result.length === 0) {
      return `Round #${round} doesn't have result`;
    } else {
      return `Round #${round} doesn't have any player`
    }
  }

  @call({privateFunction: true})
  set_new_round() {
    const currentRound: Round = this.get_last_round();
    const newRound: Round = new Round({
      round: currentRound.round + 1,
      result: [],
      startTime: new Date(currentRound.endTime),
      endTime: new Date(new Date(currentRound.endTime).getTime() + 10*60000),
    })

    this.rounds = [...this.get_rounds(), newRound];
    return (`Create new round #${newRound.round}`);
  }

  @call({})
  proceed_bingo() {
    const generateResult = this.generate_result();
    const setWinners = this.set_winners({round: this.get_last_round().round});
    const setNewRound = this.set_new_round();
    return (`Results: \n${generateResult}\n${setWinners}\n${setNewRound}`)
  }

  @call({})
  transfer_prize({player, round}: {player: AccountId, round: number}) {
    const targetWinner = this.get_winner_by_player_and_round({player, round});
    if (targetWinner.length > 0) {
      NearPromise.new(targetWinner[0].winners[0].winner).transfer(BigInt(targetWinner[0].winners[0].prizeSum));
      targetWinner[0].winners[0].isTransfered = true;
      return `Transfered prize to ${targetWinner[0].winners[0].winner}`
    }
    else return `${player} isn't a winner!`
  }

  @view({})
  get_rounds(): Round[] {
    return this.rounds;
  }

  @view({})
  get_last_round(): Round {
    return this.rounds[this.rounds.length - 1]
  }

  @view({})
  get_specific_round({selectedRound}: {selectedRound: number}): Round[] {
    return this.rounds.filter(round => round.round === selectedRound)
  }

  @view({})
  get_tickets_by_player_and_round(
    { player, round }: { player: AccountId, round: number }
  ): PlayerStorage[] {
    let store: PlayerStorage[] = [];
    const targetRound = this.playerStorage.find(item => item.round === round);
    if (targetRound) {
      const targetPlayer = targetRound.players.find(target => target.playerId === player);
      if (targetPlayer) {
        store = [{round: targetRound.round, players: [targetPlayer]}]
      }
    }
    return store;
  }

  @view({})
  get_tickets_by_player({ player }: { player: AccountId }): PlayerStorage[] {
    let store: PlayerStorage[] = [];
    this.playerStorage.forEach(item => {
      const target: Player = item.players.find(item => item.playerId === player);
      if (target) {
        store = [...store, {round: item.round, players: [target]}]
      }
    });
    
    return store;
  }

  @view({})
  get_ticket_store_by_round({round}: {round: number}): PlayerStorage[] {
    return this.playerStorage.filter(item => item.round === round);
  }

  @view({})
  get_tickets(): PlayerStorage[] {
    return this.playerStorage;
  }

  @view({})
  get_winner_by_player_and_round({player, round}: {player: AccountId, round: number}): WinnerStorage[] {
    let store: WinnerStorage[] = [];
    const selectedWinnerStore = this.winnerStorage.find(store => store.round === round);
    if (selectedWinnerStore && selectedWinnerStore.winners.length > 0) {
      const selectedPlayer = selectedWinnerStore.winners.find(winner => winner.winner === player);
      if (selectedPlayer) {
        store = [{round: selectedWinnerStore.round, winners: [selectedPlayer]}]
      }
    }
    return store;
  }

  @view({})
  get_winners(): WinnerStorage[] {
    return this.winnerStorage;
  }
}
