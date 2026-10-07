import { ArrowRight, LockKeyhole } from 'lucide-react'
import LoginDialog from './LoginDialog'
import LoginFields, { loginChannelName } from './LoginFields'
import useLogin from '../../hooks/useLogin'
import '../../styles/GuideLogin.css'

export default function GuideLogin({ onSuccess, onCancel, purpose = 'continue' }) {
  const login = useLogin(onSuccess)
  const { loading, channels, channel, challenge, busy, error, remaining, expired, valid, code, run, change } = login
  const mobile = channels.filter(item => item !== 'email')
  const alternate = channel === 'email' ? mobile[0] : channels.includes('email') ? 'email' : null
  return <LoginDialog onClose={onCancel}>
    <div className="login-layout">
      <aside className="login-scene" aria-label="For every chapter">
        <img src="/media/younoya-hamper-hero-portrait-9x16.jpg" alt="A Younoya gift hamper with intentional keepsakes" />
        <img className="login-logo" src="/brand-legacy.webp" alt="Younoya" />
        <div className="login-scene__copy"><h2>A little meaning.<br /><em>Kept close.</em></h2><p>A place for your chosen pieces and the chapters they belong to.</p></div>
      </aside>
      <form className="login-form" onSubmit={event => { event.preventDefault(); run() }} aria-busy={Boolean(busy || loading)}>
        <img className="login-logo login-mobile-logo" src="/brand-legacy.webp" alt="Younoya" />
        <span className="login-kicker">Your Younoya account</span>
        <h1 id="login-title">{challenge ? 'A code, just for you.' : `Sign in to ${purpose}.`}</h1>
        <p className="login-intro">{challenge ? 'One small step back to your selection.' : 'Your chosen pieces, saved in one place. Sign in with a private verification code.'}</p>
        {loading ? <p className="login-field-note" role="status">Preparing your sign in…</p> : !channels.length
          ? <p className="login-error" role="alert">Sign in is temporarily unavailable. Please try again shortly.</p>
          : <>
            <LoginFields login={login} />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit" disabled={busy || !valid || (challenge ? code.length !== 6 || expired : remaining > 0)}>
              <span>{busy ? (busy === 'verify' ? 'Verifying…' : 'Requesting your code…') : challenge ? 'Verify & continue' : remaining ? `Try again in ${remaining}s` : `Send code by ${loginChannelName[channel]}`}</span><ArrowRight size={19} />
            </button>
            <div className="login-alternatives">
              {challenge ? <>
                <button className="login-link" type="button" disabled={busy} onClick={() => change()}>Change {channel === 'email' ? 'email' : 'number'}</button>
                <button className="login-link" type="button" disabled={busy || remaining > 0} onClick={() => run(true)}>
                  {remaining ? `Resend in ${remaining}s` : 'Resend code'}</button>
              </> : alternate && <button className="login-link" type="button" disabled={busy} onClick={() => change(alternate)}>Use {loginChannelName[alternate]} instead</button>}
            </div>
          </>}
        <p className="login-footnote"><LockKeyhole size={13} />Your code stays private. Your selection stays with you.</p>
      </form>
    </div>
  </LoginDialog>
}
