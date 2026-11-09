import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Menu, Plus, X } from 'lucide-react';
import { Brand, WhatsAppIcon } from './components/Brand';
import { ProductDialog, QuoteDialog } from './components/Dialogs';
import FloorPlan from './components/FloorPlan';
import { CONTACT, faqs, plans, products, whatsappLink, type Product, type QuoteDefaults } from './data';
const heroImage = '/images/timber-home-hero.webp';
const craftImage = '/images/craftsmanship.webp';

const easing = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: easing, delay }}>
      {children}
    </motion.div>
  );
}

function Header({ onQuote }: { onQuote: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const links = [
    { href: '#spaces', label: 'Our spaces' },
    { href: '#why-us', label: 'Why choose us' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#faqs', label: 'FAQs' },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="navigation">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <button className="button button-dark nav-quote" onClick={onQuote}>Get a free quote <ArrowUpRight size={17} /></button>
        <button className="menu-button icon-button" ref={menuButtonRef} onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {links.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={18} /></a>)}
            <button className="button button-dark" onClick={() => { setMenuOpen(false); onQuote(); }}>Get a free quote <ArrowUpRight size={17} /></button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.img
        className="hero-image"
        src={heroImage}
        alt="Timber-home design inspiration: a welcoming wooden home in the South African landscape"
        width="1536"
        height="1024"
        fetchPriority="high"
        initial={{ scale: 1.035 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.9, ease: easing }}
      />
      <div className="hero-sky-wash" />
      <div className="hero-copy">
        <motion.h1 id="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easing, delay: 0.1 }}>
          <span>Leo Wendy Huts.</span>
          <span className="hero-claim">More room for life.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: easing, delay: 0.25 }}>Thoughtfully crafted Wendy houses and log homes, made for you.</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: easing, delay: 0.4 }}>
          <a className="button button-dark" href="#spaces">Explore our spaces <ArrowRight size={18} /></a>
          <a className="button button-plain" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={21} height={21} /> Chat with Leo</a>
        </motion.div>
      </div>
    </section>
  );
}

function Spaces({ onExplore }: { onExplore: (product: Product) => void }) {
  return (
    <section id="spaces" className="spaces-section section-pad" aria-labelledby="spaces-title">
      <div className="container">
        <Reveal className="section-heading split-heading">
          <div>
            <p className="eyebrow">YOUR SPACE. YOUR WAY.</p>
            <h2 id="spaces-title">A space for every<br />side of life.</h2>
          </div>
          <p className="section-description">For a new chapter, a growing family, or simply a little more room. There's a timber space with your name on it.</p>
        </Reveal>
        <div className="spaces-grid">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.09}>
              <button className="space-link" onClick={() => onExplore(product)} aria-label={`Explore ${product.name.toLowerCase()}`}>
                <div className="space-image"><img src={product.image} alt={product.alt} width="1200" height="800" loading="lazy" /></div>
                <div className="space-title"><h3>{product.name}</h3><span className="space-arrow"><ArrowUpRight size={20} strokeWidth={1.6} /></span></div>
                <p>{product.description}</p>
              </button>
            </Reveal>
          ))}
        </div>
        <p className="gallery-note">A little inspiration for your next space. Design imagery is illustrative.</p>
      </div>
    </section>
  );
}

function WhyUs() {
  const values = [
    { title: 'Made around you', description: 'Your dimensions, your layout, your finishing touches.' },
    { title: 'Good wood. Experienced hands.', description: 'A dedicated carpentry team that cares about the details.' },
    { title: 'Pretoria roots. Nationwide reach.', description: 'Built in Gauteng, with delivery across South Africa.' },
  ];

  return (
    <section id="why-us" className="why-section section-pad" aria-labelledby="why-title">
      <div className="container why-grid">
        <Reveal className="craft-image"><img src={craftImage} alt="Illustrative close-up of a carpenter hand-planing timber, with fresh wood shavings on a workbench" width="1200" height="800" loading="lazy" /></Reveal>
        <Reveal className="why-copy" delay={0.12}>
          <p className="eyebrow">THE LEO WENDY HUTS WAY</p>
          <h2 id="why-title">Small team.<br />Big on the details.</h2>
          <p className="why-intro">Over 10 years of hands-on experience. And one simple belief: a space worth building is worth building properly.</p>
          <div className="values-list">
            {values.map((value, index) => (
              <div className="value" key={value.title}>
                <span className="value-number">0{index + 1}</span>
                <div><h3>{value.title}</h3><p>{value.description}</p></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PopularPlans({ onQuote }: { onQuote: (defaults: QuoteDefaults) => void }) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [view, setView] = useState<'photo' | 'layout'>('photo');
  const [fullFitOut, setFullFitOut] = useState(false);
  const plan = plans[selectedPlan];
  const price = selectedPlan === 1 && fullFitOut ? 235000 : plan.price;

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    let next = selectedPlan;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = selectedPlan === 0 ? 1 : 0;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 1;
    else return;
    event.preventDefault();
    setSelectedPlan(next);
    document.getElementById(`plan-tab-${plans[next].id}`)?.focus();
  }

  function requestPlan() {
    onQuote({
      project: 'Log home',
      size: `${plan.size}, ${selectedPlan === 0 ? '1 bedroom' : '2 bedrooms'}`,
      notes: `I'm interested in ${plan.name} (guide price around R${price.toLocaleString('en-US')}).${selectedPlan === 1 ? ` Please quote ${fullFitOut ? 'with' : 'without'} the full electrical and plumbing fit-out.` : ''}`,
    });
  }

  return (
    <section id="popular-plans" className="plans-section section-pad" aria-labelledby="plans-title">
      <div className="container">
        <Reveal className="section-heading split-heading">
          <div><p className="eyebrow">A LITTLE INSPIRATION</p><h2 id="plans-title">Big possibilities.<br />A place to start.</h2></div>
          <p className="section-description">Start with a popular layout, then make it your own. A good home begins with a good conversation.</p>
        </Reveal>
        <Reveal>
          <div className="plan-tabs" role="tablist" aria-label="Popular log home layouts">
            {plans.map((item, index) => <button key={item.id} id={`plan-tab-${item.id}`} role="tab" aria-selected={selectedPlan === index} aria-controls="plan-panel" tabIndex={selectedPlan === index ? 0 : -1} onClick={() => setSelectedPlan(index)} onKeyDown={handleTabKey} className={selectedPlan === index ? 'active' : ''}>{item.name}<span>{index === 0 ? '1 bedroom' : '2 bedrooms'}</span></button>)}
          </div>
          <div id="plan-panel" role="tabpanel" aria-labelledby={`plan-tab-${plan.id}`} className="plan-panel">
            <div className="plan-visual">
              <div className={`plan-media ${view === 'layout' ? 'plan-media-layout' : ''}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div className="plan-media-inner" key={`${plan.id}-${view}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    {view === 'photo' ? <img className={`plan-photo ${selectedPlan === 0 ? 'plan-photo-small' : ''}`} src={plan.image} alt={`Illustrative timber-home inspiration for ${plan.name}`} width="1536" height="1024" loading="lazy" /> : <FloorPlan large={selectedPlan === 1} />}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="plan-media-toolbar">
                <p>{view === 'photo' ? 'A little inspiration. Made to order.' : 'Concept layout, not a final building plan.'}</p>
                <div className="view-switch" role="group" aria-label="Preview style"><button aria-pressed={view === 'photo'} onClick={() => setView('photo')}>Photo</button><button aria-pressed={view === 'layout'} onClick={() => setView('layout')}>Layout</button></div>
              </div>
            </div>
            <div className="plan-details">
              <p className="eyebrow">{plan.size} <span className="dimension-separator">/</span> {plan.area}m<sup>2</sup> OF POSSIBILITY</p>
              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-price" aria-live="polite"><span>{selectedPlan === 1 && fullFitOut ? 'Indicative full fit-out' : 'Indicative starting price'}</span><strong>R{price.toLocaleString('en-US')}</strong></div>
              <ul className="check-list">{plan.features.map((feature) => <li key={feature}><Check size={16} strokeWidth={1.7} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
              {selectedPlan === 1 && <label className="fitout-option"><span>Add electrical &amp; plumbing</span><span className="switch"><input type="checkbox" checked={fullFitOut} onChange={(e) => setFullFitOut(e.target.checked)} /><span className="switch-track" /></span></label>}
              <button className="button button-dark plan-quote" onClick={requestPlan}>Make this one yours <ArrowUpRight size={18} /></button>
            </div>
          </div>
          <p className="price-disclaimer">Guide prices only. Your final quote will confirm finishes, site requirements, delivery and all inclusions.</p>
        </Reveal>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { title: 'You bring the idea.', description: 'Tell us what you have in mind, how much space you need, and where you want it to be.' },
    { title: 'We make a plan.', description: 'Together, we work through your layout, finishes and budget. You get a clear, personal quote.' },
    { title: 'Life gets a little roomier.', description: 'Our team brings your space to life, with delivery and installation arranged around your project.' },
  ];

  return (
    <section id="how-it-works" className="process-section section-pad" aria-labelledby="process-title">
      <div className="container">
        <Reveal className="section-heading centered-heading"><p className="eyebrow">FROM THE FIRST HELLO TO YOUR NEW HOME</p><h2 id="process-title">Good things start<br />with a simple idea.</h2></Reveal>
        <div className="process-grid">
          {steps.map((step, index) => <Reveal key={step.title} delay={index * 0.1} className="process-step"><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faqs" className="faq-section section-pad" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <Reveal className="faq-heading"><p className="eyebrow">GOOD QUESTIONS</p><h2 id="faq-title">A little more<br />peace of mind.</h2><a className="text-link" href={whatsappLink("Hi Leo! I have a question about your timber structures.")} target="_blank" rel="noopener noreferrer">Still curious? Talk to Leo <ArrowUpRight size={17} /></a></Reveal>
        <Reveal className="faq-list" delay={0.1}>
          {faqs.map((faq, index) => (
            <div className={`faq-item ${open === index ? 'faq-open' : ''}`} key={faq.question}>
              <h3><button id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{faq.question}</span><motion.span className="faq-plus" animate={{ rotate: open === index ? 45 : 0 }} transition={{ duration: 0.2 }}><Plus size={20} strokeWidth={1.5} /></motion.span></button></h3>
              <motion.div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={open !== index} className="faq-answer" initial={false} animate={{ height: open === index ? 'auto' : 0, opacity: open === index ? 1 : 0 }} transition={{ duration: 0.28, ease: easing }}><p>{faq.answer}</p></motion.div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Contact({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <Reveal className="container contact-copy"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2 id="contact-title">Let's make room<br />for what's next.</h2><p>A big idea or a little extra space. We'd love to hear about it.</p><div className="contact-actions"><button className="button button-dark" onClick={onQuote}>Get a free quote <ArrowUpRight size={18} /></button><a className="button button-plain" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon width={21} height={21} /> Chat with Leo</a></div><span className="contact-note">No pressure. Just possibilities.</span></Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand"><Brand footer /><p>Honest craftsmanship.<br />A little more room for life.</p></div>
          <div className="footer-column"><h3>Come say hello</h3><a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">342 Broodryk Street, Wolmer<br />Pretoria North, 0182<br />South Africa <ArrowUpRight size={14} className="inline-arrow" /></a></div>
          <div className="footer-column"><h3>Let's talk about your space</h3><a href={CONTACT.phoneHref}>{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a className="footer-whatsapp" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Message Leo on WhatsApp <ArrowUpRight size={14} /></a></div>
        </div>
        <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Leo Wendy Huts.</p><p>Also known as LJ Wendy Huts &amp; LJ Wendyhouses.</p><a href="#">Back to top <ArrowUpRight size={14} /></a></div>
      </div>
    </footer>
  );
}

type ActiveDialog = { type: 'product'; product: Product } | { type: 'quote'; defaults: QuoteDefaults } | null;

export default function App() {
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const dialogOpener = useRef<HTMLElement | null>(null);
  const dialogIsOpen = useRef(false);

  // Keep the original trigger when a product dialog hands off to the quote form.
  const rememberOpener = useCallback(() => {
    if (!dialogIsOpen.current) {
      dialogOpener.current = document.activeElement as HTMLElement;
      dialogIsOpen.current = true;
    }
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
    dialogIsOpen.current = false;
    requestAnimationFrame(() => {
      if (dialogIsOpen.current) return;
      const menuButton = document.querySelector<HTMLElement>('.menu-button');
      const fallback = menuButton?.offsetParent ? menuButton : document.querySelector<HTMLElement>('.brand');
      const target = dialogOpener.current?.isConnected ? dialogOpener.current : fallback;
      target?.focus({ preventScroll: true });
    });
  }, []);

  const openQuote = useCallback((defaults: QuoteDefaults = {}) => {
    rememberOpener();
    setDialog({ type: 'quote', defaults });
  }, [rememberOpener]);

  const openProduct = useCallback((product: Product) => {
    rememberOpener();
    setDialog({ type: 'product', product });
  }, [rememberOpener]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header onQuote={() => openQuote()} />
      <main id="main">
        <Hero />
        <Spaces onExplore={openProduct} />
        <WhyUs />
        <PopularPlans onQuote={openQuote} />
        <Process />
        <FAQs />
        <Contact onQuote={() => openQuote()} />
      </main>
      <Footer />
      {dialog?.type === 'product' && <ProductDialog key={dialog.product.id} product={dialog.product} onClose={closeDialog} onQuote={openQuote} />}
      {dialog?.type === 'quote' && <QuoteDialog defaults={dialog.defaults} onClose={closeDialog} />}
    </MotionConfig>
  );
}
