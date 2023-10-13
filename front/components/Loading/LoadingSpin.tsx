import React, { memo, useEffect, useState, useCallback } from "react";
import { delay } from '../../ultilities/delay';

import styles from './_Loading.module.scss';

interface Props {
  message?: string;
  hideContent?: boolean;
}

const LoadingSpin = ({message, hideContent}: Props): JSX.Element => {
  const [mes, setMes] = useState<string>('');
  const [numberOfDots, setNumberOfDots] = useState<number>(1);

  const messageWithLoadingDot = useCallback(
    async (message: string): Promise<void> => {
      let dots = "";
      await delay(1000);
      switch (numberOfDots) {
        case 1:
          dots = ".";
          break;
        case 2:
          dots = "..";
          break;
        case 3:
          dots = "...";
          break;
      }
      setNumberOfDots((numberOfDots) =>
        numberOfDots % 3 === 0 ? 1 : numberOfDots + 1
      );
      setMes(`${message}${dots}`);
    },
    [numberOfDots]
  );

  useEffect(() => {
    if (message) {
      messageWithLoadingDot(message);
    }
  }, [mes, message, messageWithLoadingDot])

  return (
    <div className={`${styles['loading-wrap']} ${hideContent && styles['hide-content']}`}>
      <div className={`${styles['loading-spin-wrap']}`}>
        <div className={`${styles['loading-spin']}`} />
      </div>
      {mes && <p>{mes}</p>}
    </div>
  )
}

export default memo(LoadingSpin)