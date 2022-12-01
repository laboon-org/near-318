import React from 'react'
import {HiArrowSmLeft} from 'react-icons/hi'
import { useRoundStore } from '../../../providers/RootStoreProvider';
import { formatDateShort } from '../../../ultilities/format-date';
import { PlayerList } from '../../../ultilities/near-interface';
import WinningNumber from '../../WinningNumber/WinningNumber';

import styles from './_ModalContents.module.scss'

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  playerList: PlayerList;
}

export default function PurchaseHistoryM({setToggleModal, playerList}: Props) {
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
      className={`${styles['round-history-modal']} ${styles['modal-content']}`}
      onClick={e => e.stopPropagation()}
    >
      <div className={`${styles['header']}`}>
        <button type='button' onClick={() => setToggleModal(false)}>
          <i><HiArrowSmLeft size={24}/></i>
        </button>
        <div className={`${styles['header-info']}`}>
          <div className={`${styles['header-input']}`}>
            <h4>Round {playerList.round}</h4>
          </div>
          <p>Draw {getRoundDate(playerList.round)}</p>
        </div>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['user-ticket']}`}>
          <h4>Your Tickets</h4>
          <div className={`${styles['details-wrap']}`}>
            <div className={`${styles['details']}`}>
              <h5>Total Ticket(s):</h5>
              <p>{playerList.players[0].tickets.length}</p>
            </div>
            <div className={`${styles['details']}`}>
              <h5>Ticket List:</h5>
              <div className={`${styles['number-list']}`}>
                {playerList.players[0].tickets.map((ticket, index) => (
                  <div className={`${styles['number']}`} key={index}>
                    {ticket.chosenNumber.map((number, index) => (
                      <p key={index}>{number}</p>
                    ))}
                  </div>
                ))}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
