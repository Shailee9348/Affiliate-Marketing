"use client";

import { useEffect } from "react";
import Icon from "@/components/Icon";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions,
  size = "max-w-lg",
  closeOnBackdropClick = true
}) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className={`modal-box relative ${size} shadow-2xl`}>
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          aria-label="Close modal"
        >
          <Icon name="X" size={20} />
        </button>
        
        {title && <h3 className="font-bold text-lg mb-4 pr-8">{title}</h3>}
        
        <div className="py-2">
          {children}
        </div>
        
        {actions && (
          <div className="modal-action">
            {actions}
          </div>
        )}
      </div>
      
      <div 
        className="modal-backdrop bg-black/50 backdrop-blur-sm" 
        onClick={closeOnBackdropClick ? onClose : undefined}
      ></div>
    </div>
  );
};

export default Modal;