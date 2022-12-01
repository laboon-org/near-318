import React, { useEffect, useState, memo } from 'react'
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import { checkPositiveIntNumberWOZero } from '../../ultilities/check-input-number';

import styles from './_History.module.scss'

import WinningNumber from '../WinningNumber/WinningNumber';
import { useRatioStore, useRoundStore } from '../../providers/RootStoreProvider';
import { Round } from '../../stores/RoundStore';
import { formatDateShort } from '../../ultilities/format-date';
import HistoryNotAvailable from './HistoryNotAvailable';
import { Contract, WinnerList } from '../../ultilities/near-interface';
import { contractAddress } from '../../ultilities/contract_address';
import { viewOnlyWallet } from '../../ultilities/view-only-wallet';
import { observer } from 'mobx-react-lite';
import { convertYoctoToNear } from '../../ultilities/near-balance';

const HistoryAll = observer(() => {
  const roundStore = useRoundStore();
  const ratioStore = useRatioStore();
  const [round, setRound] = useState<Round | undefined>();
  const [winnerList, setWinnerList] = useState<WinnerList[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Get winners of specific round
  const getWinnerListOfRound = async(round: number): Promise<void> => {
    const wallet = await viewOnlyWallet();
    const contract = new Contract({contractId: contractAddress, walletToUse: wallet});
    setWinnerList(await contract.getWinnersByRound({round}));
  }

  // Change round by input
  const handleInputRound = (value: string) => {
    if (roundStore.rounds.length > 1) {
      let limit = roundStore.rounds.length;
      if (roundStore.rounds[limit - 1].result.length === 0) {
        limit--;
      }
      const inputRound = checkPositiveIntNumberWOZero(value);
      if (inputRound) {
        let targetRound: number = Number(inputRound);
        if (targetRound > limit) targetRound = limit;
        console.log(targetRound);
        setRound(roundStore.rounds[targetRound - 1]);
      }
      else {
        setRound(undefined);
      }
    }
  }

  // Change round by clicking arrow button
  const handleChangeRound = (num: number) => {
    if (roundStore.rounds.length > 1) {
      let limit = roundStore.rounds.length;

      if (roundStore.rounds[limit - 1].result.length === 0) {
        limit--;
      }

      if (round) {
        let targetRound: number = Number(round.round) + num;
        if (targetRound < 1) targetRound = 1;
        if (targetRound > limit) targetRound = limit;
        setRound(roundStore.rounds[targetRound - 1]);
      }
      else {
        setRound(undefined);
      }
    }
  }

  const getWinningTickets = (matchAmount: number): number => {
    let count = 0;
    if (winnerList.length > 0) {
      winnerList[0].winners.forEach(winner => {
        winner.details.forEach(detail => {
          if (detail.wonNumber.length === matchAmount) {
            count++;
          }
        })
      })
    }
    return count;
  }

  // Set current round
  useEffect(() => {
    if (roundStore.rounds.length > 1) {
      let index = roundStore.rounds.length - 1;
      if (roundStore.rounds[index].result.length === 0) {
        index--;
      }
      setRound(roundStore.rounds[index]);
      
    }
  }, [roundStore.rounds])

  // Set winner list of specific round
  useEffect(() => {
    if (round) {
      getWinnerListOfRound(round.round);
    }
  }, [round])

  return (
    <div className={`${styles['history']} ${styles['history-all']}`}>
        <div className={`${styles['round-content']}`}>
          {roundStore.rounds.length > 1 
            ? (
              <>
                <div className={`${styles['upper-part']}`}>
                  <div className={`${styles['content']}`}>
                    <div className={`${styles['round-input']}`}>
                      <div className={`${styles['input-wrap']}`}>
                        <label htmlFor='round-input'>Round</label>
                        <input 
                          type='text'
                          id='round-input'
                          value={round ? round.round : ''}
                          onChange={e => handleInputRound(e.target.value)}
                        />
                      </div>
                      <p>Draw {round ? formatDateShort(round.endTime) : 'N/A'}</p>
                    </div>
                    <div className={`${styles['change-round']}`}>
                      <button
                        className={`${styles['left']}`} 
                        onClick={() => handleChangeRound(-1)}
                      >
                        <i><IoIosArrowBack size={20}/></i>
                      </button>
                      <button
                        className={`${styles['right']}`} 
                        onClick={() => handleChangeRound(1)}
                      >
                        <i><IoIosArrowForward size={20}/></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`${styles['center-part']}`}>
                  <h4>Winning Number</h4>
                  <div>
                    <WinningNumber result={round ? round.result : []}/>
                  </div>
                </div>
                <div className={`${styles['lower-part']}`}>
                  {showDetails &&
                    <div className={`${styles['detail-content']}`}>
                      <div className={`${styles['content']} ${styles['summary']}`}>
                        <div className={`${styles['left']}`}>
                          <h4>Prize Pot</h4>
                          {(ratioStore.ratioUSD !== 0 && round) 
                            ? <p>~${(Number(convertYoctoToNear(round.prizePot)) * ratioStore.ratioUSD).toFixed(2)}</p> 
                            : <p>$???</p>
                          }
                          <span>{round ? convertYoctoToNear(round.prizePot) : '???'} NEAR</span>
                          {/* TODO: Convert to USD with API */}
                        </div>
                        <div className={`${styles['right']}`}>
                          <h4>Total player this round</h4>
                            <p>{winnerList.length > 0 ? winnerList[0].winners.length : 0}</p>
                          <span>Players</span>
                        </div>
                      </div>
                      <div className={`${styles['content']} ${styles['matches']}`}>
                        <div className={`${styles['match']}`}>
                          <h5>Match 1</h5>
                          <p>{getWinningTickets(1)} Winning Tickets</p>
                        </div>
                        <div className={`${styles['match']}`}>
                          <h5>Match 2</h5>
                          <p>{getWinningTickets(2)} Winning Tickets</p>
                        </div>
                        <div className={`${styles['match']}`}>
                          <h5>Match 3</h5>
                          <p>{getWinningTickets(3)} Winning Tickets</p>
                        </div>
                      </div>
                    </div>
                  }
                  {round && (
                    <div className={`${styles['detail-trigger']}`}>
                      <button type='button' onClick={() => setShowDetails((showDetails) => !showDetails)}>
                        <p>{showDetails ? 'Hide': 'Detail'}</p>
                        <i>
                          {showDetails 
                          ?
                            <IoIosArrowUp size={24} />
                          :
                            <IoIosArrowDown size={24} />
                          }
                        </i>
                      </button>
                    </div>
                  )}
              </div>
              </>
            )
            : (
              <HistoryNotAvailable type='no-history-all' />
            )
          }
        </div>
      </div>
  )
});

export default memo(HistoryAll)