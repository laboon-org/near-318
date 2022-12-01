import React from 'react'
import Image from 'next/image';
import Link from 'next/link'

import IMG_LOGO from '../../../assets/images/logo.svg';

import styles from './_ModalContents.module.scss'
import { observer } from 'mobx-react-lite';
import { usePageStore } from '../../../providers/RootStoreProvider';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavMobileM = observer(({setToggleModal}: Props) => {
  const pageStore = usePageStore();
  return (
    <div 
      className={`${styles['nav-mobile-modal']}`}
      onClick={e => e.stopPropagation()}
    >
      <div className={`${styles['item-wrap']}`}>
        <div className={`${styles['item']} ${styles['logo']}`}>
          <Link href='/'>
            <a onClick={() => setToggleModal(false)}>
              <Image src={IMG_LOGO} alt='B18' objectFit='contain'/>
            </a>
          </Link>
        </div>
        <div className={`${styles['item']} ${pageStore.page === 'Home' && styles['active']}`}>
          <Link href='/'>
            <a onClick={() => setToggleModal(false)}>Home</a> 
          </Link>
        </div>
        <div className={`${styles['item']} ${pageStore.page === 'Buy' && styles['active']}`}>
          <Link href='/buy'>
            <a onClick={() => setToggleModal(false)}>Buy Ticket</a> 
          </Link>
        </div>
        <div className={`${styles['item']} ${pageStore.page === 'Dashboard' && styles['active']}`}>
          <Link href='/dashboard'>
            <a onClick={() => setToggleModal(false)}>My Dashboard</a> 
          </Link>
        </div>
      </div>
    </div>
  )
});

export default NavMobileM;