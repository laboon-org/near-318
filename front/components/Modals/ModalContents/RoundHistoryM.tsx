import { observer } from 'mobx-react-lite';
import { utils } from 'near-api-js';
import React, { memo, useState } from 'react'
import {HiArrowSmLeft} from 'react-icons/hi'
import { useRoundStore, useWalletStore } from '../../../providers/RootStoreProvider';
import { contractAddress } from '../../../ultilities/contract_address';
import { formatDateShort } from '../../../ultilities/format-date';
import { Contract, WinnerList } from '../../../ultilities/near-interface';
import LoadingSpin from '../../Loading/LoadingSpin';
import WinningNumber from '../../WinningNumber/WinningNumber';

import styles from './_ModalContents.module.scss'

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  winner: WinnerList;
  loading: boolean;
  handleClaimPrize: (round: number) => Promise<void>
}

const RoundHistoryM = observer(({setToggleModal, winner, loading, handleClaimPrize}: Props) => {
  const walletStore = useWalletStore();
  const roundStore = useRoundStore();
  const getRoundDate = (round: number): string => {
    const targetRound = roundStore.rounds.find(item => item.round === round)
    if (targetRound) {
      return formatDateShort(targetRound.endTime)
    }
    return '';
  }

  return (
    <div 
      className={`${styles['round-history-modal']} ${styles['modal-content']} loading-container`}
      onClick={e => e.stopPropagation()}
    >
      {loading && (
        <LoadingSpin />
      )}
      <div className={`${styles['header']}`}>
        <button type='button' onClick={() => setToggleModal(false)}>
          <i><HiArrowSmLeft size={24}/></i>
        </button>
        <div className={`${styles['header-info']}`}>
          <div className={`${styles['header-input']}`}>
            <h4>Round</h4>
            <input type='text' value={winner.round} readOnly/>
          </div>
          <p>Draw {getRoundDate(winner.round)}</p>
        </div>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['winning-number']}`}>
          <h4>Winning Number</h4>
          <span><WinningNumber result={roundStore.rounds.find(item => item.round === winner.round)!.result}/></span>
        </div>
        <div className={`${styles['user-ticket']}`}>
          <h4>Your Tickets</h4>
          <div className={`${styles['details-wrap']}`}>
            <div className={`${styles['details']}`}>
              <h5>Winning Ticket(s):</h5>
              <p>{winner.winners[0].details.length}</p>
            </div>
            <div className={`${styles['details']}`}>
              <h5>Winning Ticket List:</h5>
              <div className={`${styles['number-list']}`}>
                {winner.winners[0].details.map((detail, index) => (
                  <div className={`${styles['number']}`} key={index}>
                    {detail.wonNumber.map((number, index) => (
                      <p key={index}>{number}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles['user-ticket']} ${styles['custom-margin']}`}>
          <h4>Prize</h4>
          <div className={`${styles['details-wrap']}`}>
            <div className={`${styles['details']}`}>
              <h5>Total Prize:</h5>
              <p>{Number(utils.format.formatNearAmount(winner.winners[0].prizeSum)).toFixed(4)} NEAR</p>
            </div>
          </div>
        </div>
      </div>
      {winner.winners[0].details.length > 0 && (
        !winner.winners[0].isTransfered 
          ? (
            <div className={`${styles['claim-prize']}`}>
              <button
                type='button'
                onClick={() => handleClaimPrize(winner.round)}
              >
                Claim Prize
              </button>
            </div>
            )
          : (
            <div className={`${styles['claim-prize']}`}>
              <button
                type='button'
                className='disabled'
              >
                Claimed
              </button>
            </div>
          )
        )
      }
    </div>
  )
});

export default memo(RoundHistoryM);