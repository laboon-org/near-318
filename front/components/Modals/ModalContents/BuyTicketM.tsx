import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import {MdClose} from 'react-icons/md'
import { useWalletStore } from '../../../providers/RootStoreProvider';
import { contractAddress } from '../../../ultilities/contract_address';
import { getAccountBalance } from '../../../ultilities/near-balance';
import { Contract } from '../../../ultilities/near-interface';
import CheckMark from '../../Marks/CheckMark';
import LoadingSpin from '../../Loading/LoadingSpin';

import styles from './_ModalContents.module.scss'

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  chosenNumbers: number[];
  handleBuyTicket: (chosenPrice: number | undefined) => Promise<void>
  loadingBuyTicket: boolean;
}

const priceMultiList = [[10, 20, 50], [100, 200, 300], [500, 1000, 1500], [2000, 3000, 5000]];

const BuyTicketM = observer(({setToggleModal, handleBuyTicket, loadingBuyTicket}: Props) => {
  const walletStore = useWalletStore();
  const [selectedPrice, setSelectedPrice] = useState<number | string | undefined>();
  const [chosenPrice, setChosenPrice] = useState<number | undefined>()
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectPrice = (selectedPrice: number | string) => {
    setSelectedPrice(selectedPrice);
  }

  const checkAvaialbePrice = (): boolean => {
    if (chosenPrice && walletStore.accountBalance && chosenPrice > Number(walletStore.accountBalance)) {
      return false;
    }
    return true;
  }

  // const checkAvailableBalance = (): boolean => {
  //   if (selectedPrice === 'All' && chosenPrice && chosenPrice < 10) {
  //     return false;
  //   }
  //   return true;
  // }

  // Buy Ticket
  const handleConfirms = async(): Promise<void> => {
    await handleBuyTicket(chosenPrice);
  }
  
  const setBalance = async() => {
    if (walletStore.isSignedIn && walletStore.accountId) {
      setLoading(true);
      try {
        await walletStore.setUserBalance();
      } catch (error) {
        console.error('[Error] Get balance: ', error);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedPrice) {
      if (selectedPrice === 'All') {
        setChosenPrice(Number(walletStore.accountBalance) - 0.1);
      }
      else {
        setChosenPrice(Number(selectedPrice))
      }
    }
  }, [selectedPrice, walletStore.accountBalance])

  return(
    <div 
      className={`${styles['buy-ticket-modal']} ${styles['modal-content']} loading-container`}
      onClick={e => e.stopPropagation()}
    >
      {(loading || loadingBuyTicket) && (
        <LoadingSpin />
      )}
      <div className={`${styles['header']}`}>
        <h3>Choose a price (NEAR)</h3>
        <button type='button' onClick={() => setToggleModal(false)}>
          <i><MdClose size={20}/></i>
        </button>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['price-table']} ${!walletStore.accountBalance && 'disabled'}`}>
          {priceMultiList.map((priceList, index) => (
            <div key={index} className={`${styles['row']}`}>
              {priceList.map((price, index) => (
                <div key={index} className={`${styles['item']}`}>
                  <button 
                    type='button'
                    className={`${price === selectedPrice && 'check-mark-container'}`}
                    onClick={() => handleSelectPrice(price)}
                  >
                    {price === selectedPrice && <CheckMark />}
                    {price}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={`${styles['balance']}`}>
          {!checkAvaialbePrice() && (
            <p className={`${styles['alert']}`}>
              Insufficient NEAR balance
            </p>
          )}
          {/* {!checkAvailableBalance() && (
            <p className={`${styles['alert']}`}>
              You need more than 10 NEAR to continue.
          </p>
          )} */}
          <p className={`${styles['info']}`}>
            {`Balance: ${walletStore.accountBalance ? walletStore.accountBalance : '0.000'}`} NEAR
          </p>
        </div>
        <div className={`${styles['approve']}`}>
          <button 
            type='button' 
            className={`primary-btn ${walletStore.accountBalance && 'disabled'}`}
            onClick={() => setBalance()}
          >
            Approve NEAR
          </button>
          {walletStore.accountBalance && (
            <button 
              type='button' 
              className={
                `tertiary-btn 
                ${
                  (!walletStore.accountBalance || !chosenPrice || !checkAvaialbePrice()) 
                  && 'disabled' 
                }`
              }
              onClick={async() => await handleConfirms()}
            >
              Agree
            </button>
          )}
        </div>
      </div>
    </div>
  )
});

export default BuyTicketM;