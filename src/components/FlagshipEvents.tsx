// v1.1 - Updated Flagship Events with Automatic Slider
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

const Card = ({ event }: { event: EventData }) => {
  // Map stats to specific icons for the badges
  const getStatIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('registration')) return <Users size={16} className="text-[#10b981]" />;
    if (l.includes('attendee')) return <UserCheck size={16} className="text-[#10b981]" />;
    if (l.includes('speaker')) return <Mic2 size={16} className="text-[#10b981]" />;
    return null;
  };

  return (
    <div 
      className={`flex flex-col items-center ${event.bgColor} rounded-[2.5rem] p-6 md:p-8 min-w-[320px] md:min-w-[400px] shadow-sm transition-transform duration-300 hover:scale-[1.02]`}
    >
      {/* Card Header: Logo and Title */}
      <div className="mb-6 text-center w-full">
        {event.logo ? (
          <img src={event.logo} alt={event.title} className="h-10 md:h-12 object-contain mx-auto mb-2" />
        ) : (
          <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        )}
        <span className="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
          {event.title} {new Date().getFullYear()}
        </span>
      </div>

      {/* Image & Badges Container */}
      <div className="relative w-full rounded-[2rem] overflow-hidden group aspect-[4/3]">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Floating Badge Stack - Matches GDG Noida Style */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          {event.stats.map((stat: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-white/20"
            >
              <span className="text-lg md:text-xl font-bold text-[#10b981]">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-semibold text-gray-900 whitespace-nowrap">
                {stat.label}
              </span>
              {getStatIcon(stat.label)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Card Footer: Location */}
      <div className="mt-6 flex items-center gap-2 text-gray-500">
        <MapPin size={16} className="text-nerdBlue" />
        <p className="text-xs md:text-sm font-semibold truncate max-w-[250px]">
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
    hackathons,
    pastEvents,
    maintenanceMode,
    loading
  } = useAppData();

  const [isPaused, setIsPaused] = useState(false);
 
   const events = useMemo(() => {
     return contextEvents
       .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
        const bgColors = ['bg-[#E8F5E9]', 'bg-[#FCE4EC]', 'bg-[#E3F2FD]', 'bg-[#FFF9C4]'];
        const dynamicStats = (ce.stats || []).map((s: any) => {
          const label = (s.label || '').toLowerCase();
          const rawVal = String(s.value || '').trim();
          const numVal = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          const isEmpty = !rawVal || rawVal === '0' || isNaN(numVal);

          if (isEmpty) {
            if (label.includes('registration')) return { ...s, value: `${totalRegs}+` };
            if (label.includes('attendee')) return { ...s, value: `${totalApprovedRegs || Math.floor(totalRegs * 0.8)}+` };
            if (label.includes('speaker')) return { ...s, value: `30+` };
          }
          return s;
        });

        // Ensure we have at least 3 stats to match the style
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
  }, [contextEvents, totalRegs, totalApprovedRegs, hackathons, pastEvents]);

  // Double the events for seamless marquee
  const marqueeEvents = useMemo(() => [...events, ...events], [events]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12 rounded-xl" />
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="min-w-[400px] h-[500px] rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="relative py-24 bg-[#FCFCFD] overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
            Our <span className="text-nerdBlue relative">
              Flagship
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-nerdBlue/10 -z-10 rounded-full" />
            </span> Events
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Our signature experiences that define excellence
          </p>
        </motion.div>
      </div>

      {/* Marquee Slider Container */}
      <div className="relative w-full">
        {maintenanceMode && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md">
                    <span className="text-5xl mb-4 block animate-pulse">🛠️</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Scheduling Events</h3>
                    <p className="text-gray-500">We're updating our event lineup. Check back in a few minutes!</p>
                </div>
          </div>
        )}

        {/* The Slider Track */}
        <div 
          className="flex overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div 
            className="flex gap-8 px-4"
            animate={{
              x: isPaused ? undefined : [0, -50 + "%"]
            }}
            transition={{
              duration: events.length * 10, // Adjust speed based on number of items
              ease: "linear",
              repeat: Infinity,
            }}
            style={{
                width: "max-content",
                display: "flex"
            }}
          >
            {marqueeEvents.map((event, index) => (
              <Card key={index} event={event} />
            ))}
          </motion.div>
        </div>
        
        {/* Gradient Overlays for smooth edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FCFCFD] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FCFCFD] to-transparent z-10" />
      </div>
    </section>
  );
};

export default FlagshipEvents;