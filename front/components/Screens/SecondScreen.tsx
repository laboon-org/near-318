import Image from 'next/image';
import React from 'react'

import styles from './_Screens.module.scss';

import IMG_BG from '../../assets/images/second-bg.svg'

interface Props {
  children: React.ReactNode;
}

export default function SecondScreen({children}: Props) {
  return (
    <section className={`wrap ${styles['second-screen']}`}>
      <div className={`${styles['second-screen-bg']}`}>
        <Image src={IMG_BG} alt="Background" objectFit='contain'/>
      </div>
      <div className={`wrap ${styles['content']}`}>
        {children}
      </div>
    </section>
  )
}
