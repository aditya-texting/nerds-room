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

// ─── Utility: CountUp animation ─────────────────────────────────────────────
const CountUp = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = value;
          if (start === end) return;

          const totalFrames = Math.round(duration / 16);
          const increment = end / totalFrames;
          let currentFrame = 0;

          const timer = setInterval(() => {
            currentFrame++;
            start += increment;
            if (currentFrame >= totalFrames) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

// ─── Shared card content ───────────────────────────────────────────────────────
const CardInner = ({ event }: { event: EventData }) => (
  <>
    {/* Logo / Title */}
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

    {/* Image container */}
    <div className="relative w-[240px] md:w-[290px] lg:w-[334px] h-[230px] sm:h-[250px] md:h-[295px] lg:h-[347px] shrink-0">
      <div className="relative w-full h-full rounded-[16px] overflow-hidden shadow-md border border-[#00000012]">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* Stats container */}
      <div className="absolute bottom-3 left-4 md:left-6 lg:left-8 space-y-2 max-w-[90%]">
        {event.stats.map((stat, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-[12px] px-3 py-1.5 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#00000008] w-fit"
          >
            <span className="text-[18px] md:text-[24px] lg:text-[33px] font-medium text-[#34A853]">
              <CountUp value={stat.value} />
            </span>
            <span className="text-[13px] md:text-[16px] lg:text-[22px] font-normal text-black whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Location */}
    <div className="flex items-center justify-center gap-1.5 text-black mt-auto pt-2 pb-5 lg:pb-6 px-4">
      <MapPin className="w-4 h-4 md:w-5 lg:w-5 shrink-0 opacity-80" />
      <span className="text-[13px] md:text-[15px] lg:text-[20px] font-semibold text-center leading-tight tracking-tight">
        {event.location}
      </span>
    </div>
  </>
);

// ─── Desktop Card ─────────────────────────────────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────────────────────
const FlagshipEvents = () => {
  const { flagshipEvents: contextEvents, loading } = useAppData();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

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

  // ── Mobile GSAP Scroll Stack ──────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  // ── Mobile carousel state ──────────────────────────────────────────────────
  const mobileCardsPerPage = 3;
  const mobileNumPages = Math.ceil(events.length / mobileCardsPerPage);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const visibleMobileEvents = useMemo(() => {
    if (!events.length) return [];
    const start = mobileActiveIndex * mobileCardsPerPage;
    return events.slice(start, start + mobileCardsPerPage);
  }, [events, mobileActiveIndex, mobileCardsPerPage]);

  // Auto-rotate mobile pages
  useEffect(() => {
    if (!isMobileView || events.length <= mobileCardsPerPage) return;
    const interval = setInterval(() => {
      setMobileActiveIndex((prev) => (prev + 1) % mobileNumPages);
    }, 6000); // Matches the dot progress duration (6s)
    return () => clearInterval(interval);
  }, [isMobileView, events.length, mobileNumPages, mobileCardsPerPage]);

  useLayoutEffect(() => {
    if (!isMobileView || events.length === 0) return;

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

        gsap.set(cards, { opacity: 0, y: 30 });

        cardsWrappers.forEach((wrapper, i) => {
          const card = cards[i];
          if (!card) return;

          gsap.set(wrapper, { zIndex: i });

          let targetScale = 1;
          let targetRotation = 0;
          if (i !== cards.length - 1) {
            targetScale = 0.9 + (0.02 * i);
            targetRotation = -10;
          }

          gsap.to(card, {
            scale: targetScale,
            rotationX: targetRotation,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 60', 
              end: 'bottom bottom',
              endTrigger: containerRef.current,
              scrub: true,
              pin: wrapper,
              pinSpacing: false,
              pinType: 'fixed',
              id: String(i + 1),
            },
          });
        });

        gsap.to(cards, { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1,
          onComplete: () => {
            ScrollTrigger.refresh(true);
          }
        });
      }, containerRef.current);
    }, 600);

    return () => {
      clearTimeout(timeout);
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
        gsapCtxRef.current = null;
      }
    };
  }, [isMobileView, visibleMobileEvents]);

  // ── Desktop carousel state ────────────────────────────────────────────────
  const desktopCardsPerPage = 3;
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
  }, [events, desktopActiveIndex, desktopCardsPerPage]);

  if (loading) return <Skeleton />;
  if (!events.length) return null;

  return (
    <section id="events" className="relative py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto mb-10 md:mb-12 text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
          Our <span className="font-bold">Flagship Events</span>
        </h2>
        <p className="text-base md:text-2xl text-gray-600 mt-3">
          Our signature experiences that define excellence
        </p>
      </div>

      {/* ══════════ MOBILE (< lg) ══════════ */}
      <div className="block lg:hidden">
        <div 
          className="wrapper relative w-full pt-6"
          ref={containerRef}
          style={{ minHeight: `${visibleMobileEvents.length * 600}px` }}
        >
          <div className="cards w-full max-w-[750px] mx-auto px-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileActiveIndex}
                className="w-full flex flex-col items-center"
              >
                {visibleMobileEvents.map((event, index) => (
                  <div
                    key={`${mobileActiveIndex}-${event.id ?? index}`}
                    className="card-wrapper w-full mb-[50px] last:mb-0 flex justify-center"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className={`card w-full max-w-[280px] md:max-w-[320px] h-[380px] md:h-[430px] rounded-[20px] shadow-xl border border-[#0000001a] flex flex-col items-center ${event.bgColor}`}
                      style={{ backfaceVisibility: 'hidden', willChange: 'transform', transformStyle: 'preserve-3d' }}
                    >
                      <CardInner event={event} />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {events.length > mobileCardsPerPage && (
          <div className="flex justify-center gap-3 mt-4 pb-6">
            {Array.from({ length: mobileNumPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileActiveIndex(i)}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ${i === mobileActiveIndex
                  ? 'w-12 h-3'
                  : 'w-3 h-3 bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                {i === mobileActiveIndex && (
                  <motion.div
                    key={mobileActiveIndex}
                    className="absolute inset-0 bg-[#4285F4]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: 'linear' }}
                    style={{ originX: 0 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
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