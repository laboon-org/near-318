import Image from 'next/image'

import IMG_LEFT from '../../assets/images/first-bg-left.svg';
import IMG_RIGHT from '../../assets/images/first-bg-right.svg';

import styles from './_Screens.module.scss';

interface Props {
  children: React.ReactNode;
}

export default function FirstScreen({children}: Props) {
  return (
    <section className={`wrap ${styles['first-screen']}`}>
      <div className={`${styles['background']} ${styles['left']}`}>
        <Image src={IMG_LEFT} alt='Left' objectFit='contain'/>
      </div>
      <div className={`${styles['background']} ${styles['right']}`}>
        <Image src={IMG_RIGHT} alt='Right' objectFit='contain' />
      </div>
      <div className={`wrap ${styles['content']}`}>
        {children}
      </div>
    </section>
  )
}
