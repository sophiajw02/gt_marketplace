import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root") as HTMLElement;

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const [el] = useState(document.createElement("div"));

  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  // Directly return null if not isOpen to prevent any interaction when modal is supposed to be closed
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50 opacity-100 transition-opacity duration-300">
      <div
        className={`bg-white p-5 rounded-lg max-w-2xl w-full relative ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-none border-none text-2xl cursor-pointer"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    el,
  );
};
