import { NearBindgen, near, call, view, initialize, NearPromise, bytes } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

import { PlayerStorage, Ticket, Round, WinnerStorage, Winner, Player, WinnerDetails } from './model';

const FIVE_TGAS = BigInt("50000000000000");
const NO_DEPOSIT = BigInt(0);
const NO_ARGS = bytes(JSON.stringify({}));
const STORAGE_COST: bigint = BigInt("1000000000000000000000000");
const YOC_TO_NEAR_RATIO = BigInt("1000000000000000000000000");

function get_current_date(): Date {
  const dateNano = near.blockTimestamp();
  const dateMili = Number(dateNano / BigInt(1000000));
  const currentDate = new Date(dateMili);
  return currentDate;
}

function get_fixed_date(): Date {
  const currentDate = get_current_date();
  const fixedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), (currentDate.getMinutes() - (currentDate.getMinutes() % 10)), 0)
  return fixedDate;
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
      startTime: get_fixed_date(),
      endTime: new Date(get_fixed_date().getTime() + 10 * 60000),
      prizePot: near.accountBalance().toString(),
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
      startTime: get_fixed_date(),
      endTime: new Date(get_fixed_date().getTime() + 10 * 60000),
      prizePot: near.accountBalance().toString(),
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

  @call({privateFunction: true})
  remove_last_rounds() {
    this.playerStorage.pop();
  }

  @call({payableFunction: true}) // This method changes the state, for which it cost gas
  add_ticket({ chosenNumber }: { chosenNumber: number[]}): string {
    if (chosenNumber && chosenNumber.length > 0) {
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
    else throw Error(`Doesn't have chosen number!`);
  }

  @call({privateFunction: true})
  generate_result() {
    const currentRound: Round = this.rounds[this.rounds.length - 1];
    const randomString = near.randomSeed();
    if (currentRound.result.length < 1) {
      currentRound.prizePot = near.accountBalance().toString();
      for(let i = 0; i < 3; i++) {
        const randomNumber = (randomString.charCodeAt(i) % 6) + 1;
        near.log("Random number: ", randomNumber);
        currentRound.result = [...currentRound.result, randomNumber];
      }
      return (`Set result of round #${currentRound.round}: ${currentRound.result}`);
    }
    else return (`This round's result has been set!`)
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
    const compareDate = new Date(get_current_date()).getTime() - new Date(currentRound.endTime).getTime();
    const newDate = compareDate >= 5*60000 ? new Date(get_fixed_date()) : new Date(currentRound.endTime);
    const newRound: Round = new Round({
      round: currentRound.round + 1,
      result: [],
      startTime: newDate,
      endTime: new Date(newDate.getTime() + 10*60000),
      prizePot: near.accountBalance().toString(),
    })

    this.rounds = [...this.get_rounds(), newRound];
    return (`Create new round #${newRound.round}`);
  }

  @call({privateFunction: true})
  proceed_bingo() {
    const generateResult = this.generate_result();
    const setWinners = this.set_winners({round: this.get_last_round().round});
    const setNewRound = this.set_new_round();
    return (`Results: \n${generateResult}\n${setWinners}\n${setNewRound}`)
  }

  @call({})
  transfer_prize({round}: {round: number}) {
    const player: AccountId = near.predecessorAccountId();
    const targetWinner = this.get_winner_by_player_and_round({player, round});
    if (targetWinner.length > 0 && !targetWinner[0].winners[0].isTransfered) {
      if (near.accountBalance() + STORAGE_COST <= BigInt(targetWinner[0].winners[0].prizeSum)) {
        throw Error(`Not enough money to transfer!`)
      }
      else {
        try {
          const promise = near.promiseBatchCreate(targetWinner[0].winners[0].winner)
          near.promiseBatchActionTransfer(promise, BigInt(targetWinner[0].winners[0].prizeSum))
          targetWinner[0].winners[0].isTransfered = true;
          return `Transfered ${targetWinner[0].winners[0].prizeSum} yoctoNear to ${targetWinner[0].winners[0].winner}`
        } catch (error) {
          throw Error(error);
        }
      }
    }
    else if (targetWinner.length <= 0 ) {
      throw Error(`${player} isn't a winner!`);
    }
    else if (targetWinner[0].winners[0].isTransfered) {
      throw Error(`${player} has claimed prize!`);
    }
    else throw Error(`Cannot transfer prize!`);
  }

  @view({})
  get_contract_balance(): string {
    return near.accountBalance().toString();
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
  get_winner_by_player({player}: {player: AccountId, round: number}): WinnerStorage[] {
    let store: WinnerStorage[] = [];
    this.winnerStorage.forEach(item => {
      const selectedPlayer = item.winners.find(winner => winner.winner === player);
      if (selectedPlayer) {
        store = [...store, {round: item.round, winners: [selectedPlayer]}]
      }
    })
    return store;
  }

  @view({})
  get_winner_by_round({round}: {round: number}): WinnerStorage[] {
    return this.winnerStorage.filter(store => store.round === round);
  }

  @view({})
  get_winners(): WinnerStorage[] {
    return this.winnerStorage;
  }
}
