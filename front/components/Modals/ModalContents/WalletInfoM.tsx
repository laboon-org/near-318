import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import {MdClose} from 'react-icons/md'
import {TbCopy} from 'react-icons/tb'
import { useWalletStore } from '../../../providers/RootStoreProvider';
import LoadingSpin from '../../Loading/LoadingSpin';

import styles from './_ModalContents.module.scss'

const priceMultiList = [[10, 20, 50], [100, 200, 300], [500, 1000, 'All']];

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletInfoM = observer(({setToggleModal}: Props) => {
  const walletStore = useWalletStore();
  const [copy, setCopy] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);

  const handleCopy = ():void => {
    if (!copy) {
      navigator.clipboard.writeText(walletStore.accountId!);
      setCopy(true);
    }
  }

  const handleDisconnect = async(): Promise<void> => {
    try {
      walletStore.signOut()
    } catch (error) {
      console.error('[Error] Sign out: ', error);
    }
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
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 3000);
    }
  }, [copy]);

  return(
    <div 
      className={`${styles['wallet-info-modal']} ${styles['modal-content']} loading-container`}
      onClick={e => e.stopPropagation()}
    >
      {loading && (
        <LoadingSpin />
      )}
      <div className={`${styles['header']}`}>
        <h3>Wallet</h3>
        <button type='button' onClick={() => setToggleModal(false)}>
          <i><MdClose size={20}/></i>
        </button>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['address']}`}>
          <div className={`${styles['address-header']}`}>
            <p>Your Address</p>
            <button type='button' onClick={handleCopy}>
              <i><TbCopy size={24}/></i>
            </button>
          </div>
          <div className={`${styles['address-info']}`}>
            <input type='text' value={`${walletStore.accountId}`} readOnly />
          </div>
          {copy && 
          <div className={`${styles['address-copy']}`}>
            <p>Copied to Clipboard!</p>
          </div>
      }
        </div>
        <div className={`${styles['balance']}`}>
          <p className={`${styles['info']}`}>
            NEAR Balance
          </p>
          <p className={`${styles['info']}`}>
            {`${walletStore.accountBalance ? walletStore.accountBalance : '0.000'}`}
          </p>
        </div>
        <div className={`${styles['approve']}`}>
          <button 
            type='button' 
            className={`primary-btn`}
            onClick={() => setBalance()}
          >
            Approve NEAR
          </button>
          <button 
            type='button' 
            className={`tertiary-btn`}
            onClick={async() => await handleDisconnect()}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    </div>
  )
});

export default WalletInfoM