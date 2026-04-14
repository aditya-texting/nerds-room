// v1.2 - Staggered Layout & Refined Badge Positioning
import { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin, Users, UserCheck, Mic2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

const Card = ({ event, index }: { event: EventData, index: number }) => {
  // Map stats to specific icons for the badges
  const getStatIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('registration')) return <Users size={16} className="text-[#10b981]" />;
    if (l.includes('attendee')) return <UserCheck size={16} className="text-[#10b981]" />;
    if (l.includes('speaker')) return <Mic2 size={16} className="text-[#10b981]" />;
    return null;
  };

  // Stagger effect: every 2nd card (odd index) is lower
  const isLower = index % 2 !== 0;

  return (
    <div 
      className={`flex flex-col items-center ${event.bgColor} rounded-[2.5rem] p-6 md:p-8 min-w-[320px] md:min-w-[380px] shadow-lg transition-transform duration-300 hover:scale-[1.02] ${isLower ? 'mt-12' : 'mb-12'}`}
    >
      {/* Card Header: Logo and Title */}
      <div className="mb-6 text-center w-full min-h-[80px] flex flex-col justify-center">
        {event.logo ? (
          <img src={event.logo} alt={event.title} className="h-10 md:h-12 object-contain mx-auto mb-2" />
        ) : (
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{event.title}</h3>
        )}
        <span className="block text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-gray-500/80">
          Where Data and Gen AI Collide...
        </span>
      </div>

      {/* Image & Badges Container */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden group aspect-[1.1/1]">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Floating Badge Stack - Right Aligned Vertical Stack */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-3">
          {event.stats.map((stat: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/95 backdrop-blur-md px-3 md:px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 min-w-[140px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-bold text-[#10b981]">
                    {stat.value}
                </span>
                <span className="text-[11px] md:text-xs font-semibold text-gray-600">
                    {stat.label}
                </span>
              </div>
              {getStatIcon(stat.label)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Card Footer: Location */}
      <div className="mt-8 flex items-center gap-2 text-gray-600">
        <MapPin size={18} className="text-nerdBlue" />
        <p className="text-sm md:text-base font-bold">
          {event.location}
        </p>
      </div>
    </div>
  );
};

const FlagshipEvents = () => {
  const {
    flagshipEvents: contextEvents,
    totalRegs,
    totalApprovedRegs,
    maintenanceMode,
    loading
  } = useAppData();

  const [isPaused, setIsPaused] = useState(false);

  const events = useMemo(() => {
    return contextEvents
      .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
        const bgColors = ['bg-[#e6f4ea]', 'bg-[#fce8f1]', 'bg-[#e8f0fe]', 'bg-[#fff9c4]'];
        const dynamicStats = (ce.stats || []).map((s: any) => {
          const label = (s.label || '').toLowerCase();
          const rawVal = String(s.value || '').trim();
          const numVal = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          const isEmpty = !rawVal || rawVal === '0' || isNaN(numVal);

          if (isEmpty) {
            if (label.includes('registration')) return { ...s, value: `${totalRegs}+` };
            if (label.includes('attendee')) return { ...s, value: `${totalApprovedRegs || 350}+` };
            if (label.includes('speaker')) return { ...s, value: `50+` };
          }
          return s;
        });

        // Match the 2-stat look in the second screenshot or 3-stat
        if (dynamicStats.length < 2) {
            if (!dynamicStats.find((s: any) => s.label.toLowerCase().includes('attendee'))) 
                dynamicStats.push({ label: 'Attendees', value: `${totalApprovedRegs || 291}+` });
            if (!dynamicStats.find((s: any) => s.label.toLowerCase().includes('speaker'))) 
                dynamicStats.push({ label: 'Speakers', value: '5+' });
        }

        return {
          ...ce,
          stats: dynamicStats.slice(0, 2), // The screenshots show 2 badges usually
          bgColor: bgColors[i % bgColors.length],
          location: ce.location || "Noida, India",
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs]);

  // Double the events for seamless marquee
  const marqueeEvents = useMemo(() => [...events, ...events], [events]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12 rounded-xl" />
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="min-w-[380px] h-[580px] rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="relative py-24 bg-[#FCFCFD] overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative inline-block"
        >
          <h2 className="text-5xl md:text-7xl font-black text-[#1a237e] tracking-tight mb-4">
            Our Flagship Events
          </h2>
          <div className="absolute -inset-x-8 -inset-y-4 bg-nerdBlue/5 blur-3xl -z-10 rounded-full" />
        </motion.div>
      </div>

      {/* Slider Container */}
      <div 
        className="relative w-full py-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {maintenanceMode && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md">
                    <span className="text-5xl mb-4 block animate-bounce">📅</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Experiences</h3>
                    <p className="text-gray-500 font-medium">We're refreshing our event calendar. Stay tuned!</p>
                </div>
          </div>
        )}

        {/* Marquee Track */}
        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-12 px-6"
            animate={{
              x: isPaused ? undefined : [0, -50 + "%"]
            }}
            transition={{
              duration: Math.max(20, events.length * 8),
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ width: "max-content", display: "flex" }}
          >
            {marqueeEvents.map((event, index) => (
              <Card key={index} index={index} event={event} />
            ))}
          </motion.div>
        </div>

        {/* Edge Shadows */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#FCFCFD] via-[#FCFCFD]/50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#FCFCFD] via-[#FCFCFD]/50 to-transparent z-10" />
      </div>

      {/* Pagination Indicators (Visual only as per screenshot) */}
      <div className="flex justify-center items-center gap-3 mt-12">
        <div className="w-3 h-3 rounded-full bg-gray-200" />
        <div className="w-3 h-3 rounded-full bg-gray-200" />
        <div className="w-8 h-3 rounded-full bg-[#10b981]" />
        <div className="w-3 h-3 rounded-full bg-gray-200" />
      </div>
    </section>
  );
};

export default FlagshipEvents;