import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Alert({ type = "info", message, onClose }) {
  const bgColor = {
    success: "bg-green-100 dark:bg-green-900",
    error: "bg-red-100 dark:bg-red-900",
    warning: "bg-yellow-100 dark:bg-yellow-900",
    info: "bg-blue-100 dark:bg-blue-900",
  }[type];

  const textColor = {
    success: "text-green-800 dark:text-green-100",
    error: "text-red-800 dark:text-red-100",
    warning: "text-yellow-800 dark:text-yellow-100",
    info: "text-blue-800 dark:text-blue-100",
  }[type];

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded-lg flex items-center justify-between mb-4`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold">
          ×
        </button>
      )}
    </div>
  );
}
