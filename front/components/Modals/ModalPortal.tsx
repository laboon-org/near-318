import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode
}

export default function ModalPortal({children}: Props) {
  return ReactDOM.createPortal(children, document.getElementById('app-modal')!)
}
