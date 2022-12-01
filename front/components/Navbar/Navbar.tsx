import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import {BiExit} from 'react-icons/bi'

import styles from './_Navbar.module.scss';

import IMG_LOGO from '../../assets/images/logo.svg';
import ModalWrap from '../Modals/ModalWrap';
import WalletConnectionM from '../Modals/ModalContents/WalletConnectionM';
import NavMobileM from '../Modals/ModalContents/NavMobileM';
import { observer } from 'mobx-react-lite';
import { shortenWalletAddress } from '../../ultilities/shorten-wallet-address';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { usePageStore, useWalletStore } from '../../providers/RootStoreProvider';

const Navbar = observer(() => {
  const pageStore = usePageStore();
  const walletStore = useWalletStore();
  const [toggleWalletModal, setToggleWalletModal] = useState<boolean>(false);
  const [toggleNavMobileModal, setToggleNavMobileModal] = useState<boolean>(false);
  const [toggleWalletOptionMenu, setToggleWalletOptionMenu] = useState<boolean>(false);

  const handleSignOut = (): void => {
    try {
      walletStore.signOut()
    } catch (error) {
      console.error('[Error] Sign out: ', error);
    }
  }
  
  return (
    <section className={`wrap ${styles['nav-wrap']}`}>
      {/* Wallet Connection Modal */}
      {toggleWalletModal && 
        <ModalWrap setToggleModal={setToggleWalletModal}>
          <WalletConnectionM />
        </ModalWrap>
      }
      {/* Mobile Navbar Modal */}
      {toggleNavMobileModal &&
        <ModalWrap setToggleModal={setToggleNavMobileModal}>
          <NavMobileM setToggleModal={setToggleNavMobileModal}/>
        </ModalWrap>
      }
      {toggleWalletOptionMenu &&
        <ModalWrap setToggleModal={setToggleWalletOptionMenu}>
        </ModalWrap>
      }
      <nav className={`${styles['container']}`}>
        {/* Navbar left side */}
        <div className={`${styles['item-wrap']} ${styles['left']}`}>
          <div className={`${styles['item']} ${styles['logo']} ${pageStore.page === 'Home' && styles['active']}`}>
            <Link href='/'>
              <div>
                <Image src={IMG_LOGO} alt='B18' objectFit='contain'/>
              </div>
            </Link>
          </div>
          <div className={`${styles['item']} ${pageStore.page === 'Home' && styles['active']}`}>
            <Link href='/'>Home</Link>
          </div>
          <div className={`${styles['item']} ${pageStore.page === 'Buy' && styles['active']}`}>
            <Link href='/buy'>Buy Ticket</Link>
          </div>
          <div className={`${styles['item']} ${pageStore.page === 'Dashboard' && styles['active']}`}>
            <Link href='/dashboard'>My Dashboard</Link>
          </div>
        </div>

        {/* Navbar left side - Mobile */}
        <div className={`${styles['item-wrap']} ${styles['left-mobile']}`}>
          <button 
            type='button' 
            className={`${styles['menu-btn']} ${toggleNavMobileModal && styles['active']} `}
            onClick={() => setToggleNavMobileModal(toggleNavMobileModal => !toggleNavMobileModal)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Navbar right side */}
        <div className={`${styles['item-wrap']} ${styles['right']}`}>
          <div className={`${styles['item']}`}>
            <button type='button'  className={`${styles['connect-btn']} secondary-btn`}>Near</button>
          </div>
          {walletStore.isSignedIn && walletStore.accountId
          ?
            // Signed In
            <div className={`${styles['item']} ${styles['signed-in']}`}>
              <button 
                type='button'
                className={`${styles['connect-btn']} primary-btn`}
                onClick={() => setToggleWalletOptionMenu(toggleWalletOptionMenu => !toggleWalletOptionMenu)}
              >
                {shortenWalletAddress(walletStore.accountId, 2, 6)} 
                <i><MdKeyboardArrowDown size={20}/></i>
              </button>

              {/* Wallet Menu (after signed in) */}
              {toggleWalletOptionMenu && (
                <div className={`${styles['wallet-menu']}`}>
                  <div className={`${styles['menu-item']} `}>
                    <Link href='https://wallet.testnet.near.org/'>
                      <a target='_blank' onClick={() => setToggleWalletOptionMenu(false)}>
                        Wallet
                      </a>
                    </Link>
                  </div>
                  <div className={`${styles['menu-item']} `}>
                    <Link href='/dashboard'>
                      <a onClick={() => setToggleWalletOptionMenu(false)}>
                        My Dashboard
                      </a>
                    </Link>
                  </div>
                  <div className={`${styles['menu-item']} `}>
                    <button 
                      type='button' 
                      onClick={() => handleSignOut()}
                    >
                      <p>Disconnect</p> <span><i><BiExit size={22}/></i></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          :
            // Not Signed In
            <div className={`${styles['item']}`}>
              <button 
                type='button'
                className={`${styles['connect-btn']} primary-btn`}
                onClick={() => setToggleWalletModal(true)}
              >
                Connect <span>Wallet</span>
              </button>
            </div>
          }
        </div>
      </nav>
    </section>
  )
});

export default Navbar;