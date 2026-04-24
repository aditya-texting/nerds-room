import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EventData {
  id?: string | number;
  title: string;
  logo?: string;
  image: string;
  stats: { label: string; value: number }[];
  description: string;
  location: string;
  bgColor: string;
}

// ─── CountUp ────────────────────────────────────────────────────────────────
const CountUp = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number | null = null;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(value);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// ─── Card Inner ───────────────────────────────────────────────────────────────
const CardInner = ({ event }: { event: EventData }) => (
  <>
    <div className="mt-5 md:mt-6 mb-4 flex items-center justify-center w-full px-6">
      {event.logo ? (
        <div className="relative w-full h-[45px] md:h-[50px] lg:h-[60px]">
          <img src={event.logo} alt={event.title} className="object-contain w-full h-full" />
        </div>
      ) : (
        <span className="text-xl md:text-2xl lg:text-3xl font-black text-black leading-tight text-center">
          {event.title}
        </span>
      )}
    </div>

    <div className="relative w-[240px] md:w-[290px] lg:w-[334px] h-[230px] sm:h-[250px] md:h-[295px] lg:h-[347px] shrink-0">
      <div className="relative w-full h-full rounded-[16px] overflow-hidden shadow-md border border-[#00000012]">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-3 left-4 md:left-6 lg:left-8 space-y-2 max-w-[90%]">
        {event.stats.map((stat, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-[12px] px-3 py-1.5 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#00000008] w-fit"
          >
            <span className="text-[18px] md:text-[24px] font-medium text-[#34A853]">
              <CountUp value={stat.value} />
            </span>
            <span className="text-[13px] md:text-[16px] font-normal text-black whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-center gap-1.5 text-black mt-auto pt-2 pb-5 lg:pb-6 px-4">
      <MapPin className="w-4 h-4 md:w-5 shrink-0 opacity-80" />
      <span className="text-[13px] md:text-[15px] lg:text-[20px] font-semibold text-center leading-tight tracking-tight">
        {event.location}
      </span>
    </div>
  </>
);

// ─── Desktop Event Card ───────────────────────────────────────────────────────
const DesktopEventCard = ({ event, index }: { event: EventData; index: number }) => {
  const isLower = index % 2 !== 0;
  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[372px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true, margin: '-100px' }}
        className={`rounded-[20px] shadow-xl border border-[#0000001a] flex flex-col items-center w-full h-[380px] md:h-[430px] lg:h-[493px] ${event.bgColor} ${isLower ? 'lg:mt-[90px]' : 'lg:mt-[39px]'} mx-auto`}
      >
        <CardInner event={event} />
      </motion.div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FlagshipEvents = () => {
  const { flagshipEvents: contextEvents, loading } = useAppData();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 1024;

  const events: EventData[] = useMemo(() => {
    if (!contextEvents) return [];
    return contextEvents.map((e: any) => ({
      ...e,
      bgColor: e.bgColor || 'bg-white',
    }));
  }, [contextEvents]);

  // ── Config ────────────────────────────────────────────────────────────────
  const desktopCardsPerPage = 3;

  // ── Mobile Progress Indicators ──────────────────────────────────────────────
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  // Sync active index with scroll position for dots
  useEffect(() => {
    if (!isMobileView) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const targetOffset = containerRef.current?.offsetTop || 0;
      const cardHeight = 440; // Approx height per card trigger
      const index = Math.max(0, Math.min(events.length - 1, Math.floor((scrollPos - targetOffset) / cardHeight)));
      setMobileActiveIndex(index);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileView, events.length]);

  const visibleMobileEvents = useMemo(() => {
    if (!events.length) return [];
    if (isMobileView) return events;
    return events.slice(0, desktopCardsPerPage);
  }, [events, isMobileView]);

  // ── GSAP Scroll Stack Logic ─────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    // Mobile specific ScrollTrigger config
    ScrollTrigger.config({ 
      ignoreMobileResize: true,
    });

    if (!isMobileView || visibleMobileEvents.length === 0) return;

    if (gsapCtxRef.current) {
      gsapCtxRef.current.revert();
      gsapCtxRef.current = null;
    }

    const timeout = setTimeout(() => {
      if (!containerRef.current) return;

      gsapCtxRef.current = gsap.context(() => {
        const cardsWrappers = gsap.utils.toArray<HTMLElement>('.card-wrapper');
        const cards = gsap.utils.toArray<HTMLElement>('.card');

        if (cardsWrappers.length === 0 || cards.length === 0) return;

        cardsWrappers.forEach((wrapper, i) => {
          const card = cards[i];
          if (!card) return;

          // Pin the current card
          ScrollTrigger.create({
            trigger: wrapper,
            start: "top 80",
            endTrigger: containerRef.current,
            end: "bottom 550",
            pin: true,
            pinSpacing: false,
            scrub: true,
            id: `pin-${i}`,
            anticipatePin: 1
          });

          // Animation for the card: 
          // As the NEXT card starts to enter, this card scales down and fades out
          if (i < cards.length - 1) {
            const nextWrapper = cardsWrappers[i + 1];
            gsap.to(card, {
              scale: 0.92,
              opacity: 0.6,
              filter: "blur(1px)",
              ease: "none",
              scrollTrigger: {
                trigger: nextWrapper,
                start: "top bottom",
                end: "top 80",
                scrub: true,
                id: `scale-${i}`
              }
            });
          }
        });

        setTimeout(() => ScrollTrigger.refresh(), 200);
      }, containerRef.current);
    }, 400);

    return () => {
      clearTimeout(timeout);
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }
    };
  }, [isMobileView, events.length]);

  // ── Desktop carousel ──────────────────────────────────────────────────────
  const desktopNumPages = Math.ceil(events.length / desktopCardsPerPage);
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);

  useEffect(() => {
    if (isMobileView || events.length <= desktopCardsPerPage) return;
    const interval = setInterval(() => {
      setDesktopActiveIndex((prev) => (prev + 1) % desktopNumPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobileView, events.length, desktopNumPages]);

  const visibleDesktopEvents = useMemo(() => {
    if (!events.length) return [];
    const start = desktopActiveIndex * desktopCardsPerPage;
    return events.slice(start, start + desktopCardsPerPage);
  }, [events, desktopActiveIndex]);

  if (loading) return <Skeleton />;
  if (!events.length) return null;

  return (
    <section
      id="events"
      className="relative py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-10 md:mb-12 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
          Our <span className="font-bold">Flagship Events</span>
        </h2>
        <p className="text-base md:text-2xl text-gray-600 mt-3">
          Our signature experiences that define excellence
        </p>
      </div>

      {/* ══════════ MOBILE (< lg) — GDG Noida Style Stack ══════════ */}
      <div className="block lg:hidden">
        <div 
          className="wrapper relative w-full pt-[40px] pb-[400px] flex justify-center"
          ref={containerRef}
        >
          <div className="cards w-full max-w-[450px] flex flex-col items-center px-4">
            {events.map((event, i) => (
              <div 
                key={event.id ?? i} 
                className="card-wrapper w-full mb-[300px] last:mb-0 flex justify-center h-[400px]"
              >
                <div 
                  className={`card w-full max-w-[320px] h-full flex flex-col items-center rounded-[24px] shadow-2xl border border-[#0000001a] ${event.bgColor}`}
                  style={{ 
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    zIndex: i + 1
                  }}
                >
                  <CardInner event={event} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators for scroll progress */}
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center gap-3 px-4 py-2 pointer-events-none">
          <div className="flex gap-2 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 pointer-events-auto shadow-lg">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const targetScroll = containerRef.current?.offsetTop || 0;
                  window.scrollTo({ top: targetScroll + i * 440, behavior: 'smooth' });
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === mobileActiveIndex
                  ? 'bg-[#4285F4] w-8'
                  : 'bg-gray-400 opacity-50 hover:opacity-100'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ DESKTOP (lg+) ══════════ */}
      <div className="hidden lg:block">
        <div className="relative w-full flex justify-center min-h-[583px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={desktopActiveIndex}
              className="flex flex-row gap-[80px] lg:gap-[120px] w-full justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              {visibleDesktopEvents.map((event, index) => (
                <DesktopEventCard
                  key={`${desktopActiveIndex}-${event.id ?? index}`}
                  event={event}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {events.length > desktopCardsPerPage && (
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: desktopNumPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setDesktopActiveIndex(i)}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ${i === desktopActiveIndex
                  ? 'w-12 h-3'
                  : 'w-3 h-3 bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                {i === desktopActiveIndex && (
                  <motion.div
                    key={desktopActiveIndex}
                    className="absolute inset-0 bg-[#4285F4]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                    style={{ originX: 0 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlagshipEvents;