import { ArrowRight } from 'lucide-react'

export default function ProductPersonalization({
  personalRef,
  recipient,
  onRecipientChange,
  message,
  onMessageChange,
  personalizedNote,
  onClose,
  onSubmit
}) {
  return (
    <div ref={personalRef} className="livora-personalize">
      <div className="livora-personalize__box">
        <div className="livora-personalize__head">
          <div>
            <span className="livora-kicker">PERSONALIZED ATELIER SCROLL</span>
            <h3>Inscribe with Intention</h3>
          </div>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <label htmlFor="p-recipient">Who is this consecrated for? <span>OPTIONAL</span></label>
        <input 
          id="p-recipient" 
          type="text" 
          maxLength={60} 
          placeholder="e.g. Ananya, or 'For myself'" 
          value={recipient}
          onChange={e => onRecipientChange(e.target.value)}
        />

        <label htmlFor="p-message">Your Personal Words <span>OPTIONAL • {message.length}/240</span></label>
        <textarea 
          id="p-message" 
          rows={3} 
          maxLength={240} 
          placeholder="A wish, blessing or quiet thought worth preserving..."
          value={message}
          onChange={e => onMessageChange(e.target.value)}
        />

        <div className="livora-personalize__parchment">
          <div className="livora-personalize__parchment-stamp">YOUNOYA CONSECRATION</div>
          <p className="livora-personalize__parchment-text">
            {personalizedNote || 'Your custom message will be lovingly inscribed on 300gsm cotton rag parchment.'}
          </p>
        </div>

        <button 
          type="button" 
          className="livora-btn livora-btn--dark livora-btn--full"
          onClick={onSubmit}
        >
          Add Personalized Keepsake <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
