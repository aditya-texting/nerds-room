import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setDisplayValue(target); clearInterval(timer); }
      else setDisplayValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, isInView]);

  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
};

// ─── Shared card content ──────────────────────────────────────────────────────
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
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
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

// ─── Event card ─────────────────────────────────────────────────────────────
const EventCard = ({ event, index, isMobileView }: { event: EventData; index: number, isMobileView: boolean }) => {
  const isLower = index % 2 !== 0 && !isMobileView;
  return (
    <div className="flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
        className={`rounded-[20px] shadow-xl border border-[#0000001a] flex flex-col items-center
          w-[320px] sm:w-[360px] md:max-w-[320px] lg:max-w-[372px]
          h-[420px] sm:h-[450px] md:h-[430px] lg:h-[493px]
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 1024;
  const cardsPerPage = isMobileView ? 1 : 3;

  // ── Build events list ──────────────────────────────────────────────────────
  const events = useMemo(() => {
    return contextEvents
      .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
        const bgColors = ['bg-[#e8f5e9]', 'bg-[#fce4ec]', 'bg-[#eceff1]', 'bg-[#fff9c4]'];
        const dynamicStats = (ce.stats || []).map((s: any) => {
          const label   = (s.label || '').toLowerCase();
          const rawVal  = String(s.value || '').trim();
          const numVal  = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          const isEmpty = !rawVal || rawVal === '0' || isNaN(numVal);
          if (isEmpty) {
            if (label.includes('registration')) return { ...s, value: `${totalRegs}+` };
            if (label.includes('attendee'))     return { ...s, value: `${totalApprovedRegs || 350}+` };
            if (label.includes('speaker'))      return { ...s, value: '30+' };
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
          stats:    dynamicStats.slice(0, 3),
          bgColor:  bgColors[i % bgColors.length],
          location: ce.location || 'Noida, India',
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs]);

  // ── Auto-carousel ──────────────────────────────────────────────────
  const numPages = Math.ceil(events.length / cardsPerPage);

  useEffect(() => {
    if (events.length <= cardsPerPage) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % numPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [events.length, numPages, cardsPerPage]);

  const visibleEvents = useMemo(() => {
    if (!events.length) return [];
    if (events.length <= cardsPerPage) return events;
    const start = activeIndex * cardsPerPage;
    let sliced  = events.slice(start, start + cardsPerPage);
    if (sliced.length < cardsPerPage) sliced = [...sliced, ...events.slice(0, cardsPerPage - sliced.length)];
    return sliced;
  }, [events, activeIndex, cardsPerPage]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="flex gap-8 overflow-hidden justify-center">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="w-[372px] h-[493px] rounded-[20px]" />)}
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
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base md:text-2xl text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>
      </div>

      <div className="relative w-full flex justify-center min-h-[450px] md:min-h-[583px]">
        <div className="flex flex-row items-start justify-center gap-6 md:gap-[80px] lg:gap-[120px] w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="flex flex-row gap-6 md:gap-[80px] lg:gap-[120px] w-full justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              {visibleEvents.map((event, index) => (
                <EventCard key={`${activeIndex}-${event.id || index}`} index={index} event={event} isMobileView={isMobileView} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {events.length > cardsPerPage && (
        <div className="flex justify-center gap-3 mt-8 md:mt-12 lg:mt-16">
          {Array.from({ length: numPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                i === activeIndex ? 'w-12 h-3' : 'w-3 h-3 bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i === activeIndex && (
                <motion.div
                  className="absolute inset-0 bg-nerdBlue"
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
  );
};

export default FlagshipEvents;
