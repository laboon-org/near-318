import Image from 'next/image'

import styles from './_Footer.module.scss'

import IMG_LOGO from '../../assets/images/logo.svg'
import IMG_LABOON_LOGO from '../../assets/images/logo-laboon.svg'
import ICON_NETWORK from '../../assets/icons/network-icon.svg'
import {FiArrowRight} from 'react-icons/fi'
import { useRatioStore } from '../../providers/RootStoreProvider'
import { observer } from 'mobx-react-lite'

const MainFooter = observer(() => {
  const ratioStore = useRatioStore();
  return (
    <section className={`wrap ${styles['main-footer-wrap']}`}>
      <div className={`wrap ${styles['container']}`}>
        <div className={`${styles['logo']}`}>
          <Image src={IMG_LOGO} alt="B18" objectFit='contain'/>
        </div>
        <div className={`${styles['item']}`}>
          <div className={`${styles['network-info']}`}>
            <div className={`${styles['network-logo']}`} >
              <Image src={ICON_NETWORK} alt="Network" objectFit='contain' />
            </div>
          </div>
          <div className={`${styles['network-info']}`}>
            {ratioStore.ratioUSD !== 0 && <p>${ratioStore.ratioUSD}</p>}
          </div>
          <div className={`${styles['network-info']}`}>
            <button type='button' className={`primary-btn`}>
              <small>Buy NEAR</small>
              <i><FiArrowRight size={20}/></i>
            </button>
          </div>
        </div>
        <div className={`${styles['item']} ${styles['laboon']}`}>
          <div className={`${styles['laboon-info']} ${styles['laboon-logo']}`}>
            <Image src={IMG_LABOON_LOGO} alt="Laboon" objectFit='contain'/>
          </div>
          <div className={`${styles['laboon-info']}`}>
            <small>Designed by Laboon Innovation Technology.</small>
          </div>
        </div>
      </div>
    </section>
  )
});

export default MainFooter;
