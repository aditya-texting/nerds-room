import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EventData {
  id?: string | number;
  title: string;
  logo?: string;
  image: string;
  stats: { label: string; value: string }[];
  description: string;
  location: string;
  bgColor: string;
}

// ─── CountUp ──────────────────────────────────────────────────────────────────
const CountUp = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, isInView]);

  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
};

// ─── Shared card content ───────────────────────────────────────────────────────
const CardInner = ({ event }: { event: EventData }) => (
  <>
    <div className="mt-4 md:mt-5 lg:mt-6 mb-3 md:mb-3.5 lg:mb-4 flex items-center justify-center w-full px-4 md:px-5 lg:px-6">
      {event.logo ? (
        <div className="relative w-full h-[45px] md:h-[50px] lg:h-[60px]">
          <img src={event.logo} alt={event.title} className="object-contain w-full h-full" />
        </div>
      ) : (
        <span className="text-2xl md:text-3xl font-black text-black leading-tight text-center">
          {event.title}
        </span>
      )}
    </div>

    <div className="relative w-[250px] md:w-[290px] lg:w-[334px] h-[260px] md:h-[295px] lg:h-[347px] shrink-0">
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-[#0000001a]">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-2 left-[30%] space-y-1.5">
        {event.stats.map((stat, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-[12px] px-3 py-1.5 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#0000001a] w-fit"
          >
            <span className="text-[24px] font-normal text-[#34A853]">
              <CountUp value={stat.value} />
            </span>
            <span className="text-[16px] font-normal text-black truncate">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-center gap-1.5 text-black mt-auto pt-1.5 pb-4 px-4">
      <MapPin className="w-4 h-4 shrink-0" />
      <span className="text-[14px] font-medium text-center leading-tight">{event.location}</span>
    </div>
  </>
);

// ─── Desktop Card ─────────────────────────────────────────────────────────────
const DesktopEventCard = ({ event, index }: { event: EventData; index: number }) => {
  const isLower = index % 2 !== 0;
  return (
    <div className="flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true, margin: '-100px' }}
        className={`rounded-[20px] shadow-xl border border-[#0000001a] flex flex-col items-center
          md:max-w-[320px] lg:max-w-[372px]
          md:h-[430px] lg:h-[493px]
          ${event.bgColor}
          ${isLower ? 'lg:mt-[90px]' : 'lg:mt-[39px]'}
          mx-auto
        `}
      >
        <CardInner event={event} />
      </motion.div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const FlagshipEvents = () => {
  const { flagshipEvents: contextEvents, totalRegs, totalApprovedRegs, loading } = useAppData();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 1024;

  // ── Build events list ─────────────────────────────────────────────────────
  const events = useMemo(() => {
    return contextEvents
      .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
        const bgColors = ['bg-[#e8f5e9]', 'bg-[#fce4ec]', 'bg-[#eceff1]', 'bg-[#fff9c4]'];
        const dynamicStats = (ce.stats || []).map((s: any) => {
          const label = (s.label || '').toLowerCase();
          const rawVal = String(s.value || '').trim();
          const numVal = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          const isEmpty = !rawVal || rawVal === '0' || isNaN(numVal);
          if (isEmpty) {
            if (label.includes('registration')) return { ...s, value: `${totalRegs}+` };
            if (label.includes('attendee')) return { ...s, value: `${totalApprovedRegs || 350}+` };
            if (label.includes('speaker')) return { ...s, value: '30+' };
          }
          return s;
        });
        if (dynamicStats.length < 3) {
          if (!dynamicStats.find((s: any) => s.label.toLowerCase().includes('registration')))
            dynamicStats.push({ label: 'Registrations', value: `${totalRegs}+` });
          if (!dynamicStats.find((s: any) => s.label.toLowerCase().includes('attendee')))
            dynamicStats.push({ label: 'Attendees', value: `${totalApprovedRegs || 350}+` });
          if (!dynamicStats.find((s: any) => s.label.toLowerCase().includes('speaker')))
            dynamicStats.push({ label: 'Speakers', value: '30+' });
        }
        return {
          ...ce,
          stats: dynamicStats.slice(0, 3),
          bgColor: bgColors[i % bgColors.length],
          location: ce.location || 'Noida, India',
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs]);

  // ── Mobile carousel state ─────────────────────────────────────────────────
  const mobileCardsPerPage = 3;
  const mobileNumPages = Math.ceil(events.length / mobileCardsPerPage);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  // Auto-rotate mobile pages
  useEffect(() => {
    if (!isMobileView || events.length <= mobileCardsPerPage) return;
    const interval = setInterval(() => {
      setMobileActiveIndex((prev) => (prev + 1) % mobileNumPages);
    }, 6000);
    return () => clearInterval(interval);
  }, [isMobileView, events.length, mobileNumPages]);

  // Visible mobile events for current page
  const visibleMobileEvents = useMemo(() => {
    if (!events.length) return [];
    if (events.length <= mobileCardsPerPage) return events;
    const start = mobileActiveIndex * mobileCardsPerPage;
    let sliced = events.slice(start, start + mobileCardsPerPage);
    if (sliced.length < mobileCardsPerPage)
      sliced = [...sliced, ...events.slice(0, mobileCardsPerPage - sliced.length)];
    return sliced;
  }, [events, mobileActiveIndex]);

  // ── Mobile GSAP Scroll Stack ──────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    if (!isMobileView || !containerRef.current || visibleMobileEvents.length === 0) return;

    // Kill old context before re-init
    if (gsapCtxRef.current) {
      gsapCtxRef.current.revert();
      gsapCtxRef.current = null;
    }

    // Small delay so React DOM finishes rendering new cards
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;

      gsapCtxRef.current = gsap.context(() => {
        const cardsWrappers = gsap.utils.toArray<HTMLElement>('.card-wrapper');
        const cards = gsap.utils.toArray<HTMLElement>('.card');

        if (cardsWrappers.length === 0 || cards.length === 0) return;

        cardsWrappers.forEach((wrapper, i) => {
          const card = cards[i];
          if (!card) return;

          let scale = 1;
          let rotation = 0;
          if (i !== cards.length - 1) {
            scale = 0.9 + 0.025 * i;
            rotation = -10;
          }

          gsap.to(card, {
            scale,
            rotationX: rotation,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top ' + (60 + 10 * i),
              end: 'bottom 550',
              endTrigger: '.wrapper',
              scrub: true,
              pin: wrapper,
              pinSpacing: false,
              id: String(i + 1),
            },
          });
        });

        ScrollTrigger.refresh();
      }, containerRef.current);
    }, 50);

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
    if (events.length <= desktopCardsPerPage) return events;
    const start = desktopActiveIndex * desktopCardsPerPage;
    let sliced = events.slice(start, start + desktopCardsPerPage);
    if (sliced.length < desktopCardsPerPage)
      sliced = [...sliced, ...events.slice(0, desktopCardsPerPage - sliced.length)];
    return sliced;
  }, [events, desktopActiveIndex]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="flex gap-8 overflow-hidden justify-center">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-[372px] h-[493px] rounded-[20px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="events"
      className="relative py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden"
    >
      {/* ── Heading ── */}
      <div className="max-w-[1400px] mx-auto mb-10 md:mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base md:text-2xl text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>
      </div>

      {/* ══════════ MOBILE (< lg) ══════════ */}
      <div className="block lg:hidden">

        {/* GSAP Stacking Scroll Container */}
        <div
          className="wrapper relative w-full pt-10 pb-[50px]"
          style={{ minHeight: `${visibleMobileEvents.length * 450 + 200}px` }}
          ref={containerRef}
        >
          <div className="cards w-full max-w-[750px] mx-auto px-5">
            {/*
              NOTE: AnimatePresence removed here intentionally.
              It conflicts with GSAP ScrollTrigger pin/scrub system.
              Page transitions are handled by key change + GSAP re-init.
            */}
            <div
              key={mobileActiveIndex}
              className="w-full flex flex-col items-center"
            >
              {visibleMobileEvents.map((event, index) => (
                <div
                  key={`${mobileActiveIndex}-${event.id ?? index}`}
                  className="card-wrapper w-full mb-[50px] last:mb-0"
                  style={{ perspective: '500px' }}
                >
                  <div
                    className={`card w-[300px] h-[400px] rounded-[20px] shadow-xl border border-[#0000001a] flex flex-col items-center mx-auto ${event.bgColor}`}
                  >
                    <CardInner event={event} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        {events.length > mobileCardsPerPage && (
          <div className="flex justify-center gap-3 mt-6 pb-6">
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
          {/* AnimatePresence is fine on desktop — no GSAP conflict here */}
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