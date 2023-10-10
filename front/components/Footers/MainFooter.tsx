import Image from 'next/image'

import styles from './_Footer.module.scss'

import IMG_LABOON_LOGO from '../../assets/images/logo-laboon.svg'
import ICON_NETWORK from '../../assets/icons/network-icon.svg'
import {FiArrowRight} from 'react-icons/fi'
import { useRatioStore } from '../../providers/RootStoreProvider'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'

const MainFooter = observer(() => {
  const ratioStore = useRatioStore();
  return (
    <section className={`wrap ${styles["main-footer-wrap"]}`}>
      <div className={`wrap ${styles["container"]}`}>
        <div className={`${styles["item"]}`}>
          <div className={`${styles["network-info"]}`}>
            <div className={`${styles["network-logo"]}`}>
              <Image src={ICON_NETWORK} alt="Network" objectFit="contain" />
            </div>
          </div>
          <div className={`${styles["network-info"]}`}>
            {ratioStore.ratioUSD !== 0 && <p>Market Price: ${ratioStore.ratioUSD}</p>}
          </div>
          <div className={`${styles["network-info"]}`}>
            <button type="button" className={`primary-btn`}>
              <small>Buy NEAR</small>
              <i>
                <FiArrowRight size={20} />
              </i>
            </button>
          </div>
        </div>
        <div className={`${styles["item"]} ${styles["laboon"]}`}>
          <div className={`${styles["laboon-info"]} ${styles["laboon-logo"]}`}>
            <Link href="https://laboon.org/">
              <a target="_blank">
                <Image src={IMG_LABOON_LOGO} alt="Laboon" objectFit="contain" />
              </a>
            </Link>
          </div>
          <div className={`${styles["laboon-info"]}`}>
            <small>Developer by Laboon Team, Copyright © 2023</small>
            <Link href="https://laboon.org/">
              <a target="_blank"></a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MainFooter;
