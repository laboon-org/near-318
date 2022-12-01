import React from 'react';

import styles from './_CheckMark.module.scss';

import IMG_CHECK_MARK from '../../assets/images/check-mark.svg'
import Image from 'next/image';

export default function CheckMark() {
  return (
    <div className={`${styles['mark']} ${styles['check-mark']}`}>
      <div>
        <Image src={IMG_CHECK_MARK} alt='' width={25} height={25} />
      </div>
    </div>
  )
}
