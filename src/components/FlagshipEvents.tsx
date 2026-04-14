// v1.4 - Discrete Auto-Slider with Counting Animations & Card Borders
import { useState, useMemo, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventData {
  title: string;
  logo?: string;
  image: string;
  stats: {
    label: string;
    value: string;
  }[];
  description: string;
  location: string;
  bgColor: string;
}

const CountUp = ({ value }: { value: string }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        let start = 0;
        const duration = 2000; // 2 seconds
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
    }, [target]);

    return <span>{displayValue.toLocaleString()}{suffix}</span>;
};

const Card = ({ event, index }: { event: EventData, index: number }) => {
  const isLower = index % 2 !== 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-[20px] shadow-xl border border-black/5 flex flex-col items-center w-full max-w-[280px] md:max-w-[320px] lg:max-w-[372px] h-[380px] md:h-[430px] lg:h-[493px] mx-auto lg:mx-0 ${event.bgColor} transition-transform duration-300 hover:scale-[1.02] ${isLower ? 'lg:mt-[90px]' : 'lg:mt-[39px]'}`}
    >
      {/* Event Title/Logo Section */}
      <div className="mt-4 md:mt-5 lg:mt-6 mb-3 md:mb-3.5 lg:mb-4 flex items-center justify-center w-full px-4 md:px-5 lg:px-6">
        {event.logo ? (
          <div className="relative w-full h-[45px] md:h-[50px] lg:h-[60px]">
             <img src={event.logo} alt={event.title} className="object-contain w-full h-full" />
          </div>
        ) : (
          <span className="text-2xl md:text-3xl font-black text-black leading-tight">
            {event.title}
          </span>
        )}
      </div>

      {/* Main Image Container */}
      <div className="relative w-[250px] md:w-[290px] lg:w-[334px] h-[260px] md:h-[295px] lg:h-[347px] shrink-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-black/5">
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-3 left-[30%] md:left-[32%] lg:left-[35%] space-y-1.5 md:space-y-2 lg:space-y-2.5">
          {event.stats.map((stat: any, sIndex: number) => (
            <motion.div
              key={sIndex}
              className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-black/5 w-fit"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * sIndex }}
            >
              <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                <CountUp value={stat.value} />
              </span>
              <span className="text-[16px] md:text-[19px] lg:text-[22px] font-normal text-black truncate">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-center gap-1.5 md:gap-2 text-black mt-auto pt-1.5 md:pt-2 pb-4 md:pb-5 lg:pb-6 px-4">
        <MapPin size={20} className="shrink-0 text-nerdBlue" />
        <span className="text-[14px] md:text-[17px] lg:text-[20px] font-medium text-center leading-tight">
          {event.location}
        </span>
      </div>
    </motion.div>
  );
};

const FlagshipEvents = () => {
  const {
    flagshipEvents: contextEvents,
    totalRegs,
    totalApprovedRegs,
    loading
  } = useAppData();

  const [activeIndex, setActiveIndex] = useState(0);

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
            if (label.includes('speaker')) return { ...s, value: `30+` };
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
          location: ce.location || "Noida, India",
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs]);

  // Discrete Auto-Slider Logic
  useEffect(() => {
    if (events.length <= 3) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.ceil(events.length / 3));
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [events.length]);

  const visibleEvents = useMemo(() => {
    if (events.length <= 3) return events;
    const start = activeIndex * 3;
    return events.slice(start, start + 3);
  }, [events, activeIndex]);

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
    <section id="events" className="relative py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
              Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base md:text-2xl text-gray-600 mt-3">Our signature experiences that define excellence</p>
        </div>
      </div>

      <div className="relative w-full flex justify-center min-h-[583px]">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-[120px] w-full max-w-7xl">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeIndex}
                    className="flex flex-col lg:flex-row gap-12 lg:gap-[120px] w-full justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    {visibleEvents.map((event, index) => (
                        <Card key={`${activeIndex}-${index}`} index={index} event={event} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots with active indicator */}
      {events.length > 3 && (
        <div className="flex justify-center gap-3 mt-12 lg:mt-16">
            {Array.from({ length: Math.ceil(events.length / 3) }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative rounded-full overflow-hidden transition-all duration-300 ${i === activeIndex ? 'w-12 h-3' : 'w-3 h-3 bg-gray-300'}`}
                >
                    {i === activeIndex && (
                        <motion.div 
                            className="absolute inset-0 bg-nerdBlue"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5, ease: "linear" }}
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