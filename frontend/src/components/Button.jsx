import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  as = "button",
  ...props
}) {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger:
      "px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all",
  }[variant];

  const sizeClass = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }[size];
  const Component = as === "span" ? motion.span : motion.button;
  const isButton = as === "button";
  const sharedClass = `${variantClass} ${sizeClass} ${className} ${isButton ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`;

  const componentProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    className: sharedClass,
  };
  if (isButton) {
    componentProps.disabled = loading;
    // pass through any button-specific props (like type)
    Object.assign(componentProps, props);
  } else {
    // when rendering as a non-button element, avoid passing invalid button-only props
    Object.assign(componentProps, props);
    // ensure it's keyboard-accessible and has a button role
    if (!componentProps.role) componentProps.role = "button";
    if (componentProps.tabIndex === undefined) componentProps.tabIndex = 0;
    // remove `type` if supplied (invalid on span)
    if (componentProps.type) delete componentProps.type;
  }

  return (
    <Component {...componentProps}>
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="inline-block animate-spin mr-2">⚙️</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </Component>
  );
}
