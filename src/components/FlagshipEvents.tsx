import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// ─── Mobile Scroll Stack ──────────────────────────────────────────────────────
// Pure CSS sticky stack — no GSAP needed.
// Each "page" shows 3 cards that stack on scroll, then auto-advances.
const CARD_HEIGHT = 420;   // px  — visible card height
const STACK_OFFSET = 14;   // px  — vertical peek of card below

const MobileScrollStack = ({
  events,
  pageIndex,
  onPageEnd,
}: {
  events: EventData[];
  pageIndex: number;
  onPageEnd: () => void;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const notifiedRef = useRef(false);

  // Reset when page changes
  useEffect(() => {
    setActiveCard(0);
    notifiedRef.current = false;
  }, [pageIndex]);

  // Scroll observer — watch which card's sentinel is visible
  useEffect(() => {
    const sentinels = Array.from(
      sectionRef.current?.querySelectorAll('.scroll-sentinel') ?? []
    ) as HTMLElement[];

    if (!sentinels.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveCard(idx);

            // Last card reached → trigger page change
            if (idx === events.length - 1 && !notifiedRef.current) {
              notifiedRef.current = true;
              // Small delay so user sees the last card before flip
              setTimeout(onPageEnd, 2200);
            }
          }
        });
      },
      {
        root: null,
        // Fire when sentinel hits the middle of the viewport
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    sentinels.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [events, onPageEnd]);

  return (
    <div ref={sectionRef} className="relative w-full">
      {/*
        Total scroll height = 1 card visible + (n-1) scrollable steps
        Each step = CARD_HEIGHT so the next card's sentinel enters viewport
      */}
      <div
        style={{ height: CARD_HEIGHT + (events.length - 1) * CARD_HEIGHT + 120 }}
        className="relative"
      >
        {/* Sticky container that holds all cards */}
        <div
          className="sticky flex flex-col items-center"
          style={{
            top: 80, // below navbar
            height: CARD_HEIGHT + (events.length - 1) * STACK_OFFSET,
          }}
        >
          {events.map((event, i) => {
            const isBehind = i < activeCard;
            const isActive = i === activeCard;
            const isAbove = i > activeCard;

            // z-order: active card on top, cards above are "incoming" (lower z)
            const zIndex = isAbove ? 10 + i : events.length - i + 10;

            // Visual offsets for stack effect
            const scale = isActive ? 1 : isBehind ? 0.92 - (activeCard - i) * 0.02 : 1;
            const yOffset = isActive
              ? 0
              : isBehind
                ? -(activeCard - i) * STACK_OFFSET * 0.5
                : (i - activeCard) * STACK_OFFSET;
            const blurVal = isBehind ? Math.min((activeCard - i) * 4, 10) : 0;
            const opacityVal = isBehind ? Math.max(1 - (activeCard - i) * 0.25, 0.35) : 1;

            return (
              <motion.div
                key={event.id ?? i}
                animate={{
                  scale,
                  y: yOffset,
                  opacity: opacityVal,
                  filter: `blur(${blurVal}px)`,
                }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="absolute top-0 w-full flex justify-center"
                style={{ zIndex }}
              >
                <div
                  className={`w-full max-w-[320px] flex flex-col items-center rounded-[32px]
                    shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#0000001a] ${event.bgColor}`}
                  style={{ height: CARD_HEIGHT, willChange: 'transform, opacity' }}
                >
                  <CardInner event={event} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Invisible sentinels — drive the scroll progress */}
        {events.map((_, i) => (
          <div
            key={i}
            className="scroll-sentinel absolute w-full"
            data-index={i}
            style={{ top: i * CARD_HEIGHT }}
          />
        ))}
      </div>
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

  // ── Mobile page state ──────────────────────────────────────────────────────
  const CARDS_PER_PAGE = 3;
  const mobileNumPages = Math.ceil(events.length / CARDS_PER_PAGE);
  const [mobilePageIndex, setMobilePageIndex] = useState(0);

  const visibleMobileEvents = useMemo(() => {
    const start = mobilePageIndex * CARDS_PER_PAGE;
    return events.slice(start, start + CARDS_PER_PAGE);
  }, [events, mobilePageIndex]);

  const goNextMobilePage = () => {
    setMobilePageIndex((prev) => (prev + 1) % mobileNumPages);
    // Scroll back up to the section top so the new page starts fresh
    const section = document.getElementById('events');
    if (section) {
      window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    }
  };

  // ── Desktop carousel ──────────────────────────────────────────────────────
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
  }, [events, desktopActiveIndex]);

  if (loading) return <Skeleton />;
  if (!events.length) return null;

  return (
    <section
      id="events"
      className="relative py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-white overflow-x-hidden"
    >
      {/* Section Header */}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={mobilePageIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <MobileScrollStack
              events={visibleMobileEvents}
              pageIndex={mobilePageIndex}
              onPageEnd={goNextMobilePage}
            />
          </motion.div>
        </AnimatePresence>

        {/* Page indicator pills */}
        {mobileNumPages > 1 && (
          <div className="flex justify-center gap-3 mt-8 pb-6">
            <div className="flex gap-3 p-3 rounded-full bg-black/5 backdrop-blur-md border border-black/10">
              {Array.from({ length: mobileNumPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMobilePageIndex(i);
                    const section = document.getElementById('events');
                    if (section)
                      window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
                  }}
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${i === mobilePageIndex
                      ? 'bg-[#4285F4] w-10'
                      : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
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