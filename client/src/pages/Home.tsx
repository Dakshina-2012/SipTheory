import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard as CreditCardIcon,
  Clock3,
  QrCode as QrCodeIcon,
  Coffee,
  Heart,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Moon,
  LockKeyhole as LockIcon,
  Plus,
  Quote,
  Send,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Smartphone as SmartphoneIcon,
  Sun,
  UtensilsCrossed,
  Wifi,
  WalletCards as WalletIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  vegetarian?: boolean;
};

type CartItem = MenuItem & { quantity: number };

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  request: string;
};

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type CheckoutForm = {
  name: string;
  phone: string;
  pickupTime: string;
  paymentMethod: "card" | "upi" | "gpay" | "bhim" | "pickup";
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const images = {
  logo: asset("siptheory-logo-mark.png"),
  hero: asset("siptheory-hero.webp"),
  latte: asset("siptheory-latte.webp"),
  cappuccino: asset("siptheory-cappuccino.webp"),
  espresso: asset("siptheory-espresso.webp"),
  chai: asset("siptheory-chai.webp"),
  coldbrew: asset("siptheory-coldbrew.webp"),
  sandwich: asset("siptheory-sandwich.webp"),
  dessert: asset("siptheory-dessert.webp"),
  cheesecake: asset("siptheory-cheesecake.webp"),
  interior: asset("siptheory-interior.webp"),
};

const menuItems: MenuItem[] = [
  { id: "signature-latte", name: "Signature Latte", category: "Coffee", description: "Smooth espresso with velvety steamed milk.", price: 220, image: images.latte, tag: "House favourite", vegetarian: true },
  { id: "cappuccino", name: "Classic Cappuccino", category: "Coffee", description: "Rich espresso balanced with creamy foam.", price: 190, image: images.cappuccino, vegetarian: true },
  { id: "espresso", name: "Espresso", category: "Coffee", description: "Bold, rich and perfectly extracted.", price: 140, image: images.espresso, vegetarian: true },
  { id: "mocha-bliss", name: "Mocha Bliss", category: "Coffee", description: "Chocolate, espresso and silky milk.", price: 240, image: images.dessert, tag: "Comforting", vegetarian: true },
  { id: "masala-chai", name: "Slow Masala Chai", category: "Tea", description: "Black tea, cardamom, ginger and a little time.", price: 150, image: images.chai, vegetarian: true },
  { id: "hibiscus-tea", name: "Hibiscus Cooler Tea", category: "Tea", description: "Bright hibiscus, citrus peel and wild honey.", price: 180, image: images.interior, vegetarian: true },
  { id: "iced-americano", name: "Iced Americano", category: "Cold Beverages", description: "Espresso chilled over ice with clean, refreshing notes.", price: 170, image: images.coldbrew, vegetarian: true },
  { id: "caramel-cold-brew", name: "Caramel Cold Brew", category: "Cold Beverages", description: "Slow-brewed coffee with soft caramel notes.", price: 230, image: images.coldbrew, tag: "Slow brewed", vegetarian: true },
  { id: "citrus-fizz", name: "Citrus Coffee Fizz", category: "Cold Beverages", description: "Sparkling citrus, espresso and a clean finish.", price: 210, image: images.hero, vegetarian: true },
  { id: "paneer-sandwich", name: "Paneer Pesto Sandwich", category: "Fast Food", description: "Grilled sourdough layered with paneer, pesto and greens.", price: 260, image: images.sandwich, tag: "Vegetarian", vegetarian: true },
  { id: "truffle-sandwich", name: "Truffle Grilled Sandwich", category: "Fast Food", description: "Toasted sourdough with creamy truffle filling.", price: 280, image: images.sandwich, vegetarian: true },
  { id: "mushroom-toast", name: "Pepper Mushroom Toast", category: "Fast Food", description: "Herbed mushrooms, labneh and a warm country loaf.", price: 240, image: images.interior, vegetarian: true },
  { id: "cheesecake", name: "Classic Cheesecake", category: "Desserts", description: "Creamy baked cheesecake with a delicate biscuit base.", price: 220, image: images.cheesecake, vegetarian: true },
  { id: "hazelnut-cake", name: "Chocolate Hazelnut Cake", category: "Desserts", description: "Rich chocolate cake with hazelnut cream.", price: 210, image: images.dessert, tag: "Made today", vegetarian: true },
  { id: "seasonal-tart", name: "Seasonal Fruit Tart", category: "Desserts", description: "Buttery pastry, vanilla cream and the day’s fruit.", price: 190, image: images.dessert, vegetarian: true },
  { id: "rose-cardamom", name: "Rose Cardamom Latte", category: "Signature Specials", description: "Espresso, rose, cardamom and a cloud of milk.", price: 250, image: images.chai, tag: "SipTheory special", vegetarian: true },
  { id: "tamarind-tonic", name: "Tamarind Espresso Tonic", category: "Signature Specials", description: "A bright, bittersweet tonic with espresso and tamarind.", price: 240, image: images.coldbrew, tag: "New", vegetarian: true },
];

const categories = ["All", "Coffee", "Tea", "Cold Beverages", "Fast Food", "Desserts", "Signature Specials"];

const featuredIds = ["signature-latte", "cappuccino", "mocha-bliss", "caramel-cold-brew", "truffle-sandwich", "hazelnut-cake"];

const experiences = [
  { icon: UtensilsCrossed, title: "Dine In", description: "A relaxed space for conversations, meals and coffee breaks." },
  { icon: ShoppingBag, title: "Takeaway", description: "Quickly grab your favourite drink and carry the good mood with you." },
  { icon: CalendarDays, title: "Table Reservations", description: "Reserve a comfortable table before the day gets busy." },
  { icon: Wifi, title: "Free Wi-Fi", description: "A comfortable corner for work, study and long-form thinking." },
  { icon: Sparkles, title: "Events & Gatherings", description: "A welcoming space for small celebrations and gatherings." },
  { icon: Coffee, title: "Custom Orders", description: "Special requests for selected drinks and dishes, made thoughtfully." },
];

const gallery = [
  { image: images.interior, label: "A room made for lingering", className: "gallery-tall" },
  { image: images.cappuccino, label: "The daily pour", className: "gallery-square" },
  { image: images.sandwich, label: "Lunch, but slower", className: "gallery-square" },
  { image: images.cheesecake, label: "Something sweet", className: "gallery-wide" },
  { image: images.coldbrew, label: "Sun on the table", className: "gallery-wide" },
  { image: images.chai, label: "Find your corner", className: "gallery-square" },
];

const testimonials = [
  { quote: "The coffee is incredible, but the atmosphere is what keeps me coming back.", name: "Aarav R.", role: "Weekend regular", initials: "AR" },
  { quote: "Beautiful space, friendly service and genuinely good food. It feels considered without feeling precious.", name: "Meera S.", role: "Design consultant", initials: "MS" },
  { quote: "SipTheory has become my favourite weekend coffee spot. The cold brew is quietly excellent.", name: "Karthik V.", role: "Neighbourhood guest", initials: "KV" },
];

const today = new Date().toISOString().split("T")[0];

const receiptPaymentLabel = (method: CheckoutForm["paymentMethod"]) => method === "gpay" ? "Google Pay" : method === "bhim" ? "BHIM UPI" : method === "upi" ? "UPI" : method === "card" ? "Card" : "Pay at pickup";

function downloadReceiptPdf(receipt: { id: string; createdAt: string }, checkout: CheckoutForm, cart: CartItem[], subtotal: number, tax: number, total: number) {
  const lines = [
    "SIPTHEORY | COFFEE & IDEAS",
    "CAFE & ROASTERY",
    "----------------------------------------",
    "PAYMENT RECEIPT",
    `Receipt: ${receipt.id}`,
    `Date: ${receipt.createdAt}`,
    `Customer: ${checkout.name}`,
    `Phone: ${checkout.phone}`,
    `Pickup: ${checkout.pickupTime}`,
    `Payment: ${receiptPaymentLabel(checkout.paymentMethod)}`,
    "----------------------------------------",
    ...cart.map((item) => `${item.quantity} x ${item.name}  Rs.${item.price * item.quantity}`),
    "----------------------------------------",
    `Subtotal: Rs.${subtotal}`,
    `Taxes (5%): Rs.${tax}`,
    `Total paid: Rs.${total}`,
    "",
    "Thank you for choosing SipTheory.",
    "Have a nice day."
  ];
  const escapePdf = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const stream = ["BT", "/F1 11 Tf", "50 760 Td", ...lines.map((line, index) => `${index ? "0 -18 Td" : ""} (${escapePdf(line)}) Tj`), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${receipt.id}-SipTheory-receipt.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  window.setTimeout(() => window.location.reload(), 700);
}


export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuCategory, setMenuCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string; createdAt: string } | null>(null);
  const [checkout, setCheckout] = useState<CheckoutForm>({ name: "", phone: "", pickupTime: "In 20 minutes", paymentMethod: "card", cardNumber: "", expiry: "", cvc: "" });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [booking, setBooking] = useState<BookingForm>({ name: "", email: "", phone: "", date: "", time: "", guests: "2", request: "" });
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [contact, setContact] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  const reservationMutation = trpc.reservations.create.useMutation();
  const contactMutation = trpc.contact.create.useMutation();

  useEffect(() => {
    const saved = window.localStorage.getItem("siptheory-theme");
    const isDark = saved === "dark";
    setDarkMode(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 22);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("siptheory-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const modalOpen = cartOpen || checkoutOpen || galleryIndex !== null;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, checkoutOpen, galleryIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setCheckoutOpen(false);
        setGalleryIndex(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTestimonialIndex((current) => (current + 1) % testimonials.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const featuredItems = featuredIds.map((id) => menuItems.find((item) => item.id === id)!).filter(Boolean);
  const filteredItems = useMemo(() => menuCategory === "All" ? menuItems : menuItems.filter((item) => item.category === menuCategory), [menuCategory]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) return current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      return [...current, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to your order.`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const submitCheckout = (event: React.FormEvent) => {
    event.preventDefault();
    if (!checkout.name.trim() || !/^[+\d][\d\s-]{8,}$/.test(checkout.phone)) {
      toast.error("Add your full name and a valid phone number to continue.");
      return;
    }
    if (checkout.paymentMethod === "card" && (!checkout.cardNumber || !checkout.expiry || !checkout.cvc)) {
      toast.error("Add your card details to continue.");
      return;
    }
    setCheckoutSuccess(true);
    setReceipt({ id: `ST-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) });
    toast.success("Test payment successful — receipt generated.");
  };

  const validateBooking = () => {
    const errors: Record<string, string> = {};
    if (!booking.name.trim()) errors.name = "Please add your name.";
    if (!/^\S+@\S+\.\S+$/.test(booking.email)) errors.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{8,}$/.test(booking.phone)) errors.phone = "Enter a valid phone number.";
    if (!booking.date) errors.date = "Choose a date.";
    else if (booking.date < today) errors.date = "Choose a future date.";
    if (!booking.time) errors.time = "Choose a time.";
    if (!booking.guests || Number(booking.guests) < 1 || Number(booking.guests) > 12) errors.guests = "Choose 1–12 guests.";
    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    setBookingSuccess(false);
    if (!validateBooking()) return;
    try {
      await reservationMutation.mutateAsync({ ...booking, guests: Number(booking.guests) });
      setBookingSuccess(true);
      toast.success("Your table request has been received.");
    } catch {
      toast.error("We couldn't send that request. Please try again.");
    }
  };

  const submitContact = async (event: React.FormEvent) => {
    event.preventDefault();
    setContactSuccess(false);
    if (!contact.name || !/^\S+@\S+\.\S+$/.test(contact.email) || !contact.message) {
      toast.error("Please complete your name, email and message.");
      return;
    }
    try {
      await contactMutation.mutateAsync(contact);
      setContactSuccess(true);
      setContact({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent — we’ll be in touch soon.");
    } catch {
      toast.error("We couldn't send that message. Please try again.");
    }
  };

  const changeTestimonial = (direction: number) => {
    setTestimonialIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <div className="site-shell">
      <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <button className="brand-mark" onClick={() => scrollTo("home")} aria-label="SipTheory home">
            <img className="brand-logo" decoding="async" src={images.logo} alt="SipTheory Coffee & Ideas Cafe & Roastery" />
          </button>
          <nav className={`desktop-links ${mobileOpen ? "mobile-links-open" : ""}`} aria-label="Main navigation">
            {[["Home", "home"], ["Menu", "menu"], ["About", "about"], ["Gallery", "gallery"], ["Reviews", "reviews"], ["Contact", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="icon-button theme-toggle" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>
            <button className="nav-cta" onClick={() => scrollTo("reserve")}>Book a table <ArrowRight size={16} /></button>
            <button className="icon-button menu-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={21} /> : <MenuIcon size={21} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <img className="hero-image" decoding="async" fetchPriority="high" src={images.hero} alt="Latte on a sunlit table in the SipTheory cafe" />
          <div className="hero-overlay" />
          <div className="hero-content container">
            <div className="eyebrow eyebrow-light"><span className="eyebrow-line" /> Welcome to SipTheory</div>
            <h1>Where every sip<br /><em>tells a story.</em></h1>
            <p className="hero-copy">Thoughtfully brewed coffee, handcrafted favourites, and comforting flavours — made for slow mornings, quick catch-ups, and everything in between.</p>
            <div className="hero-actions">
              <button className="button button-light" onClick={() => scrollTo("menu")}>Explore menu <ArrowRight size={17} /></button>
              <button className="button button-ghost-light" onClick={() => scrollTo("reserve")}>Book a table</button>
            </div>
          </div>
          <div className="hero-note"><span>08:00</span><span className="hero-note-line" /><span>Chennai, India</span></div>
          <button className="scroll-cue" onClick={() => scrollTo("intro")} aria-label="Scroll to introduction"><span>Scroll to explore</span><ArrowDown size={16} /></button>
        </section>

        <section id="intro" className="intro-section section-pad">
          <div className="container intro-grid">
            <div className="intro-copy reveal-up">
              <div className="eyebrow"><span className="eyebrow-line" /> The SipTheory ritual</div>
              <h2>More than<br /><em>just coffee.</em></h2>
              <p className="lead-copy">At SipTheory, we believe a great cafe is more than what’s in your cup. It’s the conversations, the aroma, the little pauses, and the moments worth remembering.</p>
              <p>We source with care, make things from scratch where we can, and leave room for the day to unfold at its own pace.</p>
              <button className="text-link" onClick={() => scrollTo("about")}>Our story <ArrowRight size={16} /></button>
            </div>
            <div className="intro-image-wrap reveal-up">
              <img src={images.interior} alt="Warm, plant-filled SipTheory cafe interior" loading="lazy" />
              <div className="image-caption"><span>01</span><span>Good days start here.</span></div>
            </div>
          </div>
          <div className="container stats-row">
            {[["10+", "Signature drinks"], ["25+", "Menu favourites"], ["4.9", "Guest rating"], ["7", "Days open"]].map(([number, label]) => <div className="stat" key={label}><strong>{number}</strong><span>{label}</span></div>)}
          </div>
        </section>

        <section id="menu" className="menu-section section-pad section-dark">
          <div className="container">
            <div className="section-heading-row">
              <div><div className="eyebrow eyebrow-muted"><span className="eyebrow-line" /> From the counter</div><h2>Made to be<br /><em>sipped & savoured.</em></h2></div>
              <p className="section-intro-copy">Small rituals, generous flavours, and a menu that gives every kind of day a good place to land.</p>
            </div>
            <div className="featured-grid">
              {featuredItems.map((item, index) => <MenuCard key={item.id} item={item} onAdd={addToCart} onFavorite={() => setFavoriteIds((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} isFavorite={favoriteIds.includes(item.id)} featured index={index} />)}
            </div>
            <div className="menu-explore-row"><span>There’s more where that came from.</span><button className="button button-outline-light" onClick={() => document.getElementById("full-menu")?.scrollIntoView({ behavior: "smooth" })}>View full menu <ArrowDown size={15} /></button></div>
          </div>
        </section>

        <section id="full-menu" className="full-menu-section section-pad">
          <div className="container">
            <div className="section-heading-centered"><div className="eyebrow"><span className="eyebrow-line" /> Take your pick</div><h2>The full <em>menu.</em></h2><p>From your first coffee to your last sweet bite.</p></div>
            <div className="category-tabs" role="tablist" aria-label="Menu categories">
              {categories.map((category) => <button key={category} className={menuCategory === category ? "active" : ""} onClick={() => setMenuCategory(category)} role="tab" aria-selected={menuCategory === category}>{category}</button>)}
            </div>
            <div className="full-menu-grid">
              {filteredItems.map((item, index) => <MenuListCard key={item.id} item={item} onAdd={addToCart} index={index} />)}
            </div>
          </div>
        </section>

        <section id="about" className="story-section section-pad">
          <div className="container story-grid">
            <div className="story-image-wrap"><img src={images.sandwich} alt="Fresh paneer pesto sandwich at SipTheory" loading="lazy" /><div className="story-stamp"><span>Made with</span><strong>care</strong><span>since day one</span></div></div>
            <div className="story-copy"><div className="eyebrow"><span className="eyebrow-line" /> A little about us</div><h2>Good food.<br /><em>Good company.</em></h2><p className="lead-copy">SipTheory started with a simple idea: make a cafe that feels like a favourite song — familiar, warm, and just a little unexpected.</p><p>Our coffee is prepared with patience. Our food is rooted in ingredients we’d happily serve at home. And our hospitality is the kind that lets you stay for one more chapter.</p><div className="story-details"><div><span className="detail-number">01</span><strong>Thoughtful ingredients</strong><p>Seasonal produce, small-batch coffee and no shortcuts where it matters.</p></div><div><span className="detail-number">02</span><strong>Room to breathe</strong><p>A comfortable, sunlit space for the pause you didn’t know you needed.</p></div></div></div>
          </div>
        </section>

        <section className="experience-section section-pad section-cream">
          <div className="container"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" /> Make yourself at home</div><h2>Your kind<br /><em>of place.</em></h2></div><p className="section-intro-copy">Drop in for a quick takeaway, settle in with your laptop, or bring everyone you love. We’ll make room.</p></div><div className="experience-grid">{experiences.map(({ icon: Icon, title, description }) => <div className="experience-card" key={title}><span className="experience-icon"><Icon size={20} strokeWidth={1.6} /></span><h3>{title}</h3><p>{description}</p><ArrowRight size={17} className="experience-arrow" /></div>)}</div></div>
        </section>

        <section id="gallery" className="gallery-section section-pad">
          <div className="container"><div className="section-heading-row gallery-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> A peek inside</div><h2>The mood<br /><em>of SipTheory.</em></h2></div><p className="section-intro-copy">A little light, a little music, something warm on the table. Come as you are.</p></div><div className="gallery-grid">{gallery.map((item, index) => <button key={`${item.label}-${index}`} className={`gallery-item ${item.className}`} onClick={() => setGalleryIndex(index)} aria-label={`View ${item.label}`}><img decoding="async" src={item.image} alt={item.label} loading="lazy" /><span className="gallery-overlay"><span>{item.label}</span><span className="gallery-plus">+</span></span></button>)}</div></div>
        </section>

        <section id="reviews" className="reviews-section section-pad section-dark">
          <div className="container reviews-layout"><div className="reviews-intro"><div className="eyebrow eyebrow-muted"><span className="eyebrow-line" /> Notes from our guests</div><h2>Loved by<br /><em>our people.</em></h2><div className="rating-lockup"><strong>4.9</strong><span><span className="stars">★★★★★</span><small>from 200+ visits</small></span></div></div><div className="testimonial-stage"><Quote size={42} className="quote-icon" strokeWidth={1.1} /><blockquote>“{testimonials[testimonialIndex].quote}”</blockquote><div className="testimonial-person"><span className="avatar">{testimonials[testimonialIndex].initials}</span><span><strong>{testimonials[testimonialIndex].name}</strong><small>{testimonials[testimonialIndex].role}</small></span></div><div className="testimonial-controls"><button onClick={() => changeTestimonial(-1)} aria-label="Previous review"><ArrowLeft size={16} /></button><div className="testimonial-dots">{testimonials.map((_, index) => <button key={index} className={index === testimonialIndex ? "active" : ""} onClick={() => setTestimonialIndex(index)} aria-label={`View review ${index + 1}`} />)}</div><button onClick={() => changeTestimonial(1)} aria-label="Next review"><ArrowRight size={16} /></button></div></div></div>
        </section>

        <section id="reserve" className="reservation-section section-pad">
          <div className="container reservation-grid"><div className="reservation-copy"><div className="eyebrow"><span className="eyebrow-line" /> Save your seat</div><h2>Reserve<br /><em>your table.</em></h2><p className="lead-copy">Good things are better shared. Tell us when you’re coming and we’ll have a table ready.</p><div className="reservation-meta"><div><Clock3 size={17} /><span><strong>Open daily</strong><small>8:00 AM — 10:00 PM</small></span></div><div><MapPin size={17} /><span><strong>Find us</strong><small>12 Brew Street, Chennai</small></span></div></div></div><form className="form-card" onSubmit={submitBooking} noValidate><div className="form-card-top"><span>Table request</span><span className="form-step">01 / 01</span></div><div className="form-grid"><Field label="Full name" error={bookingErrors.name}><input value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} placeholder="Your name" autoComplete="name" /></Field><Field label="Email" error={bookingErrors.email}><input type="email" value={booking.email} onChange={(e) => setBooking({ ...booking, email: e.target.value })} placeholder="you@example.com" autoComplete="email" /></Field><Field label="Phone number" error={bookingErrors.phone}><input value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} placeholder="+91 98765 43210" autoComplete="tel" /></Field><Field label="Guests" error={bookingErrors.guests}><select value={booking.guests} onChange={(e) => setBooking({ ...booking, guests: e.target.value })}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i + 1}>{i + 1} {i === 0 ? "guest" : "guests"}</option>)}</select></Field><Field label="Date" error={bookingErrors.date}><input type="date" min={today} value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} /></Field><Field label="Time" error={bookingErrors.time}><select value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })}><option value="">Select time</option>{["08:00", "09:30", "11:00", "12:30", "14:00", "16:00", "18:00", "19:30", "21:00"].map((time) => <option value={time} key={time}>{time}</option>)}</select></Field><Field label="Special request" className="field-full"><textarea value={booking.request} onChange={(e) => setBooking({ ...booking, request: e.target.value })} placeholder="Anything we should know?" rows={3} /></Field></div><div className="form-submit-row"><button className="button button-dark" type="submit" disabled={reservationMutation.isPending}>{reservationMutation.isPending ? "Sending request…" : "Reserve table"} <ArrowRight size={16} /></button>{bookingSuccess && <span className="success-message"><Check size={15} /> Request received — we’ll confirm shortly.</span>}</div><p className="form-note">This is a request, not a confirmed reservation. We’ll reach out to confirm availability.</p></form></div>
        </section>

        <section id="contact" className="contact-section section-pad section-cream"><div className="container contact-grid"><div className="contact-details"><div className="eyebrow"><span className="eyebrow-line" /> Come say hello</div><h2>Make a<br /><em>day of it.</em></h2><div className="contact-list"><div><MapPin size={18} /><span><strong>Address</strong><a href="https://maps.google.com/?q=12+Brew+Street,+Chennai" target="_blank" rel="noreferrer">12 Brew Street, Chennai, Tamil Nadu</a></span></div><div><Coffee size={18} /><span><strong>Phone</strong><a href="tel:+919876543210">+91 98765 43210</a></span></div><div><Clock3 size={18} /><span><strong>Opening hours</strong><small>Monday — Friday · 8:00 AM — 10:00 PM<br />Saturday — Sunday · 8:00 AM — 11:00 PM</small></span></div></div><div className="social-row"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span className="social-letter">f</span></a><a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X"><span className="social-letter">𝕏</span></a></div></div><div className="contact-right"><div className="map-card"><div className="map-grid-lines" /><div className="map-pin"><MapPin size={19} fill="currentColor" /><span>12 Brew Street</span></div><div className="map-label">Chennai · Tamil Nadu</div><a href="https://maps.google.com/?q=12+Brew+Street,+Chennai" target="_blank" rel="noreferrer" className="map-link">Get directions <ArrowUpRightIcon /></a></div><form className="contact-form" onSubmit={submitContact} noValidate><div className="form-card-top"><span>Send a note</span><span className="form-step">We reply within a day</span></div><div className="form-grid"><Field label="Your name" className="field-full"><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your name" /></Field><Field label="Email"><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" /></Field><Field label="Subject"><input value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} placeholder="What’s on your mind?" /></Field><Field label="Message" className="field-full"><textarea value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell us a little more…" rows={4} /></Field></div><div className="form-submit-row"><button className="button button-dark" type="submit" disabled={contactMutation.isPending}>{contactMutation.isPending ? "Sending…" : "Send message"} <Send size={15} /></button>{contactSuccess && <span className="success-message"><Check size={15} /> Message sent.</span>}</div></form></div></div></section>
      </main>

      <footer className="footer"><div className="container footer-top"><div className="footer-brand"><button className="brand-mark brand-mark-footer" onClick={() => scrollTo("home")}><span className="brand-symbol"><Coffee size={18} strokeWidth={1.7} /></span><span><strong>Sip</strong>Theory</span></button><p>Where every sip<br />tells a story.</p></div><div className="footer-column"><span className="footer-label">Explore</span><button onClick={() => scrollTo("home")}>Home</button><button onClick={() => scrollTo("menu")}>Menu</button><button onClick={() => scrollTo("about")}>About</button><button onClick={() => scrollTo("gallery")}>Gallery</button></div><div className="footer-column"><span className="footer-label">Visit</span><button onClick={() => scrollTo("contact")}>Location</button><button onClick={() => scrollTo("contact")}>Opening hours</button><button onClick={() => scrollTo("reserve")}>Reservations</button><a href="mailto:hello@siptheory.com">Email us</a></div><div className="footer-column footer-signup"><span className="footer-label">Stay in the loop</span><p>New drinks, good news, occasional crumbs.</p><div className="email-capture"><input placeholder="Your email address" aria-label="Email address" /><button onClick={() => toast.success("You’re on the list — welcome to SipTheory.")} aria-label="Subscribe"><ArrowRight size={16} /></button></div></div></div><div className="container footer-bottom"><span>© 2026 SipTheory Cafe</span><span>Made for slow mornings & good company.</span><span><button onClick={() => toast("Privacy policy coming soon.")}>Privacy</button><button onClick={() => toast("Terms & conditions coming soon.")}>Terms</button></span></div></footer>

      {cartOpen && <div className="modal-layer" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Your order"><div className="drawer-header"><div><span className="drawer-kicker">SipTheory takeaway</span><h2>Your order <span>{cartCount} delicious {cartCount === 1 ? "choice" : "choices"}</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></button></div>{cart.length === 0 ? <div className="cart-empty"><span className="empty-cup"><Coffee size={29} /></span><h3>Your order is waiting.</h3><p>Add something lovely from the menu and it’ll appear here.</p><button className="button button-dark" onClick={() => { setCartOpen(false); scrollTo("menu"); }}>Browse the menu <ArrowRight size={16} /></button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-line" key={item.id}><img decoding="async" src={item.image} alt="" /><div className="cart-line-main"><div><strong>{item.name}</strong><span>₹{item.price}</span></div><div className="quantity-control"><button onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name}`}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><span>₹{subtotal}</span></div><div><span>Taxes (5%)</span><span>₹{tax}</span></div><div className="cart-total"><strong>Total</strong><strong>₹{total}</strong></div><button className="button button-dark full-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); setCheckoutSuccess(false); setReceipt(null); }}>Proceed to checkout <ArrowRight size={16} /></button><button className="continue-link" onClick={() => setCartOpen(false)}>Continue browsing</button><p className="checkout-note">Choose card payment or pay at pickup.</p></div></>}</aside></div>}
      {checkoutOpen && <div className="modal-layer" onClick={() => setCheckoutOpen(false)}><form className="cart-drawer checkout-drawer" onClick={(event) => event.stopPropagation()} onSubmit={submitCheckout} noValidate><div className="drawer-header"><div><span className="drawer-kicker">SipTheory takeaway</span><h2>Your order <span>{cartCount} delicious {cartCount === 1 ? "choice" : "choices"}</span></h2></div><button type="button" className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={20} /></button></div><div className="checkout-scroll"><div className="checkout-fields"><Field label="Full name"><input required value={checkout.name} onChange={(event) => setCheckout({ ...checkout, name: event.target.value })} placeholder="Your full name" autoComplete="name" /></Field><Field label="Phone number"><input required value={checkout.phone} onChange={(event) => setCheckout({ ...checkout, phone: event.target.value })} placeholder="Your phone number" autoComplete="tel" /></Field><Field label="Pickup time"><select value={checkout.pickupTime} onChange={(event) => setCheckout({ ...checkout, pickupTime: event.target.value })}><option>In 20 minutes</option><option>In 30 minutes</option><option>In 45 minutes</option><option>Schedule for later</option></select></Field></div><div className="payment-choice"><span className="checkout-label">Payment</span><div className="payment-options"><button type="button" className={checkout.paymentMethod === "card" ? "payment-option active" : "payment-option"} onClick={() => setCheckout({ ...checkout, paymentMethod: "card" })}><span className="payment-card-icon"><CreditCardIcon /></span><span><strong>Card</strong><small>Visa · Mastercard · RuPay</small></span><span className="radio-dot" /></button><button type="button" className={checkout.paymentMethod === "upi" ? "payment-option active" : "payment-option"} onClick={() => setCheckout({ ...checkout, paymentMethod: "upi" })}><span className="payment-card-icon"><QrCodeIcon /></span><span><strong>UPI</strong><small>Any UPI ID or app</small></span><span className="radio-dot" /></button><button type="button" className={checkout.paymentMethod === "gpay" ? "payment-option active" : "payment-option"} onClick={() => setCheckout({ ...checkout, paymentMethod: "gpay" })}><span className="payment-card-icon"><WalletIcon /></span><span><strong>Google Pay</strong><small>Fast checkout with GPay</small></span><span className="radio-dot" /></button><button type="button" className={checkout.paymentMethod === "bhim" ? "payment-option active" : "payment-option"} onClick={() => setCheckout({ ...checkout, paymentMethod: "bhim" })}><span className="payment-card-icon"><SmartphoneIcon /></span><span><strong>BHIM</strong><small>Pay securely with BHIM UPI</small></span><span className="radio-dot" /></button><button type="button" className={checkout.paymentMethod === "pickup" ? "payment-option active" : "payment-option"} onClick={() => setCheckout({ ...checkout, paymentMethod: "pickup" })}><span className="payment-card-icon"><ShoppingBag size={17} /></span><span><strong>Pay at pickup</strong><small>Cash or card at counter</small></span><span className="radio-dot" /></button></div></div>{checkout.paymentMethod === "card" && <div className="card-fields"><div className="card-brand-row"><span className="checkout-label">Card details</span><span className="card-badges">VISA · Mastercard · UPI</span></div><Field label="Card number"><input inputMode="numeric" value={checkout.cardNumber} onChange={(event) => setCheckout({ ...checkout, cardNumber: event.target.value })} placeholder="1234 1234 1234 1234" autoComplete="cc-number" /></Field><div className="card-fields-row"><Field label="Expiry"><input value={checkout.expiry} onChange={(event) => setCheckout({ ...checkout, expiry: event.target.value })} placeholder="MM / YY" autoComplete="cc-exp" /></Field><Field label="CVC"><input inputMode="numeric" value={checkout.cvc} onChange={(event) => setCheckout({ ...checkout, cvc: event.target.value })} placeholder="123" autoComplete="cc-csc" /></Field></div><p className="secure-payment-note"><LockIcon /> Test mode: no real money will be charged.</p></div>}{checkout.paymentMethod === "pickup" && <div className="pickup-note">Payment is made at pickup. No online payment will be processed.</div>}<div className="checkout-divider" /><div className="cart-summary checkout-summary"><div><span>Subtotal</span><span>₹{subtotal}</span></div><div><span>Taxes (5%)</span><span>₹{tax}</span></div><div className="cart-total"><strong>Total</strong><strong>₹{total}</strong></div></div></div><div className="checkout-actions"><button type="button" className="button button-back" onClick={() => { setCheckoutOpen(false); setCartOpen(true); }}>Back</button><button className="button button-dark checkout-submit" type="submit">{checkout.paymentMethod === "pickup" ? "Place pickup order" : `Pay ₹${total}`} <ArrowRight size={16} /></button></div>{checkoutSuccess && receipt && <div className="receipt-card" aria-live="polite"><div className="receipt-top"><span className="receipt-kicker"><Check size={14} /> Test payment successful</span><strong>RECEIPT</strong></div><div className="receipt-meta"><span>Receipt <b>{receipt.id}</b></span><span>{receipt.createdAt}</span></div><div className="receipt-customer"><strong>{checkout.name}</strong><span>{checkout.phone} · Pickup {checkout.pickupTime}</span></div><div className="receipt-items">{cart.map((item) => <div key={item.id}><span>{item.quantity} × {item.name}</span><strong>₹{item.price * item.quantity}</strong></div>)}</div><div className="receipt-total"><span>Total paid</span><strong>₹{total}</strong></div><div className="receipt-payment"><span>Payment method</span><strong>{receiptPaymentLabel(checkout.paymentMethod)}</strong></div><p>Thank you for choosing SipTheory.<br /><em>Have a nice day.</em></p><div className="receipt-actions"><button type="button" className="button button-dark receipt-download" onClick={() => downloadReceiptPdf(receipt, checkout, cart, subtotal, tax, total)}>Download PDF bill <ArrowDown size={15} /></button><button type="button" className="button button-outline receipt-close" onClick={() => { setCheckoutOpen(false); setCart([]); setReceipt(null); setCheckoutSuccess(false); }}>Done</button></div></div>}</form></div>}
      {galleryIndex !== null && <div className="modal-layer lightbox-layer" onClick={() => setGalleryIndex(null)}><div className="lightbox" onClick={(event) => event.stopPropagation()}><button className="lightbox-close icon-button" onClick={() => setGalleryIndex(null)} aria-label="Close gallery"><X size={21} /></button><img decoding="async" src={gallery[galleryIndex].image} alt={gallery[galleryIndex].label} /><div className="lightbox-caption"><span>{gallery[galleryIndex].label}</span><span>{String(galleryIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span></div></div></div>}
    </div>
  );
}

function MenuCard({ item, onAdd, onFavorite, isFavorite, featured, index }: { item: MenuItem; onAdd: (item: MenuItem) => void; onFavorite: () => void; isFavorite: boolean; featured?: boolean; index: number }) {
  return <article className={`menu-card ${featured ? "featured-card" : ""}`} style={{ "--card-index": index } as React.CSSProperties}><div className="menu-card-image"><img decoding="async" src={item.image} alt={item.name} loading="lazy" />{item.tag && <span className="menu-tag">{item.tag}</span>}<button className={`favorite-button ${isFavorite ? "is-favorite" : ""}`} onClick={onFavorite} aria-label={`${isFavorite ? "Remove" : "Add"} ${item.name} ${isFavorite ? "from" : "to"} favourites`}><Heart size={16} fill={isFavorite ? "currentColor" : "none"} /></button></div><div className="menu-card-body"><span className="menu-category">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="menu-card-bottom"><strong>₹{item.price}</strong><button className="add-button" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to order`}><Plus size={16} /></button></div></div></article>;
}

function MenuListCard({ item, onAdd, index }: { item: MenuItem; onAdd: (item: MenuItem) => void; index: number }) {
  return <article className="menu-list-card" style={{ "--card-index": index } as React.CSSProperties}><img decoding="async" src={item.image} alt="" loading="lazy" /><div className="menu-list-info"><div className="menu-list-title"><div><h3>{item.name}</h3><span className="menu-list-category">{item.category} {item.vegetarian && <span className="veg-dot" title="Vegetarian" />}</span></div><strong>₹{item.price}</strong></div><p>{item.description}</p><button className="text-add" onClick={() => onAdd(item)}>Add to order <Plus size={15} /></button></div></article>;
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return <label className={`field ${className}`}><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>;
}

function ArrowUpRightIcon() {
  return <ArrowRight size={15} style={{ transform: "rotate(-45deg)" }} />;
}
