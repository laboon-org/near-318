import React from 'react'

import styles from './_Instruction.module.scss'

export default function Instruction() {
  return (
    <article className={`${styles['instruction-wrap']}`}>
      <div className={`${styles['header']} highlight`}>
        <h2 className='content-header'>HOW TO PLAY</h2>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['step']}`}>
          <h4>STEP 1</h4>
          <h3>BUY TICKET</h3>
          <p>
            Select the number on the board. Select the amount for each ticket.
          </p>

        </div>
        <div className={`${styles['step']}`}>
          <h4>STEP 2</h4>
          <h3>WAIT FOR THE DRAW</h3>
          <p>
            The draw continuously for every 10 minutes.
          </p>
        </div>
        <div className={`${styles['step']}`}>
          <h4>STEP 3</h4>
          <h3>CHECK FOR PRIZE</h3>
          <p>
            Once the round’s over, come back to the page and check to see if you’ve won!
          </p>
        </div>
      </div>
    </article>
  )
}
