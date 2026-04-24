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
    <div className="mt-5 mb-4 flex items-center justify-center w-full px-6">
      {event.logo ? (
        <div className="relative w-full h-[45px]">
          <img src={event.logo} alt={event.title} className="object-contain w-full h-full" />
        </div>
      ) : (
        <span className="text-xl font-black text-black leading-tight text-center">
          {event.title}
        </span>
      )}
    </div>

    <div className="relative w-[240px] h-[230px] shrink-0">
      <div className="relative w-full h-full rounded-[16px] overflow-hidden shadow-md border border-[#00000012]">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-3 left-4 space-y-2 max-w-[90%]">
        {event.stats.map((stat, sIndex) => (
          <div
            key={sIndex}
            className="bg-white rounded-[12px] px-3 py-1.5 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#00000008] w-fit"
          >
            <span className="text-[18px] font-medium text-[#34A853]">
              <CountUp value={stat.value} />
            </span>
            <span className="text-[13px] font-normal text-black whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-center gap-1.5 text-black mt-auto pt-2 pb-5 px-4">
      <MapPin className="w-4 h-4 shrink-0 opacity-80" />
      <span className="text-[13px] font-semibold text-center leading-tight tracking-tight">
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
// KEY RULE: Any ancestor with overflow:hidden or overflow-x:hidden will break
// position:sticky. We use clipPath on the section instead for horizontal clipping.

const CARD_H = 400;  // card height px
const PEEK = 16;   // px each card peeks below the stack

const MobileScrollStack = ({
  events,
  onPageEnd,
  pageIndex,
}: {
  events: EventData[];
  onPageEnd: () => void;
  pageIndex: number;
}) => {
  const [active, setActive] = useState(0);
  const notified = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(0);
    notified.current = false;
  }, [pageIndex]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const sentinels = Array.from(
      wrapRef.current.querySelectorAll<HTMLElement>('.sentinel')
    );
    if (!sentinels.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
            if (idx === events.length - 1 && !notified.current) {
              notified.current = true;
              setTimeout(onPageEnd, 2000);
            }
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sentinels.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [events, onPageEnd]);

  const totalH = CARD_H * events.length;

  return (
    // This div provides the scroll height — must NOT have overflow:hidden
    <div ref={wrapRef} className="relative w-full" style={{ height: totalH }}>

      {/* Sticky frame — stays in viewport */}
      <div
        className="sticky flex justify-center"
        style={{ top: 72, height: CARD_H + PEEK * (events.length - 1) }}
      >
        <div className="relative w-full max-w-[320px]" style={{ height: CARD_H }}>
          {events.map((event, i) => {
            const behind = i < active;
            const isCurrent = i === active;

            const scale = isCurrent ? 1 : behind ? Math.max(0.88, 1 - (active - i) * 0.04) : 1;
            const yOff = isCurrent ? 0 : behind ? 0 : (i - active) * PEEK;
            const opacity = isCurrent ? 1 : behind ? Math.max(0.3, 1 - (active - i) * 0.3) : 1;
            const blur = behind ? Math.min((active - i) * 3, 8) : 0;
            const zIdx = isCurrent ? 50 : behind ? 50 - (active - i) : 40 + i;

            return (
              <motion.div
                key={event.id ?? i}
                animate={{
                  scale,
                  y: yOff,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-x-0 top-0"
                style={{ zIndex: zIdx, height: CARD_H, willChange: 'transform, opacity' }}
              >
                <div
                  className={`w-full h-full flex flex-col items-center rounded-[28px]
                    shadow-[0_16px_48px_rgba(0,0,0,0.14)] border border-[#0000001a] ${event.bgColor}`}
                >
                  <CardInner event={event} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Invisible sentinels — trigger active card change on scroll */}
      {events.map((_, i) => (
        <div
          key={i}
          className="sentinel absolute w-full pointer-events-none"
          data-idx={i}
          style={{ top: i * CARD_H, height: 1 }}
        />
      ))}
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
    const fn = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const isMobileView = windowWidth < 1024;

  const events: EventData[] = useMemo(() => {
    if (!contextEvents) return [];
    return contextEvents.map((e: any) => ({ ...e, bgColor: e.bgColor || 'bg-white' }));
  }, [contextEvents]);

  // ── Mobile paging ──────────────────────────────────────────────────────────
  const CARDS_PER_PAGE = 3;
  const mobilePages = Math.ceil(events.length / CARDS_PER_PAGE);
  const [mobilePage, setMobilePage] = useState(0);

  const mobileEvents = useMemo(() => {
    const s = mobilePage * CARDS_PER_PAGE;
    return events.slice(s, s + CARDS_PER_PAGE);
  }, [events, mobilePage]);

  const goToMobilePage = (idx: number) => {
    setMobilePage(idx);
    requestAnimationFrame(() => {
      const el = document.getElementById('flagship-events-mobile');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const advanceMobilePage = () => goToMobilePage((mobilePage + 1) % mobilePages);

  // ── Desktop carousel ───────────────────────────────────────────────────────
  const DESK_PER_PAGE = 3;
  const desktopPages = Math.ceil(events.length / DESK_PER_PAGE);
  const [deskPage, setDeskPage] = useState(0);

  useEffect(() => {
    if (isMobileView || events.length <= DESK_PER_PAGE) return;
    const t = setInterval(() => setDeskPage((p) => (p + 1) % desktopPages), 5000);
    return () => clearInterval(t);
  }, [isMobileView, events.length, desktopPages]);

  const deskEvents = useMemo(() => {
    const s = deskPage * DESK_PER_PAGE;
    return events.slice(s, s + DESK_PER_PAGE);
  }, [events, deskPage]);

  if (loading) return <Skeleton />;
  if (!events.length) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          MOBILE  (< lg)
          • NO overflow:hidden on this section or any parent!
          • clipPath used for horizontal clipping instead.
          • position:sticky inside MobileScrollStack needs a
            scrollable ancestor — the page body is the scroller.
      ════════════════════════════════════════════════════════ */}
      <section
        id="flagship-events-mobile"
        className="block lg:hidden relative bg-white py-12 px-4"
        style={{ clipPath: 'inset(0 0 0 0)' }}   /* clips overflow without breaking sticky */
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mobilePage}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <MobileScrollStack
              events={mobileEvents}
              pageIndex={mobilePage}
              onPageEnd={advanceMobilePage}
            />
          </motion.div>
        </AnimatePresence>

        {mobilePages > 1 && (
          <div className="flex justify-center gap-3 mt-8 pb-4">
            <div className="flex gap-3 p-3 rounded-full bg-black/5 border border-black/10">
              {Array.from({ length: mobilePages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToMobilePage(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${i === mobilePage
                      ? 'bg-[#4285F4] w-10'
                      : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════
          DESKTOP  (lg+)
      ════════════════════════════════════════════════════════ */}
      <section
        id="flagship-events"
        className="hidden lg:block relative py-20 px-8 lg:px-16 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h2 className="text-5xl lg:text-6xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-2xl text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>

        <div className="relative w-full flex justify-center min-h-[583px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={deskPage}
              className="flex flex-row gap-[80px] lg:gap-[120px] w-full justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              {deskEvents.map((event, index) => (
                <DesktopEventCard
                  key={`${deskPage}-${event.id ?? index}`}
                  event={event}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {events.length > DESK_PER_PAGE && (
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: desktopPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setDeskPage(i)}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ${i === deskPage ? 'w-12 h-3' : 'w-3 h-3 bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                {i === deskPage && (
                  <motion.div
                    key={deskPage}
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
      </section>
    </>
  );
};

export default FlagshipEvents;