import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowRight,
  CakeSlice,
  Check,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  Router as WouterRouter,
  useLocation,
} from 'wouter';

const queryClient = new QueryClient();

// Gallery image URLs live here so real cake photography can replace the illustrated placeholders in one place.
const GALLERY_IMAGES = [
  { title: 'Buttercream blush', note: 'soft, swirly, and made for a birthday', src: '/anjanas-cake-buttercream.svg' },
  { title: 'Strawberry daydream', note: 'a little pink, a lot of joy', src: '/anjanas-cake-strawberry.svg' },
  { title: 'Blueberry cloud', note: 'quietly pretty with a fresh finish', src: '/anjanas-cake-blueberry.svg' },
  { title: 'Red velvet love', note: 'the classic, made completely vegan', src: '/anjanas-cake-red-velvet.svg' },
  { title: 'Mango sunshine', note: 'bright, fruity, and made to order', src: '/anjanas-cake-mango.svg' },
  { title: 'Bento little one', note: 'small cake, very big feeling', src: '/anjanas-cake-bento.svg' },
];

const FLAVORS = [
  'Butterscotch',
  'Strawberry',
  'Blueberry',
  'Pineapple',
  'Red Velvet',
  'Black Forest',
  'White Forest',
  'Mango',
  'Custom Flavor (specify)',
];

const SIZES = [
  'Half pound',
  '1 pound',
  '1.5 pound',
  '2 pound',
  '2.5 pound',
  '3.5 pound',
  '4 pound',
  'Bento Cake',
];

type GalleryItem = (typeof GALLERY_IMAGES)[number];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<GalleryItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    flavor: '',
    customFlavor: '',
    size: '',
    design: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const flavor = form.flavor === 'Custom Flavor (specify)' ? `Custom Flavor: ${form.customFlavor}` : form.flavor;
    const message = [
      "Hello Anjana's Bakery! I would love to order a cake.",
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Flavor: ${flavor}`,
      `Size: ${form.size}`,
      `Design / theme: ${form.design || 'No specific theme — please suggest something lovely.'}`,
    ].join('\n');
    const whatsappUrl = `https://wa.me/919830352695?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="bakery-site">
      <header className="site-header">
        <div className="page-shell">
          <div className="header-inner">
            <a className="brand-lockup" href="#home" onClick={closeMenu} data-testid="link-brand-home">
              <span className="brand-seal" aria-hidden="true">
                <CakeSlice />
              </span>
              <span>
                <span className="brand-name">Anjana's Bakery</span>
                <span className="brand-note">made by hand in Sodepur</span>
              </span>
            </a>
            <nav className="desktop-nav" aria-label="Main navigation">
              <a className="nav-link" href="#about" data-testid="link-nav-about">Our story</a>
              <a className="nav-link" href="#gallery" data-testid="link-nav-gallery">Gallery</a>
              <a className="nav-link" href="#order" data-testid="link-nav-order">Customize</a>
              <a className="nav-link" href="#contact" data-testid="link-nav-contact">Find us</a>
              <a className="header-cta" href="#order" data-testid="link-header-order">Order a cake <ArrowRight size={15} /></a>
            </nav>
            <button
              className="mobile-menu-trigger"
              type="button"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
          <nav className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
            <a className="nav-link" href="#about" onClick={closeMenu} data-testid="link-mobile-about">Our story</a>
            <a className="nav-link" href="#gallery" onClick={closeMenu} data-testid="link-mobile-gallery">Gallery</a>
            <a className="nav-link" href="#order" onClick={closeMenu} data-testid="link-mobile-order">Customize your cake</a>
            <a className="nav-link" href="#contact" onClick={closeMenu} data-testid="link-mobile-contact">Find us</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="page-shell hero-grid">
            <div className="hero-copy reveal">
              <span className="hero-kicker"><Sparkles size={13} /> 100% Pure Vegan</span>
              <h1 className="display hero-title">
                Baked with love,
                <em>just for you.</em>
              </h1>
              <p className="hero-intro">
                Handmade, fully customizable cakes from our little kitchen in Sodepur.
                Tell us the feeling, and we will bake the sweet part.
              </p>
              <div className="hero-actions">
                <a className="button-primary" href="#order" data-testid="link-hero-order">
                  Make it yours <ArrowRight size={16} />
                </a>
                <a className="button-secondary" href="#gallery" data-testid="link-hero-gallery">
                  See the cake notes
                </a>
              </div>
              <div className="hero-signature">
                <span className="hero-signature-line" />
                <span>small batches, big feelings</span>
                <strong>— Anjana</strong>
              </div>
            </div>
            <div className="hero-art-wrap reveal" aria-label="Hand drawn vegan cake illustration">
              <div className="hero-art-card">
                <div className="cake-illustration" aria-hidden="true">
                  <div className="cake-plate" />
                  <div className="cake-body" />
                  <div className="cake-top" />
                  <div className="cake-frosting" />
                  <div className="cake-drip drip-one" />
                  <div className="cake-drip drip-two" />
                  <div className="cake-drip drip-three" />
                  <div className="cake-berry berry-one" />
                  <div className="cake-berry berry-two" />
                  <div className="cake-flower" />
                  <div className="candle" />
                  <div className="flame" />
                </div>
              </div>
              <div className="floating-note">
                <strong>for your special day</strong>
                Every cake begins with a little note about you.
              </div>
            </div>
          </div>
        </section>

        <section className="section section-soft" id="about">
          <div className="page-shell about-grid">
            <div className="about-copy reveal">
              <span className="eyebrow">A little about us</span>
              <h2 className="display section-heading">Not just a cake.<br /><span className="script">Your cake.</span></h2>
              <p className="about-story">
                At Anjana's Bakery, every bake is made from scratch, with patience, good ingredients, and a soft spot for your story.
              </p>
              <p className="about-detail">
                We are a small neighborhood bakery in Sodepur making 100% Pure Vegan cakes, one order at a time. No display-case rush, no one-size-fits-all designs — just a warm conversation and a cake made to feel like yours.
              </p>
            </div>
            <div className="care-card reveal">
              <span className="care-card-title">Made with care, always.</span>
              <ul className="care-list">
                <li>
                  <span className="care-icon"><Heart size={15} /></span>
                  <span><strong>100% Pure Vegan</strong><span>Thoughtfully baked without dairy or eggs.</span></span>
                </li>
                <li>
                  <span className="care-icon"><CakeSlice size={15} /></span>
                  <span><strong>Made to order</strong><span>Freshly baked for your date, not days before.</span></span>
                </li>
                <li>
                  <span className="care-icon"><Sparkles size={15} /></span>
                  <span><strong>Fully customizable</strong><span>Your flavor, size, colors, and little ideas welcome.</span></span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section" id="gallery">
          <div className="page-shell">
            <div className="gallery-head reveal">
              <div>
                <span className="eyebrow">From our little kitchen</span>
                <h2 className="display section-heading">A few sweet<br /><span className="script">possibilities.</span></h2>
              </div>
              <p className="gallery-note">Tap a cake to take a closer look — and then make it yours.</p>
            </div>
            <div className="gallery-grid">
              {GALLERY_IMAGES.map((item, index) => (
                <button
                  className="gallery-card reveal"
                  key={item.title}
                  type="button"
                  onClick={() => setSelectedCake(item)}
                  aria-label={`View ${item.title}`}
                  data-testid={`button-gallery-${index}`}
                >
                  <img className="gallery-image" src={item.src} alt="" />
                  <span className="gallery-overlay">
                    <strong>{item.title}</strong>
                    <span>{item.note}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section order-section section-soft" id="order">
          <div className="page-shell order-layout">
            <div className="order-intro reveal">
              <span className="eyebrow">Your cake note</span>
              <h2 className="display section-heading">Tell us what<br /><span className="script">you are imagining.</span></h2>
              <p className="section-lede">
                Choose the starting point below. We will chat on WhatsApp to make the details feel just right before we bake anything.
              </p>
              <p className="section-lede">No online payment. No complicated checkout. Just a thoughtful cake conversation.</p>
            </div>
            <div className="order-card reveal">
              <form className="order-form" onSubmit={submitOrder}>
                <div className="form-intro">
                  <h3>Start your order</h3>
                  <span>one sweet step</span>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cake-flavor">Flavor</label>
                    <select id="cake-flavor" required value={form.flavor} onChange={(event) => updateField('flavor', event.target.value)} data-testid="select-cake-flavor">
                      <option value="" disabled>Choose a flavor</option>
                      {FLAVORS.map((flavor) => <option value={flavor} key={flavor}>{flavor}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="cake-size">Size</label>
                    <select id="cake-size" required value={form.size} onChange={(event) => updateField('size', event.target.value)} data-testid="select-cake-size">
                      <option value="" disabled>Choose a size</option>
                      {SIZES.map((size) => <option value={size} key={size}>{size}</option>)}
                    </select>
                  </div>
                </div>
                {form.flavor === 'Custom Flavor (specify)' && (
                  <div className="form-field">
                    <label htmlFor="custom-flavor">Tell us your custom flavor</label>
                    <input id="custom-flavor" required value={form.customFlavor} onChange={(event) => updateField('customFlavor', event.target.value)} placeholder="For example: coffee hazelnut" data-testid="input-custom-flavor" />
                  </div>
                )}
                <div className="form-field">
                  <label htmlFor="design-request">Design / theme request <span className="form-helper">(optional)</span></label>
                  <textarea id="design-request" value={form.design} onChange={(event) => updateField('design', event.target.value)} placeholder="Colours, occasion, a little message, or a picture in your mind..." data-testid="textarea-design-request" />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="customer-name">Your name</label>
                    <input id="customer-name" required value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Who are we baking for?" data-testid="input-customer-name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="customer-phone">Phone number</label>
                    <input id="customer-phone" required type="tel" inputMode="tel" pattern="[0-9+ ()-]{8,}" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="Best number to reach you" data-testid="input-customer-phone" />
                  </div>
                </div>
                <button className="button-primary whatsapp-button" type="submit" data-testid="button-send-whatsapp">
                  <MessageCircle size={17} /> Send your cake note on WhatsApp <ArrowRight size={16} />
                </button>
                <span className="form-helper">This opens a pre-filled WhatsApp message to Anjana's Bakery at 9830352695.</span>
                {submitted && (
                  <div className="form-success" role="status" data-testid="status-order-sent">
                    <Check size={17} />
                    <span>Your cake note is ready in WhatsApp. We cannot wait to hear what you are imagining.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="page-shell">
            <div className="reveal">
              <span className="eyebrow">Come say hello</span>
              <h2 className="display section-heading">Find your way<br /><span className="script">to something sweet.</span></h2>
            </div>
            <div className="contact-grid">
              <div className="contact-card reveal">
                <span className="contact-icon"><MapPin size={18} /></span>
                <h3>Our kitchen</h3>
                <p>Sodepur Sadhur More,<br />Priyanshi Apartment, Block B,<br />Near Rani Bala School</p>
              </div>
              <div className="contact-card reveal">
                <span className="contact-icon"><Phone size={18} /></span>
                <h3>Let's talk cake</h3>
                <a href="tel:9830352695" data-testid="link-call-primary">9830352695</a><br />
                <a href="tel:7980003748" data-testid="link-call-secondary">7980003748</a>
                <p style={{ marginTop: '0.7rem' }}>Call or WhatsApp your ideas.</p>
              </div>
              <div className="contact-card is-map reveal">
                <iframe
                  className="map-frame"
                  title="Map showing Anjana's Bakery near Rani Bala School, Sodepur"
                  src="https://www.google.com/maps?q=Sodepur+Sadhur+More,+Priyanshi+Apartment,+Block+B,+Near+Rani+Bala+School&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="page-shell">
          <div className="footer-inner">
            <a className="brand-lockup footer-brand" href="#home" data-testid="link-footer-home">
              <span className="brand-seal" aria-hidden="true"><CakeSlice /></span>
              <span><span className="brand-name">Anjana's Bakery</span><span className="brand-note">Baked with love, just for you</span></span>
            </a>
            <p className="footer-copy">A small neighborhood bakery for handmade 100% vegan cakes, made to order in Sodepur.</p>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Anjana's Bakery</span>
            <span>Made with <Heart className="footer-heart" size={12} fill="currentColor" /> and a little extra frosting.</span>
          </div>
        </div>
      </footer>

      {selectedCake && (
        <div className="lightbox-backdrop" role="presentation" onClick={() => setSelectedCake(null)}>
          <div className="lightbox" role="dialog" aria-modal="true" aria-label={selectedCake.title} onClick={(event) => event.stopPropagation()}>
            <button className="lightbox-close" type="button" aria-label="Close cake preview" onClick={() => setSelectedCake(null)} data-testid="button-close-gallery">
              <X size={18} />
            </button>
            <img className="lightbox-image" src={selectedCake.src} alt={selectedCake.title} />
            <div className="lightbox-info">
              <h3>{selectedCake.title}</h3>
              <p>{selectedCake.note}. Every detail can be tailored in your order note.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
