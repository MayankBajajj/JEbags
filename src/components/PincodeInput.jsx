import { inputClasses } from "../lib/formStyles";

const PINCODE_REGEX = /^[1-9]\d{5}$/;

export default function PincodeInput({ name = "pincode", value, onChange, required = true }) {
  const touched = value.length > 0;
  const valid = PINCODE_REGEX.test(value);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange({ target: { name, value: digits } });
  };

  return (
    <div>
      <input
        required={required}
        name={name}
        value={value}
        onChange={handleChange}
        inputMode="numeric"
        maxLength={6}
        className={`${inputClasses} ${
          touched && !valid ? "border-red-300 focus:border-red-400 focus:ring-red-200/60" : ""
        }`}
        placeholder="6-digit pincode"
      />
      {touched && !valid && <p className="mt-1.5 text-xs text-red-600">Enter a valid 6-digit pincode</p>}
    </div>
  );
}
