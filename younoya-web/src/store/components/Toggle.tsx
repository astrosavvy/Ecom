/** Gold-knob toggle pill — replaces raw checkboxes. */
export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`ftoggle${checked ? " ftoggle--on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="ftoggle__track">
        <span className="ftoggle__knob" />
      </span>
      <span className="ftoggle__label">{label}</span>
    </button>
  )
}
