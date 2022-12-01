import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

import styles from './_History.module.scss'

import ModalWrap from '../Modals/ModalWrap';
import RoundHistoryM from '../Modals/ModalContents/RoundHistoryM';
import { useRoundStore, useWalletStore } from '../../providers/RootStoreProvider';
import HistoryNotAvailable from './HistoryNotAvailable';
import { Contract, WinnerList } from '../../ultilities/near-interface';
import { contractAddress } from '../../ultilities/contract_address';
import { formatDateShort } from '../../ultilities/format-date';

export default function HistoryUser() {
  const walletStore = useWalletStore();
  const roundStore = useRoundStore();
  const [winnerList, setWinnerList] = useState<WinnerList[]>([]);
  const [targetWinnerRound, setTargetWinnerRound] = useState<WinnerList>(winnerList[0])
  const [toggleHistoryModal, setToggleHistoryModal] = useState<boolean>(false);
  const [loadingClaimPrize, setLoadingClaimPrize] = useState<boolean>(false);

  const getWinnerListByPlayer = async(): Promise<void> => {
    if (contractAddress && walletStore.accountId) {
      const contract = new Contract({contractId: contractAddress, walletToUse: walletStore});
      setWinnerList(await contract.getWinnersByPlayer({player: walletStore.accountId}));
    }
  }

  const getRoundDate = (round: number): string => {
    const targetRound = roundStore.rounds.find(item => item.round === round)
    if (targetRound) {
      return formatDateShort(targetRound.endTime)
    }
    return '';
  }

  const handleClaimPrize = async(round: number): Promise<void> => {
    if (walletStore.accountId && contractAddress) {
      setLoadingClaimPrize(true);
      const contract = new Contract({contractId: contractAddress, walletToUse: walletStore});
      const result = await contract.transferPrize({round});
      console.log(result);
      await getWinnerListByPlayer();
      setLoadingClaimPrize(false);
      setToggleHistoryModal(false);
    }
  }

  const handleSelectRoundHistory = (winner: WinnerList) => {
    setTargetWinnerRound(winner);
    setToggleHistoryModal(true);
  }

  useEffect(() => {
    if (walletStore.isSignedIn) {
      getWinnerListByPlayer();
    }
  }, [walletStore.isSignedIn, walletStore.accountId])

  return (
    <div className={`${styles['history']} ${styles['history-user']}`}>
      {toggleHistoryModal &&
        <ModalWrap setToggleModal={setToggleHistoryModal}>
          <RoundHistoryM
            setToggleModal={setToggleHistoryModal} 
            winner={targetWinnerRound}
            loading={loadingClaimPrize}
            handleClaimPrize={handleClaimPrize}
          />
        </ModalWrap>
      }
      <div className={`${styles['round-content']}`}>
        {walletStore.isSignedIn 
          ? (
          winnerList.length > 0
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
                      <h4>Winning Ticket</h4>
                    </div>
                    <div className={`${styles['navigate']}`}></div>
                  </div>
                </div>
                
                <div className={`${styles['center-part']}`}>
                  {winnerList.map((item, index) => (
                    <div key={index} className={`${styles['history-info']}`}>
                      <div className={`${styles['column']} ${styles['round']}`}>
                        <p>#{item.round}</p>
                      </div>
                      <div className={`${styles['column']} ${styles['date-time']}`}>
                        <p>{getRoundDate(item.round)}</p>
                      </div>
                      <div className={`${styles['column']} ${styles['tickets']}`}>
                        <p>{item.winners[0].details.length}</p>
                      </div>
                      <div className={`${styles['navigate']}`}>
                        <button type='button' onClick={() => handleSelectRoundHistory(item)}>
                          <i><IoIosArrowForward size={24}/></i>
                        </button>
                      </div>
                    </div>
                  ))} 
                </div>
              </>
            )
            : (
              <HistoryNotAvailable type='no-history-user' />
            )
          )
          : (
            <HistoryNotAvailable type='not-signed-in' />
          )
        }
      </div>
    </div>
  )
}
