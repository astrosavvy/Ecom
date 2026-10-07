const fields = [
  ['firstName','First name','given-name'],['lastName','Last name','family-name'],['email','Email','email'],
  ['phone','Mobile number','tel'],['street','Street address','street-address'],['city','City','address-level2'],
  ['state','State','address-level1'],['pincode','PIN code','postal-code'],
]
export default function CheckoutFields({ address, onChange, locked }) {
  return <div className="checkout-fields">{fields.map(([key,label,autoComplete]) => <label key={key}>{label}<input
    required value={address[key]} autoComplete={autoComplete} readOnly={locked}
    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
    {...(key === 'pincode' ? { inputMode: 'numeric', pattern: '[1-9][0-9]{5}', maxLength: 6 } : {})}
    {...(key === 'phone' ? { pattern: '[0-9+ ()-]{10,18}' } : {})}
    onChange={event => onChange(key,event.target.value)} /></label>)}</div>
}
