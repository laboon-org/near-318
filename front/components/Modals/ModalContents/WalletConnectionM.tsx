import Image from 'next/image'
import React from 'react'

import styles from './_ModalContents.module.scss'

import ICON_NETOWRK from '../../../assets/icons/network-icon.svg'

import { observer } from 'mobx-react-lite'
import { useWalletStore } from '../../../providers/RootStoreProvider'

const WalletConnectionM = observer(() => {
  const walletStore = useWalletStore();

  const handleSignInWallet = (): void => {
    try {
      walletStore.signIn();
    } catch (error) {
      console.error('[Error] Sign in: ', error);
    }
  }
  return (
    <div 
      className={`${styles['wallet-connection-modal']} ${styles['modal-content']}`}
      onClick={e => e.stopPropagation()}
    >
      <div className={`${styles['content']}`}>
        <h4>Connect Wallet</h4>
        <p>
          Start by connecting with NEAR wallet. 
          Be sure to store your private keys or seed phrase securely.
          Never share them with anyone.
        </p>
        <div className={`${styles['logo']}`}>
          <Image src={ICON_NETOWRK} objectFit='contain' alt="Network" />
        </div>
        <button 
          type='button' 
          className='primary-btn'
          onClick={() => handleSignInWallet()}
        >
          Connect with NEAR
        </button>
      </div>
    </div>
  )
});
export default  WalletConnectionM;