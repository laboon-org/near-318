import React, { useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import styles from './_History.module.scss'

import HistoryAll from './HistoryAll';
import HistoryUser from './HistoryUser';

export default function History() {
  const [switchContent, setSwitchContent] = useState<number>(1);

  const handleSwitch = (index: number): void => {
    setSwitchContent(index);
  }
  
  return (
    <article className={`${styles['w-number-wrap']}`}>
      <div className={`${styles['header']} highlight`}>
        <h2 className='content-header'>WINNING NUMBER</h2>
      </div>
      <div className={`${styles['switch-wrap']}`}>
        <div className={`${styles['switch']}`}>
          <button type='button'
            className={`${switchContent === 1 ? styles['active'] : styles['inactive']}`}
            onClick={() => handleSwitch(1)}
          >
            All History
          </button>
          <button type='button'
            className={`${switchContent === 2 ? styles['active'] : styles['inactive']}`}
            onClick={() => handleSwitch(2)}
          >
            Your History
          </button>
        </div>
      </div>
      {switchContent === 1 && 
        <HistoryAll />
      }
      {switchContent === 2 && 
        <HistoryUser />
      }
    </article>
  )
}
