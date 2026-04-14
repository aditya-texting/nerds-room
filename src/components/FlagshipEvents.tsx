// v1.3 - Precise Sizing from gdg.html
import { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
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
  // Stagger effect from gdg.html: middle card is lower
  // HTML uses mt-[39px] for card1/3 and mt-[90px] for card2
  const isLower = index % 2 !== 0;

  return (
    <div 
      className={`rounded-[20px] shadow-xl flex flex-col items-center w-full max-w-[280px] md:max-w-[320px] lg:max-w-[372px] h-[380px] md:h-[430px] lg:h-[493px] mx-auto lg:mx-0 ${event.bgColor} transition-transform duration-300 hover:scale-[1.02] ${isLower ? 'lg:mt-[90px]' : 'lg:mt-[39px]'}`}
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
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Floating Stats - Precisely aligned to gdg.html */}
        <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-3 left-[30%] md:left-[32%] lg:left-[35%] space-y-1.5 md:space-y-2 lg:space-y-2.5">
          {event.stats.map((stat: any, sIndex: number) => (
            <motion.div
              key={sIndex}
              className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * sIndex }}
            >
              <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                {stat.value}
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

  // Double the events for seamless marquee
  const marqueeEvents = useMemo(() => [...events, ...events], [events]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="min-w-[320px] h-[430px] rounded-[20px]" />
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

      <div 
        className="relative w-full overflow-visible"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {maintenanceMode && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-[20px] shadow-2xl border border-gray-100 max-w-md">
                    <span className="text-5xl mb-4 block animate-bounce">📅</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Experiences</h3>
                    <p className="text-gray-500 font-medium">We're refreshing our event calendar. Stay tuned!</p>
                </div>
          </div>
        )}

        <div className="flex overflow-hidden">
          <motion.div 
            className="flex gap-20 lg:gap-[120px] px-4"
            animate={{
              x: isPaused ? undefined : [0, -50 + "%"]
            }}
            transition={{
              duration: Math.max(25, events.length * 10),
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
      </div>

      {/* Pagination View */}
      <div className="flex justify-center gap-3 mt-12 lg:mt-16">
          <div className="w-12 h-3 rounded-full bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-nerdBlue/20" />
          </div>
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
      </div>
    </section>
  );
};

export default FlagshipEvents;