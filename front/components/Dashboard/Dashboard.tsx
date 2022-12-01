import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import styles from './_Dashboard.module.scss';

import IMG_LOGO from '../../assets/images/logo.svg'
import { IoIosArrowForward } from 'react-icons/io';
import { useRoundStore, useWalletStore } from '../../providers/RootStoreProvider';
import DashboardNotAvailable from './DashboardNotAvailable';
import { contractAddress } from '../../ultilities/contract_address';
import { Contract, PlayerList } from '../../ultilities/near-interface';
import { formatDateShort } from '../../ultilities/format-date';
import ModalWrap from '../Modals/ModalWrap';
import PurchaseHistoryM from '../Modals/ModalContents/PurchaseHistoryM';

export default function Dashboard() {
  const walletStore = useWalletStore();
  const roundStore = useRoundStore();
  const [playerList, setPlayerList] = useState<PlayerList[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerList | undefined>();
  const [togglePurchaseModal, setTogglePurchaseModal] = useState<boolean>(false);

  const getRoundDate = (round: number): string => {
    const targetRound = roundStore.rounds.find(item => item.round === round)
    if (targetRound) {
      return formatDateShort(targetRound.endTime)
    }
    return '';
  }

  const handleTicketDetails = (ticket: PlayerList): void => {
    setSelectedPlayer(ticket);
    setTogglePurchaseModal(true);
  }

  const loadPlayer = async() => {
    if (contractAddress && walletStore.accountId) {
      const contract = new Contract({contractId: contractAddress, walletToUse: walletStore})
      setPlayerList(
        await contract.getTicketsByPlayer({
          player: walletStore.accountId, 
        }
      ));
    }
  }
  
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (walletStore.isSignedIn) {
        loadPlayer();
      }
    }
    return () => {isMounted = false}
  }, [walletStore.isSignedIn])

  return (
    <article className={`${styles['dashboard-wrap']}`}>
      {togglePurchaseModal && selectedPlayer && (
        <ModalWrap setToggleModal={setTogglePurchaseModal}>
          <PurchaseHistoryM setToggleModal={setTogglePurchaseModal} playerList={selectedPlayer}/>
        </ModalWrap>
      )}
      <div className={`${styles['header']} highlight`}>
        <h2 className='content-header'>TICKET PURCHASE HISTORY</h2>
      </div>
      <div className={`${styles['history']}`}>
        <div className={`${styles['round-content']}`}>   
          {walletStore.isSignedIn 
            ? (
              playerList.length > 0 
              ? (
                <>
                  <div className={`${styles['upper-part']}`}>
                    <div className={`${styles['content']}`}>
                      <div className={`${styles['column']} ${styles['round']}`}>
                        <h4>Round</h4>
                      </div>
                      <div className={`${styles['column']} ${styles['date-time']}`}>
                        <h4>Date & Time</h4>
                      </div>
                      <div className={`${styles['column']} ${styles['tickets']}`}>
                        <h4>Your Ticket</h4>
                      </div>
                      <div className={`${styles['navigate']}`}></div>
                    </div>
                  </div>
                  
                  <div className={`${styles['center-part']}`}>
                    {playerList.map((player, index) => (
                      <div className={`${styles['history-info']}`} key={index}>
                        <div className={`${styles['column']} ${styles['round']}`}>
                          <p>#{player.round}</p>
                        </div>
                        <div className={`${styles['column']} ${styles['date-time']}`}>
                          <p>
                            {getRoundDate(player.round)}
                          </p>
                        </div>
                        <div className={`${styles['column']} ${styles['tickets']}`}>
                          <p>{player.players[0].tickets.length}</p>
                        </div>
                        <div className={`${styles['navigate']}`}>
                          <button type='button' onClick={() => handleTicketDetails(player)}>
                            <i><IoIosArrowForward size={24}/></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
              : (
                <DashboardNotAvailable type='no-history-user'/>
              )
            )
            : (
              <DashboardNotAvailable type='not-signed-in'/>
            )
          }
        </div>
      </div>
      
    </article>
  )
}
