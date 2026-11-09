import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Mail, X } from 'lucide-react';
import { CONTACT, projectOptions, whatsappLink, type Product, type QuoteDefaults } from '../data';
import { WhatsAppIcon } from './Brand';

function DialogShell({ children, labelId, className = '', onClose }: {
  children: ReactNode;
  labelId: string;
  className?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function wrapTabFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const dialog = event.currentTarget;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${className}`}
      aria-labelledby={labelId}
      onKeyDown={wrapTabFocus}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <button type="button" className="modal-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={21} /></button>
      <div className="modal-surface">{children}</div>
    </dialog>
  );
}

export function ProductDialog({ product, onClose, onQuote }: {
  product: Product;
  onClose: () => void;
  onQuote: (defaults: QuoteDefaults) => void;
}) {
  return (
    <DialogShell labelId="product-dialog-title" className="product-modal" onClose={onClose}>
      <div className="product-dialog-image">
        <img src={product.image} alt={product.alt} width="1200" height="800" />
      </div>
      <div className="product-dialog-content">
        <p className="eyebrow">A SPACE THAT'S YOURS</p>
        <h2 id="product-dialog-title">{product.name}</h2>
        <p className="product-dialog-intro">{product.introduction}</p>
        <h3>Make room for the possibilities.</h3>
        <ul className="check-list">
          {product.possibilities.map((item) => <li key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></li>)}
        </ul>
        <p className="product-dialog-detail">{product.detail}</p>
        <button className="button button-dark" onClick={() => onQuote({ project: product.project })}>Let's make it yours <ArrowRight size={18} /></button>
        <p className="image-disclaimer">Design imagery is illustrative. Every build is made to order.</p>
      </div>
    </DialogShell>
  );
}

export function QuoteDialog({ defaults, onClose }: { defaults: QuoteDefaults; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    project: defaults.project || '',
    size: defaults.size || '',
    location: '',
    notes: defaults.notes || '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (error) setError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = form.phone.replace(/\D/g, '');
    const invalidField = !form.name.trim() ? 'name' :
      (!/^[+\d\s()-]+$/.test(form.phone) || digits.length < 7 || digits.length > 15) ? 'phone' :
        !form.location.trim() ? 'location' : null;

    if (invalidField) {
      setError(invalidField === 'phone' ? 'Please enter a valid contact number, including your area or country code.' : `Please enter your ${invalidField === 'name' ? 'name' : 'town or city'}.`);
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${invalidField}"]`)?.focus();
      return;
    }

    const request = [
      `Hi Leo! I'm ${form.name.trim()} and I'd like a quote from Leo Wendy Huts.`,
      '',
      `Project: ${form.project}`,
      `Size / layout: ${form.size.trim() || 'Please help me choose'}`,
      `Location: ${form.location.trim()}`,
      `Contact number: ${form.phone.trim()}`,
      ...(form.notes.trim() ? ['', `More about my idea: ${form.notes.trim()}`] : []),
      '',
      'Please let me know the available options, confirmed inclusions, delivery costs and estimated timeframe. Thank you!',
    ].join('\n');

    setMessage(request);
    // A click-to-chat handoff lets visitors review their details before sending.
    window.open(whatsappLink(request), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  }

  return (
    <DialogShell labelId="quote-dialog-title" className="quote-modal" onClose={onClose}>
      {submitted ? (
        <div className="quote-success">
          <div className="success-mark"><Check size={30} strokeWidth={1.7} /></div>
          <p className="eyebrow">THE FIRST STEP TO YOUR NEW SPACE</p>
          <h2 id="quote-dialog-title" ref={successRef} tabIndex={-1}>Your idea is ready<br />to meet Leo.</h2>
          <p>We've prepared your message in WhatsApp. Review it there and tap send to request your personal quote.</p>
          <div className="request-summary">
            <div><span>Your space</span><strong>{form.project}</strong></div>
            {form.size.trim() && <div><span>Size / layout</span><strong>{form.size}</strong></div>}
            <div><span>Your location</span><strong>{form.location}</strong></div>
          </div>
          <a className="button button-dark" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={20} height={20} /> Open WhatsApp <ArrowUpRight size={18} /></a>
          <a className="quote-email" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Quote request: ${form.project}`)}&body=${encodeURIComponent(message)}`}><Mail size={17} /> Prefer email? Send your request by email.</a>
          <p className="form-privacy">Your request is only sent when you send it in WhatsApp or email.</p>
          <button className="text-button" onClick={() => setSubmitted(false)}><ArrowLeft size={16} /> Edit my details</button>
        </div>
      ) : (
        <div className="quote-form-content">
          <p className="eyebrow">LET'S BUILD SOMETHING GOOD</p>
          <h2 id="quote-dialog-title">Make room for your idea.</h2>
          <p className="quote-intro">Tell us a little about your space. Leo will take it from here.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-field">Your name <span className="required">*</span>
                <input name="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="First and last name" autoComplete="name" required minLength={2} maxLength={100} />
              </label>
              <label className="form-field">Contact number <span className="required">*</span>
                <input name="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="e.g. 072 123 4567" autoComplete="tel" required minLength={7} maxLength={24} />
              </label>
            </div>
            <label className="form-field">What would you like to build? <span className="required">*</span>
              <span className="select-wrap">
                <select name="project" value={form.project} onChange={(e) => update('project', e.target.value)} required>
                  <option value="" disabled>Choose your kind of space</option>
                  {projectOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <ChevronDown size={17} aria-hidden="true" />
              </span>
            </label>
            <div className="form-row">
              <label className="form-field">Size or layout <span className="optional">(optional)</span>
                <input name="size" value={form.size} onChange={(e) => update('size', e.target.value)} placeholder="e.g. 4m x 8m, 1 bedroom" maxLength={120} />
              </label>
              <label className="form-field">Town or city <span className="required">*</span>
                <input name="location" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Where will your space be?" autoComplete="address-level2" required minLength={2} maxLength={120} />
              </label>
            </div>
            <label className="form-field">A little more about your idea <span className="optional">(optional)</span>
              <textarea name="notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="How will you use it? Any must-haves, finishes or questions?" rows={3} maxLength={2000} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-dark quote-submit"><WhatsAppIcon width={21} height={21} /> Continue to WhatsApp <ArrowUpRight size={18} /></button>
            <p className="form-privacy">No obligation. Your details aren't stored on this website.<br />You can review your message in WhatsApp before sending it.</p>
          </form>
        </div>
      )}
    </DialogShell>
  );
}