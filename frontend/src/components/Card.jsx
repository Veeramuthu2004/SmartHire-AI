import { motion } from "framer-motion";

export default function Card({ children, className = "", onClick = null }) {
  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
