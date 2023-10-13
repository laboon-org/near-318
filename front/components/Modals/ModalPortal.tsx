import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface Props {
  children: ReactNode;
}

export default function ModalPortal({ children }: Props) {
  return ReactDOM.createPortal(children, document.getElementById("app-modal")!);
}
