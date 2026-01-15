"use client";

import { forwardRef } from "react";
import Icon from "@/components/Icon";

const Input = forwardRef(({
  label,
  error,
  icon,
  type = "text",
  placeholder,
  className = "",
  bordered = true,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className={`form-control w-full ${className}`}>
      {(label || topRightLabel) && (
        <div className="label">
          {label && <span className="label-text font-medium">{label}</span>}
          {topRightLabel && <span className="label-text-alt">{topRightLabel}</span>}
        </div>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
            <Icon name={icon} size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            input w-full 
            ${bordered ? 'input-bordered' : ''} 
            ${error ? 'input-error' : ''} 
            ${icon ? 'pl-10' : ''}
            transition-all duration-200
          `}
          {...props}
        />
      </div>

      {(error || bottomLeftLabel || bottomRightLabel) && (
        <div className="label">
          {error && <span className="label-text-alt text-error font-medium">{error}</span>}
          {!error && bottomLeftLabel && <span className="label-text-alt">{bottomLeftLabel}</span>}
          {bottomRightLabel && <span className="label-text-alt">{bottomRightLabel}</span>}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;