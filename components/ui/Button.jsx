"use client";

import Icon from "@/components/Icon";

const Button = ({
  children,
  variant = "primary", // primary, secondary, accent, info, success, warning, error, ghost, link, neutral
  outline = false,
  size = "md", // lg, md, sm, xs
  shape, // circle, square, wide, block
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = "btn";
  
  // Variant classes
  let variantClasses = "";
  if (variant && variant !== "default") {
    variantClasses = `btn-${variant}`;
  }
  
  // Outline
  const outlineClass = outline ? "btn-outline" : "";
  
  // Size
  const sizeClass = size ? `btn-${size}` : "";
  
  // Shape
  const shapeClass = shape ? `btn-${shape}` : "";
  
  // Combine all classes
  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses} 
    ${outlineClass} 
    ${sizeClass} 
    ${shapeClass} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-xs"></span>}
      
      {!loading && icon && iconPosition === "left" && (
        <Icon name={icon} size={size === 'xs' || size === 'sm' ? 16 : 20} />
      )}
      
      {children}

      {!loading && icon && iconPosition === "right" && (
        <Icon name={icon} size={size === 'xs' || size === 'sm' ? 16 : 20} />
      )}
    </button>
  );
};

export default Button;