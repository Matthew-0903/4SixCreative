import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CircularGallery from './CircularGallery';
import JoinForm from './pages/JoinForm';
import { SplitText } from './SplitText';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prevent browser from restoring scroll position on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Force scroll to top immediately and after a short delay to override hash scrolling
    scrollToTop();
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 100);

    // Clear hash on reload to prevent jumping to sections
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [pathname]);

  return null;
};

const BlurText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const words = text.split(' ');

  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: delay + i * 0.1, ease: "easeOut" }}
          className="mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(245, 104, 48, 0.15)" }: { children: React.ReactNode, className?: string, spotlightColor?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-brand-tan/30 bg-white p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.65, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Logo = ({ className = "", color = "text-brand-black" }) => (
  <div className={`flex flex-col items-center justify-center leading-none ${color} ${className}`} style={{ fontFamily: "'The Seasons', 'Playfair Display', serif" }}>
    <div className="text-[1.8em] tracking-tight" style={{ marginBottom: '-0.15em' }}>4six</div>
    <div className="text-[2.2em] tracking-tighter">creative</div>
  </div>
);

const Navbar = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-3 flex items-center justify-between bg-brand-bg/90 backdrop-blur-md border-b border-brand-border">
      <a href="#hero" onClick={(e) => handleScroll(e, 'hero')} className="block hover:opacity-80 transition-opacity">
        <Logo className="text-[14px]" />
      </a>
      <div className="hidden md:flex gap-10 items-center">
        <a href="#services" onClick={(e) => handleScroll(e, 'services')} className="text-brand-mid text-sm font-medium tracking-wide hover:text-brand-black transition-colors">Services</a>
        <a href="#media" onClick={(e) => handleScroll(e, 'media')} className="text-brand-mid text-sm font-medium tracking-wide hover:text-brand-black transition-colors">Work</a>
        <a href="#process" onClick={(e) => handleScroll(e, 'process')} className="text-brand-mid text-sm font-medium tracking-wide hover:text-brand-black transition-colors">Process</a>
        <a href="#testimonials" onClick={(e) => handleScroll(e, 'testimonials')} className="text-brand-mid text-sm font-medium tracking-wide hover:text-brand-black transition-colors">Reviews</a>
        <Link to="/join" className="bg-brand-orange text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,104,48,0.3)] transition-all">Book a Call</Link>
      </div>
    </nav>
  );
};

const Hero = () => (
  <>
    <section id="hero" className="min-h-screen flex flex-col relative overflow-hidden bg-brand-cream pt-24">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-orange/15 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-lavender/25 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-brand-tan/20 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-brand-green/10 blur-[80px] mix-blend-multiply"></div>

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-noise"></div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 px-6 md:px-16 gap-12 items-stretch relative z-10">
        <div className="relative z-10 lg:col-span-6 flex flex-col justify-center py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="inline-flex items-center gap-3 text-brand-orange font-sans text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-8"
          >
            <span className="w-8 h-[1px] bg-brand-orange"></span>
            Social Media Marketing Agency
          </motion.div>

          <h1 className="font-serif text-6xl md:text-[clamp(4rem,7vw,6.5rem)] font-normal leading-[1.05] mb-6 text-brand-black tracking-tight flex flex-col">
            <BlurText text="Your Brand," delay={0.4} />
            <span className="italic text-brand-orange"><BlurText text="Amplified." delay={0.7} /></span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
            className="text-lg md:text-xl text-brand-charcoal/80 leading-relaxed font-light max-w-[480px] mb-10 font-sans"
          >
            We produce scroll-stopping video content and run strategic social media campaigns that turn followers into loyal, paying clients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
            className="flex flex-wrap gap-5 items-center"
          >
            <Link to="/join" className="bg-brand-black text-white px-9 py-4 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-brand-orange transition-colors duration-300 inline-block">
              Book a Free Call
            </Link>
            <a
              href="#media"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('media')?.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '#media');
              }}
              className="text-brand-black px-2 py-4 text-sm font-semibold tracking-wide uppercase hover:text-brand-orange transition-colors duration-300 inline-flex items-center gap-2 group"
            >
              See Our Work
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </motion.div>
        </div>

        <div className="relative z-10 lg:col-span-6 h-full w-full hidden md:flex items-end justify-center">
          {/* Background Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-tan/40 rounded-full blur-3xl -z-10"
          />

          {/* Main Transparent Image */}
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            src="/troyia-hero.png"
            alt="Troyia - Founder"
            className="w-auto h-[70vh] lg:h-[80vh] max-h-[850px] object-contain object-bottom z-20 drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />

          {/* Abstract Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[15%] z-30"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-orange to-[#e9bc8b] opacity-80 blur-[2px] shadow-lg"></div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[40%] right-[10%] z-30"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-lavender to-brand-green opacity-70 blur-[1px] shadow-md"></div>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[25%] left-[10%] z-30"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#f56830" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Scrolling Marquee Banner */}
      <div className="w-full bg-brand-orange py-4 overflow-hidden flex whitespace-nowrap relative z-30 border-y border-brand-orange/20 mt-auto">
        <div className="animate-marquee flex items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center text-white font-sans text-sm md:text-base font-semibold tracking-[0.15em] uppercase">
              <span className="mx-6">Social Media Management</span>
              <span className="mx-2">✦</span>
              <span className="mx-6">Content Creation</span>
              <span className="mx-2">✦</span>
              <span className="mx-6">Brand Strategy</span>
              <span className="mx-2">✦</span>
              <span className="mx-6">Community Growth</span>
              <span className="mx-2">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

const Logos = () => (
  <div id="logos" className="py-10 px-6 md:px-16 border-y border-brand-border bg-white">
    <p className="text-xs text-[#999] tracking-widest uppercase text-center mb-6">Trusted by Brands Across Industries</p>
    <div className="flex gap-12 items-center justify-center flex-wrap">
      {['Jumpman', 'Redbull', 'Amazon', 'Coach', 'Amex', 'AT&T', 'Shea Moisture', 'Fenty Skin'].map((logo, i) => (
        <div key={i} className="font-serif italic text-lg text-black/25 font-normal tracking-tight whitespace-nowrap hover:text-black/60 transition-colors">
          {logo}
        </div>
      ))}
    </div>
  </div>
);

const Services = () => (
  <section id="services" className="py-24 px-6 md:px-16 bg-brand-cream relative overflow-hidden">
    {/* Background elements for Services */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-lavender/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div className="max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-brand-orange block mb-4">What We Offer</span>
        </Reveal>
        <h2 className="font-serif text-4xl md:text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.15] text-brand-black mb-6 flex justify-center flex-wrap">
          <BlurText text="Everything You Need to" />
          <em className="italic ml-2 text-brand-orange"><BlurText text="Grow." delay={0.4} /></em>
        </h2>
        <Reveal delay={0.2}>
          <p className="text-lg text-brand-mid leading-relaxed max-w-2xl mx-auto font-light">
            End-to-end social media and video production services, designed to move leads through your funnel and build a magnetic brand.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            tag: 'Most Popular',
            name: 'Full-Service Social Media Management',
            desc: 'We take over your social channels completely. Strategy, content creation, scheduling, and community management across all platforms.',
            price: 'Custom Quote',
            linkText: 'Apply Now'
          },
          {
            tag: 'Video',
            name: 'Video Editing & Production',
            desc: 'Reels, brand films, and social-first video edits crafted to convert — not just look good. We handle the editing so you can focus on creating.',
            price: 'Starting at $1,500/mo',
            linkText: 'View Packages'
          },
          {
            tag: 'Strategy',
            name: '1:1 Social Media Strategy Call',
            desc: 'A 60-minute deep dive into your current strategy. We audit your profiles and give you a clear, actionable roadmap for growth.',
            price: '$250',
            linkText: 'Book Session'
          },
          {
            tag: 'Digital Product',
            name: 'The Content Creator Playbook',
            desc: 'Our exact frameworks for creating viral hooks, structuring videos, and batching content like a pro. Instant download.',
            price: '$47',
            linkText: 'Get the Playbook'
          },
        ].map((svc, i) => (
          <Reveal key={i} delay={0.1 * i}>
            <SpotlightCard className="h-full flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[0.65rem] font-bold tracking-widest uppercase bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full inline-block">
                    {svc.tag}
                  </span>
                  <span className="text-sm font-medium text-brand-charcoal/60 bg-brand-tan/20 px-3 py-1 rounded-full">
                    {svc.price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-orange transition-colors">
                  {svc.name}
                </h3>
                <p className="text-sm text-brand-mid leading-relaxed mb-8">
                  {svc.desc}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-brand-tan/30 pt-4 mt-auto">
                <span className="text-sm font-bold tracking-wide uppercase text-brand-black group-hover:text-brand-orange transition-colors">
                  {svc.linkText}
                </span>
                <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                  →
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const MediaHub = () => {
  const videos = [
    { id: 1, url: 'https://www.instagram.com/reel/DOYT8CoDU9R/embed' },
    { id: 2, url: 'https://www.instagram.com/reel/DPAKcXFjV43/embed' },
    { id: 3, url: 'https://www.instagram.com/reel/DMiSBQcugAZ/embed' },
    { id: 4, url: 'https://www.instagram.com/reel/DL3fXkvOO0i/embed' },
    { id: 5, url: 'https://www.instagram.com/reel/DLD6nwqu-44/embed' },
    { id: 6, url: 'https://www.instagram.com/reel/DF6P_67uaKO/embed' },
    { id: 7, url: 'https://www.instagram.com/reel/DDQI1U6ytvy/embed' },
    { id: 8, url: 'https://www.instagram.com/reel/DBh4OoTOy3V/embed' },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);

  return (
    <section id="media" className="py-24 bg-brand-cream text-brand-black overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-brand-lavender/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-brand-orange/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="px-6 md:px-16 relative z-10">
        <Reveal>
          <div className="flex flex-col items-center mb-12 gap-4">
            <div className="text-center">
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-brand-orange block mb-3">Portfolio</span>
              <h2 className="font-serif italic font-normal text-4xl md:text-[clamp(2rem,3.5vw,2.8rem)] leading-[1.15] text-brand-black">Real Work. Real Results.</h2>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-brand-tan/50 flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-brand-tan/50 flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative w-full py-10 overflow-hidden">
        <motion.div
          className="flex gap-8 px-[50vw]"
          animate={{ x: `calc(-${currentIndex * 372}px - 170px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {videos.map((v, i) => {
            const isCenter = i === currentIndex;
            return (
              <motion.div
                key={v.id}
                animate={{
                  scale: isCenter ? 1.05 : 0.9,
                  opacity: isCenter ? 1 : 0.4,
                }}
                transition={{ duration: 0.4 }}
                className={`w-[340px] shrink-0 flex justify-center bg-white rounded-2xl overflow-hidden shadow-2xl border ${isCenter ? 'border-brand-orange shadow-brand-orange/20' : 'border-brand-tan/30 cursor-pointer'}`}
                onClick={() => setCurrentIndex(i)}
              >
                <div className={`w-full h-[450px] overflow-hidden rounded-2xl relative ${!isCenter ? 'pointer-events-none' : ''}`}>
                  <iframe
                    src={v.url}
                    className="w-full h-[650px] absolute top-[-2px] left-0"
                    frameBorder="0"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Process = () => (
  <section id="process" className="py-24 px-6 md:px-16 bg-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
    <Reveal>
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-[0.14em] uppercase text-brand-orange block mb-3">How It Works</span>
        <h2 className="font-serif italic font-normal text-4xl md:text-[clamp(2rem,3.5vw,2.8rem)] leading-[1.15] text-brand-black">
          From First Call to <em className="not-italic">Full Growth.</em>
        </h2>
      </div>
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Vertical Line */}
        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-tan/30 -z-10 hidden md:block"></div>

        {[
          { n: '1', title: 'Discovery Call', desc: '30 minutes to understand your brand, audience, and business goals inside out.' },
          { n: '2', title: 'Custom Strategy', desc: 'We build a content roadmap aligned with your voice, industry, and growth KPIs.' },
          { n: '3', title: 'Create & Publish', desc: 'We produce and post consistently — on-brand, on-schedule, every time.' },
          { n: '4', title: 'Optimize & Scale', desc: 'Monthly reviews and strategy refinements to compound your results long-term.' },
        ].map((step, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-1/2 hidden md:flex justify-end pr-12">
                {i % 2 === 0 && (
                  <div className="text-right">
                    <h3 className="text-2xl font-bold mb-2 text-brand-black">{step.title}</h3>
                    <p className="text-brand-mid leading-relaxed">{step.desc}</p>
                  </div>
                )}
              </div>

              <div className="w-14 h-14 shrink-0 rounded-full bg-brand-orange text-white flex items-center justify-center font-serif text-2xl italic shadow-[0_0_20px_rgba(245,104,48,0.3)] z-10 mx-auto md:mx-0">
                {step.n}
              </div>

              <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
                {i % 2 !== 0 ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-brand-black">{step.title}</h3>
                    <p className="text-brand-mid leading-relaxed">{step.desc}</p>
                  </div>
                ) : (
                  <div className="md:hidden">
                    <h3 className="text-2xl font-bold mb-2 text-brand-black">{step.title}</h3>
                    <p className="text-brand-mid leading-relaxed">{step.desc}</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  </section>
);

const Testimonials = () => (
  <section id="testimonials" className="py-24 px-6 md:px-16 bg-brand-cream">
    <Reveal>
      <div className="text-center mb-2">
        <span className="text-xs font-bold tracking-[0.14em] uppercase text-brand-orange block mb-3">Client Reviews</span>
        <h2 className="font-serif italic font-normal text-4xl md:text-[clamp(2rem,3.5vw,2.8rem)] leading-[1.15] text-brand-black">What Our Clients Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          { quote: "4Six transformed our Instagram. Engagement tripled in 60 days and we closed 3 contracts directly from social media.", av: "MR", name: "Marcus Reed", biz: "Reed Real Estate Group", bg: "bg-brand-orange/10", color: "text-brand-orange" },
          { quote: "The video content they created for our launch got 200K organic views. The ROI is unlike anything we've seen before.", av: "JC", name: "Jasmine Cole", biz: "GLOW Beauty Co.", bg: "bg-brand-lavender/20", color: "text-brand-lavender" },
          { quote: "They truly understand your vision and deliver beyond expectations.", av: "DW", name: "Demi Williams", biz: "Brand Coach & Speaker", bg: "bg-brand-green/10", color: "text-brand-green" },
        ].map((t, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="bg-white border border-brand-border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.07)]">
              <div className="text-brand-orange text-sm tracking-widest mb-4">★★★★★</div>
              <p className="text-[0.95rem] text-brand-charcoal leading-relaxed italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.bg} ${t.color}`}>
                  {t.av}
                </div>
                <div>
                  <div className="text-sm font-bold text-brand-black">{t.name}</div>
                  <div className="text-xs text-brand-mid">{t.biz}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-24 px-6 md:px-16 bg-brand-bg">
    <Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        <div className="pt-4">
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-brand-orange block mb-3">Let's Work Together</span>
          <h2 className="font-serif italic font-normal text-4xl md:text-[2.5rem] leading-[1.2] mb-5 text-brand-black">
            Ready to Level Up<br />Your <em className="not-italic">Brand?</em>
          </h2>
          <p className="text-base text-brand-mid leading-relaxed mb-10 font-light">
            Book a free 30-minute strategy call. We'll audit your current presence and give you a clear path to growth — no pressure, no fluff.
          </p>
          <div className="flex flex-col gap-5">
            {[
              '100% Free Strategy Session',
              'Custom Content Roadmap Included',
              'GoHighLevel CRM Integration Available',
              'Response Within 24 Hours'
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full shrink-0 bg-brand-orange-light flex items-center justify-center text-brand-orange text-base">✓</div>
                <div className="text-sm font-medium text-brand-black">{f}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-brand-border rounded-[20px] p-8 md:p-12 shadow-[0_8px_48px_rgba(0,0,0,0.06)]">
          <div className="text-xl font-bold text-brand-black mb-1.5">Book Your Free Strategy Call</div>
          <div className="text-sm text-brand-mid mb-8">Fill out the form and we'll reach out to schedule your session.</div>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-black tracking-wider uppercase mb-1.5">First Name</label>
                <input type="text" placeholder="Troyia" className="w-full px-4 py-3 border-[1.5px] border-brand-border rounded-lg font-sans text-sm text-brand-black bg-brand-bg transition-colors focus:outline-none focus:border-brand-orange focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-black tracking-wider uppercase mb-1.5">Last Name</label>
                <input type="text" placeholder="Smith" className="w-full px-4 py-3 border-[1.5px] border-brand-border rounded-lg font-sans text-sm text-brand-black bg-brand-bg transition-colors focus:outline-none focus:border-brand-orange focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-black tracking-wider uppercase mb-1.5">Email Address</label>
              <input type="email" placeholder="hello@yourbrand.com" className="w-full px-4 py-3 border-[1.5px] border-brand-border rounded-lg font-sans text-sm text-brand-black bg-brand-bg transition-colors focus:outline-none focus:border-brand-orange focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-black tracking-wider uppercase mb-1.5">Business Type</label>
              <select className="w-full px-4 py-3 border-[1.5px] border-brand-border rounded-lg font-sans text-sm text-brand-black bg-brand-bg transition-colors focus:outline-none focus:border-brand-orange focus:bg-white appearance-none">
                <option value="">Select your industry</option>
                <option>Real Estate</option>
                <option>E-Commerce / Retail</option>
                <option>Personal Brand / Coach</option>
                <option>Beauty / Wellness</option>
                <option>Restaurant / Food & Beverage</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-black tracking-wider uppercase mb-1.5">Monthly Budget (Optional)</label>
              <select className="w-full px-4 py-3 border-[1.5px] border-brand-border rounded-lg font-sans text-sm text-brand-black bg-brand-bg transition-colors focus:outline-none focus:border-brand-orange focus:bg-white appearance-none">
                <option value="">Select a range</option>
                <option>Under $500</option>
                <option>$500 – $1,500</option>
                <option>$1,500 – $3,000</option>
                <option>$3,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-black tracking-wider uppercase mb-1.5">Your Goals</label>
              <textarea placeholder="What results are you looking for?" className="w-full px-4 py-3 border-[1.5px] border-brand-border rounded-lg font-sans text-sm text-brand-black bg-brand-bg transition-colors focus:outline-none focus:border-brand-orange focus:bg-white h-[100px] resize-none"></textarea>
            </div>
            <button type="submit" className="w-full p-4 bg-brand-orange text-white border-none font-sans text-sm font-bold tracking-wider rounded-lg cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(245,104,48,0.3)] mt-2">
              Book My Free Strategy Call →
            </button>
            <p className="text-xs text-[#aaa] text-center mt-3">No commitment required. We'll never share your info.</p>
          </form>
        </div>
      </div>
    </Reveal>
  </section>
);

const InstagramGrid = () => {
  const items = [
    { image: '/image1.jpeg', text: 'Social Feed' },
    { image: '/image2.jpg', text: 'Aesthetic' },
    { image: '/image3.jpg', text: 'Vibes' },
    { image: '/image4.jpeg', text: 'Creative' },
    { image: '/image5.jpg', text: 'Growth' },
    { image: '/image6.jpg', text: 'Brand' },
    { image: '/image7.jpg', text: 'Strategy' },
  ];

  return (
    <section className="py-24 bg-brand-bg overflow-hidden">
      <Reveal>
        <div className="text-center mb-12 px-6 md:px-16">
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-brand-orange block mb-3">Social Feed</span>
          <h2 className="font-serif italic font-normal text-4xl md:text-[clamp(2rem,3.5vw,2.8rem)] leading-[1.15] text-brand-black">
            Curated <em className="not-italic">Aesthetic.</em>
          </h2>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery
            items={items}
            bend={3}
            textColor="#1a1a1a"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      </Reveal>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-brand-black text-white relative overflow-hidden pt-24 pb-12 px-6 md:px-16">
    {/* Background Glows */}
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-orange/20 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-brand-lavender/20 blur-[120px] rounded-full pointer-events-none"></div>

    <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col items-center text-center mb-20">
        <SplitText
          text="Let's build something beautiful."
          className="font-serif italic text-5xl md:text-7xl mb-8 text-white"
          delay={200}
        />
        <Link to="/join" className="bg-brand-orange text-white px-10 py-5 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-white hover:text-brand-orange transition-all duration-300 shadow-[0_0_30px_rgba(245,104,48,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
          Start Your Project
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10">
        <Logo className="text-[24px]" color="text-white" />
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#services" className="text-white/60 text-sm hover:text-brand-orange transition-colors font-medium tracking-wide">Services</a>
          <a href="#media" className="text-white/60 text-sm hover:text-brand-orange transition-colors font-medium tracking-wide">Work</a>
          <a href="#process" className="text-white/60 text-sm hover:text-brand-orange transition-colors font-medium tracking-wide">Process</a>
          <Link to="/join" className="text-white/60 text-sm hover:text-brand-orange transition-colors font-medium tracking-wide">Contact</Link>
        </div>
        <div className="text-xs text-white/40 tracking-wider">
          © 2026 4Six Creative. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

const Home = () => {
  return (
    <div className="font-sans bg-brand-bg text-brand-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <Logos />
      <Services />
      <MediaHub />
      <InstagramGrid />
      <Process />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinForm />} />
      </Routes>
    </Router>
  );
}
