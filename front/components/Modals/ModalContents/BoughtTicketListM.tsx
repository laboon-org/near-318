import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React, { useEffect, memo, useState } from 'react'
import {MdClose} from 'react-icons/md'
import { useConditionStore, useRoundStore, useWalletStore } from '../../../providers/RootStoreProvider';
import { contractAddress } from '../../../ultilities/contract_address';
import { Contract, PlayerList } from '../../../ultilities/near-interface';
import styles from './_ModalContents.module.scss'

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  playerList: PlayerList;
}

const BoughtTicketListM = observer(({setToggleModal, playerList}: Props) => {
  const conditionStore = useConditionStore();
  return (
    <div 
      className={`${styles['bought-tickets-modal']} ${styles['modal-content']}`}
      onClick={e => e.stopPropagation()}
    >
      <div className={`${styles['header']}`}>
        <h3>Round {playerList.round}</h3>
        <button type='button' onClick={() => setToggleModal(false)}>
          <i><MdClose size={20}/></i>
        </button>
      </div>
      <div className={`${styles['content']}`}>
        <h4>Your Tickets</h4>
        <div className={`${styles['ticket-list']}`}>
          {playerList.players[0].tickets.map((ticket, index) => (
            <div key={index} className={`${styles['ticket']}`}>
              <h5>#{index + 1}</h5>
              <div className={`${styles['ticket-number']}`}>
                {ticket.chosenNumber.map((number, index) => (
                  <p key={index}>{number === 0 ? '*' : number}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles['buy-ticket-btn']} ${!conditionStore.availableToBuyTicket && 'disabled'}`}>
          <Link href='/buy'>
            <a onClick={() => setToggleModal(false)}>Buy Ticket</a>
          </Link>
        </div>
      </div>
    </div>
  )
});

export default memo(BoughtTicketListM);