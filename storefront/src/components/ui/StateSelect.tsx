import React from 'react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

interface StateSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export default function StateSelect({ label = "State / Union Territory", error, ...props }: StateSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-[var(--yn-text)]">
        {label} {props.required && <span className="text-[var(--yn-error)]">*</span>}
      </label>
      <select
        className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-[var(--yn-border)] rounded-[var(--yn-radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--yn-accent)]"
        {...props}
      >
        <option value="">Select State / UT</option>
        {INDIAN_STATES.map((st) => (
          <option key={st} value={st}>{st}</option>
        ))}
      </select>
      {error && <span className="text-xs text-[var(--yn-error)]">{error}</span>}
    </div>
  );
}
