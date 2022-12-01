import React, { useState } from 'react'
import Image from 'next/image';

import styles from './_WinningNumber.module.scss'

import IMG_BINGO_1 from '../../assets/images/bingo1.svg';
import IMG_BINGO_2 from '../../assets/images/bingo2.svg';
import IMG_BINGO_3 from '../../assets/images/bingo3.svg';

const BINGO_BALLS = [IMG_BINGO_1, IMG_BINGO_2, IMG_BINGO_3];

interface Props {
  result: number[]
}

export default function WinningNumber({result}: Props) {
  return (
    <div className={`${styles['bingo-wrap']}`}>
      {result.length > 0 && result.map((number, index) => (
        <div className={`${styles['bingo-ball']}`} key={index}>
          <div className={`${styles['background']}`}>
            <Image src={BINGO_BALLS[index]} alt="Bingo" objectFit='contain'/>
          </div>
          <div className={`${styles['number']}`}>
            <p>{number}</p>
          </div>
      </div>
      ))}
    </div>
  )
}
