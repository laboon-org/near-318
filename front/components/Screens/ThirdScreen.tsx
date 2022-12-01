import React from 'react'

import styles from './_Screens.module.scss';

interface Props {
  children: React.ReactNode;
}

export default function ThirdScreen({children}: Props) {
  return (
    <section className={`wrap ${styles['third-screen']}`}>
      <div className={`wrap ${styles['content']}`}>
        {children}
      </div>
    </section>
  )
}
