import { inputClasses } from "../lib/formStyles";

const PHONE_REGEX = /^[6-9]\d{9}$/;

export default function PhoneInput({
  name = "phone",
  value,
  onChange,
  required = true,
  placeholder = "10-digit mobile number",
}) {
  const touched = value.length > 0;
  const valid = PHONE_REGEX.test(value);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
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
        maxLength={10}
        className={`${inputClasses} ${
          touched && !valid ? "border-red-300 focus:border-red-400 focus:ring-red-200/60" : ""
        }`}
        placeholder={placeholder}
      />
      {touched && !valid ? (
        <p className="mt-1.5 text-xs text-red-600">10 digits, starting with 6-9 (no leading 0-5)</p>
      ) : (
        <p className="mt-1.5 text-xs text-ink-700/50">e.g. 9876543210</p>
      )}
    </div>
  );
}
