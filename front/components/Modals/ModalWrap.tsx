import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import styles from './_Modals.module.scss';

interface Props {
  setToggleModal?: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function ModalWrap({setToggleModal, children}: Props) {

  const closeModal = (): void => {
    if (setToggleModal) {
      setToggleModal(false);
    }
  }

  return (
    <ModalPortal>
      <div 
        className={`${styles['modal-wrap']}`}
        onClick={() => closeModal()}
      >
        {children}
      </div>
    </ModalPortal>
  )
};

