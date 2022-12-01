import React from 'react';

import styles from './_CheckMark.module.scss';

import IMG_CHECK_MARK from '../../assets/images/check-mark.svg'
import Image from 'next/image';

export default function BoughtMark() {
  return (
    <div className={`${styles['mark']} ${styles['bought-mark']}`}>
      <div>
        <p>Bought</p>
      </div>
    </div>
  )
}
