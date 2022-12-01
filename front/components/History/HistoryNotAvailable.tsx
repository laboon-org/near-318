import Link from 'next/link';
import React, { useState } from 'react'
import WalletConnectionM from '../Modals/ModalContents/WalletConnectionM';
import ModalWrap from '../Modals/ModalWrap';
import styles from './_History.module.scss'

interface Props {
  type: string;
}

const HistoryNotAvailable = ({type}: Props) => {
  const [toggleWalletModal, setToggleWalletModal] = useState<boolean>(false);
  return (
    <>
      {toggleWalletModal && 
        <ModalWrap setToggleModal={setToggleWalletModal}>
          <WalletConnectionM />
        </ModalWrap>
      }
      <div className={`${styles['upper-part']}`}>
        <div className={`${styles['content']}`}>
          <div className={`${styles['column']} ${styles['round']}`}>
            <h4>Round</h4>
          </div>
        </div>
      </div>
      <div className={`${styles['history-not-available']}`}>
        {type === 'no-history-all' && (
          <div className={`${styles['no-history-all']}`}>
            No History
          </div>
        )}
        {type === 'no-history-user' && (
          <div className={`${styles['user']} ${styles['no-history']}`}>
            <h6>No history found</h6>
            <p>Buy ticket for the next round</p>
            <div className={`${styles['buy-ticket-btn']}`}>
              <Link href='/buy'>
                Buy Ticket
              </Link>
            </div>
          </div>
        )}
        {type === 'not-signed-in' && (
          <div className={`${styles['user']} ${styles['not-signed-in']}`}>
            <p>Connect your wallet to check your history</p>
            <button 
              type='button'
              className={`${styles['connect-btn']} primary-btn`}
              onClick={() => setToggleWalletModal(true)}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
      
    </>
  )
}

export default HistoryNotAvailable