export default function Input({
  label,
  type = "text",
  error = null,
  className = "",
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold mb-2">{label}</label>
      )}
      <input
        type={type}
        className={`input-field ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
