import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const HERO_ADS = [
  {
    id: 1,
    tag: "NIGERIAN CRAFTSMANSHIP",
    title: "Naija Culture Celebration",
    description: "Up to 50% off native wears, hand-made accessories, and authentic Ankara fabrics from top local designers.",
    cta: "Explore Culture Collection",
    image: "https://images.unsplash.com/photo-1590075865003-e48277adc558?q=80&w=2070&auto=format&fit=crop",
    link: "/customer/categories"
  },
  {
    id: 2,
    tag: "SMART GADGETS",
    title: "High-Performance Electronics",
    description: "Up to 30% off laptops, mobile phones, and audio equipment with standard platform-backed vendor warranties.",
    cta: "Shop Electronic Deals",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2064&auto=format&fit=crop",
    link: "/customer/categories"
  },
  {
    id: 3,
    tag: "COMFORT LIVING",
    title: "Premium Furniture & Decor",
    description: "Make your living space stunning. Explore custom furniture and smart appliances crafted for home perfection.",
    cta: "Upgrade My Space",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop",
    link: "/customer/categories"
  }
];

const MINI_ADS = [
  {
    id: 1,
    title: "Free Delivery Nationwide",
    highlight: "No Hidden Fees",
    desc: "Order items totaling above ₦50,000 from any selection of approved vendors and enjoy zero shipping costs.",
    icon: "local_shipping",
    bg: "bg-gradient-to-r from-orange-600 to-amber-500"
  },
  {
    id: 2,
    title: "100% Secure Checkout",
    highlight: "Paystack Integrated",
    desc: "Your funds are securely escrowed by our platform using Paystack checkout. Rest easy while vendors fulfill.",
    icon: "verified_user",
    bg: "bg-gradient-to-r from-emerald-600 to-teal-500"
  },
  {
    id: 3,
    title: "Verified Local Sellers",
    highlight: "Strict Admin Audit",
    desc: "Every single merchant goes through visual background verification and manual approval before listing products.",
    icon: "gavel",
    bg: "bg-gradient-to-r from-purple-600 to-indigo-500"
  }
];

export default function CustomerHome() {
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hero carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = right, -1 = left
  
  // Mini ad ticker state
  const [activeMiniAd, setActiveMiniAd] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-play timers
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setSlideDirection(1);
      setActiveSlide((prev) => (prev + 1) % HERO_ADS.length);
    }, 6000);

    const miniTimer = setInterval(() => {
      setActiveMiniAd((prev) => (prev + 1) % MINI_ADS.length);
    }, 4500);

    return () => {
      clearInterval(heroTimer);
      clearInterval(miniTimer);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (prodRes.ok) {
        const products = await prodRes.json();
        setTrendingProducts(products.slice(0, 4)); // Just take first 4 as trending
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNextHero = () => {
    setSlideDirection(1);
    setActiveSlide((prev) => (prev + 1) % HERO_ADS.length);
  };

  const handlePrevHero = () => {
    setSlideDirection(-1);
    setActiveSlide((prev) => (prev - 1 + HERO_ADS.length) % HERO_ADS.length);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { x: { type: 'spring', stiffness: 150, damping: 20 }, opacity: { duration: 0.3 } }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { x: { type: 'spring', stiffness: 150, damping: 20 }, opacity: { duration: 0.3 } }
    })
  };

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop py-lg space-y-xl overflow-x-hidden">
      
      {/* Dynamic Animated Hero Ads Carousel */}
      <section className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden ambient-shadow bg-neutral-900 group">
        <AnimatePresence initial={false} custom={slideDirection} mode="wait">
          <motion.div
            key={activeSlide}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-stretch"
          >
            {/* Slide Content */}
            <div className="w-full md:w-[55%] flex flex-col justify-center p-8 md:p-14 z-20 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-transparent text-white relative">
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1.5 bg-action-orange text-white text-xs font-black uppercase tracking-widest rounded-full mb-6 w-fit"
              >
                {HERO_ADS[activeSlide].tag}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-none tracking-tight font-sans drop-shadow-sm"
              >
                {HERO_ADS[activeSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-neutral-200 mb-10 max-w-2xl leading-relaxed font-light"
              >
                {HERO_ADS[activeSlide].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  to={HERO_ADS[activeSlide].link} 
                  className="inline-flex items-center gap-2 bg-action-orange text-white font-label-md text-label-md px-6 py-3.5 rounded-xl hover:bg-white hover:text-black hover:scale-[1.03] transition-all shadow-lg shadow-action-orange/20 active:scale-[0.98] font-bold"
                >
                  {HERO_ADS[activeSlide].cta}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </motion.div>
            </div>

            {/* Slide Image Backdrop */}
            <div className="absolute inset-0 md:relative md:w-[45%] h-full z-0 overflow-hidden">
              <div className="absolute inset-0 bg-neutral-950/40 md:bg-transparent z-10" />
              <img 
                className="w-full h-full object-cover object-center md:opacity-100" 
                src={HERO_ADS[activeSlide].image} 
                alt={HERO_ADS[activeSlide].title} 
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Arrow Navigation */}
        <button
          onClick={handlePrevHero}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-action-orange text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Previous Slide"
        >
          <span className="material-symbols-outlined text-[24px]">chevron_left</span>
        </button>
        <button
          onClick={handleNextHero}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-action-orange text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Next Slide"
        >
          <span className="material-symbols-outlined text-[24px]">chevron_right</span>
        </button>

        {/* Carousel Indicators (Dots) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {HERO_ADS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setSlideDirection(index > activeSlide ? 1 : -1);
                setActiveSlide(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-8 bg-action-orange' : 'w-2.5 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Bento Grid Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Explore Categories</h2>
          <Link to="/customer/categories" className="font-label-md text-label-md text-action-orange hover:text-primary transition-colors flex items-center gap-1 font-bold">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-orange"></div></div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter"
          >
            {categories.slice(0, 4).map((c, i) => {
              const isLarge = i === 0;
              const isWide = i === 3;
              
              if (isLarge) {
                return (
                  <motion.div key={c.id} variants={itemVariants} className="col-span-2 row-span-2">
                    <Link to={`/customer/categories?id=${c.id}`} className="block relative h-64 md:h-[420px] rounded-2xl overflow-hidden ambient-shadow group card-hover bg-surface-white">
                      <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=2071&auto=format&fit=crop" alt={c.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full z-10">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-action-orange text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-orange-600/35">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          🔥 PREMIUM SELECTION
                        </div>
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 uppercase leading-none drop-shadow-lg">
                          {c.name}
                        </h3>
                        <p className="font-body-md text-sm md:text-base text-slate-100 hidden md:block font-light max-w-lg leading-relaxed opacity-95 drop-shadow">
                          Curated from the finest verified local artisans and top-tier Nigerian vendors. Guaranteed quality backed by our platform escrow security.
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              }
              
              if (isWide) {
                return (
                  <motion.div key={c.id} variants={itemVariants} className="col-span-2 md:col-span-2">
                    <Link to={`/customer/categories?id=${c.id}`} className="block relative h-32 md:h-[200px] rounded-2xl overflow-hidden ambient-shadow group card-hover bg-surface-container-low flex items-center justify-between p-6 md:p-8">
                      <div className="z-10">
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{c.name}</h3>
                        <p className="font-label-md text-label-md text-action-orange flex items-center gap-1 font-bold">Shop Gear <span className="material-symbols-outlined text-sm">chevron_right</span></p>
                      </div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-action-orange/10 via-transparent to-transparent"></div>
                    </Link>
                  </motion.div>
                );
              }

              return (
                <motion.div key={c.id} variants={itemVariants}>
                  <Link to={`/customer/categories?id=${c.id}`} className="block relative h-32 md:h-[200px] rounded-2xl overflow-hidden ambient-shadow group card-hover bg-surface-white">
                    <div className="absolute inset-0 bg-gradient-to-tr from-surface-variant to-surface-container-low transition-transform duration-700 group-hover:scale-105"></div>
                    <div className="absolute bottom-0 left-0 p-4 z-10 w-full bg-gradient-to-t from-black/60 to-transparent h-full flex items-end">
                      <h3 className="font-title-lg text-title-lg text-white font-bold">{c.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Middle Interactive Mini Ads Carousel */}
      <section className="w-full relative overflow-hidden rounded-2xl shadow-sm border border-neutral-200/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMiniAd}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className={`w-full p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 justify-between ${MINI_ADS[activeMiniAd].bg}`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[32px]">{MINI_ADS[activeMiniAd].icon}</span>
              </div>
              <div className="space-y-2 text-center md:text-left flex-grow">
                <span className="text-xs uppercase font-black tracking-widest bg-white/20 text-white px-3 py-1 rounded-full inline-block">
                  {MINI_ADS[activeMiniAd].highlight}
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight">
                  {MINI_ADS[activeMiniAd].title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-3xl leading-relaxed font-light">
                  {MINI_ADS[activeMiniAd].desc}
                </p>
              </div>
            </div>
            
            <Link 
              to="/customer/categories" 
              className="bg-white hover:bg-neutral-100 text-black font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              Learn More
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Mini dot indicators */}
        <div className="absolute bottom-3 right-6 flex items-center gap-1.5">
          {MINI_ADS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveMiniAd(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === activeMiniAd ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
              aria-label={`Go to mini-deal ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="pb-xl">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Trending Items</h2>
          <Link to="/customer/categories" className="font-label-md text-label-md text-action-orange hover:underline font-bold">View All</Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-orange"></div></div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-gutter"
          >
            {trendingProducts.map(p => (
              <motion.div 
                key={p.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                onClick={() => navigate(`/customer/product/${p.id}`)} 
                className="bg-surface-white rounded-xl p-md shadow-[0px_20px_25px_rgba(10,10,10,0.05)] transition-all duration-300 flex flex-col group cursor-pointer border border-transparent hover:border-surface-variant"
              >
                <div className="relative w-full aspect-square mb-md overflow-hidden rounded-lg bg-surface-container-low">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0].url} alt={p.title} className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-variant">
                       <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-xs line-clamp-2">{p.title}</h3>
                  <div className="flex items-center gap-1 mb-sm">
                    <span className="material-symbols-outlined text-action-orange text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">4.8</span>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="font-headline-md text-headline-md text-success-emerald block">₦{p.priceCents.toLocaleString()}</span>
                    </div>
                    <button className="bg-surface-container-low text-on-surface hover:bg-action-orange hover:text-white p-2 rounded-full transition-colors duration-200">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
