import { useEffect, useRef, useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  zIndex: string;
}

const StatCounter = ({ target, suffix, isActive }: { target: number, suffix: string, isActive: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCount(0);
      return;
    }

    let startTime: number;
    const duration = 2000;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(startValue + (target - startValue) * easeOutExpo);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, isActive]);

  return (
    <span className="flex items-center">
      {count.toLocaleString()}
      <span className="ml-0.5">{suffix}</span>
    </span>
  );
};

const Card = ({ event, index, total, scrollYProgress }: { event: any, index: number, total: number, scrollYProgress: any }) => {
  // Use a unique range for each card to trigger its individual reveal
  const start = index / total;
  const end = (index + 1) / total;
  
  // Stacking effect: earlier cards scale down as later cards come in
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [start, end], [1, 0.9]);
  
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      id={`flagship-card-${index}`}
      style={{
        scale: index === total - 1 ? 1 : scale,
        opacity: index === total - 1 ? 1 : opacity,
        zIndex: (index + 1) * 10,
        top: `calc(15vh + ${index * 20}px)`
      }}
      className={`rounded-[20px] shadow-2xl flex flex-col items-center w-full max-w-[280px] md:max-w-[320px] lg:max-w-[372px] h-[380px] md:h-[430px] lg:h-[493px] mx-auto lg:mx-0 ${event.bgColor} sticky overflow-hidden mb-[15vh] lg:mb-0`}
      whileInView={{ y: [50, 0], opacity: [0, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      onViewportEnter={() => setIsInView(true)}
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
      <div className="relative w-[250px] md:w-[290px] lg:w-[334px] h-[260px] md:h-[295px] lg:h-[347px] shrink-0 pointer-events-none">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Floating Stats */}
        <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-3 left-[30%] md:left-[32%] lg:left-[35%] space-y-1.5 md:space-y-2 lg:space-y-2.5">
          {event.stats.map((stat: any, sIndex: number) => {
            const num = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
            const suffix = stat.value.replace(/[\d,]/g, '');
            
            return (
              <motion.div 
                key={sIndex} 
                className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit"
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ 
                  delay: (sIndex * 0.1) + 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                  <StatCounter target={isNaN(num) ? 0 : num} suffix={suffix} isActive={isInView} />
                </span>
                <span className="text-[16px] md:text-[19px] lg:text-[22px] font-normal text-black truncate">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-center gap-1.5 md:gap-2 text-black mt-auto pt-1.5 md:pt-2 pb-4 md:pb-5 lg:pb-6 px-4">
        <MapPin size={16} className="shrink-0" />
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
    hackathons,
    pastEvents,
    maintenanceMode,
    loading
  } = useAppData();

  const sectionRef = useRef<HTMLElement>(null);
  
  // Hook scroll to the container for the stacking effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const events: (EventData & { registration_link?: string })[] = useMemo(() => {
    const totalHackathons = hackathons.length + pastEvents.filter(e => e.event_type?.toLowerCase().includes('hackathon')).length;
    return contextEvents
      .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
        const bgColors = ['bg-[#E8F5E9]', 'bg-[#FCE4EC]', 'bg-[#ECEFF1]'];
        const dynamicStats = (ce.stats || []).map((s: any) => {
          const label = (s.label || '').toLowerCase();
          const rawVal = String(s.value || '').trim();
          const numVal = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          const isEmpty = !rawVal || rawVal === '0' || isNaN(numVal);

          if (isEmpty) {
            if (label.includes('registration')) return { ...s, value: `${totalRegs}+` };
            if (label.includes('attendee')) return { ...s, value: `${totalApprovedRegs || Math.floor(totalRegs * 0.8)}+` };
            if (label.includes('hackathon')) return { ...s, value: `${totalHackathons}+` };
          }
          return s;
        });

        return {
          ...ce,
          stats: dynamicStats,
          bgColor: bgColors[i % bgColors.length],
          location: ce.location || "TBA",
          registration_link: ce.registration_link
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs, hackathons, pastEvents]);

  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full h-[550px] rounded-[40px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="events" className="relative py-20 px-4 md:px-8 lg:px-16 bg-white overflow-visible">
      <div className="max-w-[1400px] mx-auto mb-16 lg:mb-24">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl text-black tracking-tight font-black"
          >
            OUR <span className="text-nerdBlue">FLAGSHIP</span> EVENTS
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-gray-500 mt-4 max-w-2xl mx-auto font-medium"
          >
            Pioneering digital excellence through our signature community initiatives.
          </motion.p>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto">
        {maintenanceMode && (
          <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 text-center rounded-[40px]">
            <div className="max-w-md">
              <div className="text-6xl mb-6 animate-bounce">🛠️</div>
              <h1 className="text-4xl font-black text-nerdBlue mb-4 tracking-tight">EVENTS UNAVAILABLE</h1>
              <p className="text-gray-600 font-bold mb-8">Scheduling maintenance in progress. Check back soon!</p>
            </div>
          </div>
        )}

        {events.length > 0 ? (
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-[40px] xl:gap-[60px]">
            {events.map((event, index) => (
              <Card 
                key={index} 
                event={event} 
                index={index} 
                total={events.length} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4 text-gray-300">📅</div>
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Flagship Events Yet</h3>
            <p className="text-gray-400 text-sm mt-2">Our team is busy planning the next big thing. Stay tuned!</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8 lg:mt-24">
        {events.map((_, index) => (
          <button
            key={index}
            className={`relative h-2 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-16 bg-nerdBlue/20' : 'w-4 bg-gray-100 hover:bg-gray-200'}`}
            aria-label={`Go to event ${index + 1}`}
            onClick={() => {
              setCurrentIndex(index);
              const element = document.getElementById(`flagship-card-${index}`);
              if (element) {
                const offset = window.innerHeight * 0.1;
                window.scrollTo({
                  top: element.offsetTop - offset,
                  behavior: 'smooth'
                });
              }
            }}
          >
            <motion.div
              layoutId="active-dot"
              className={`absolute inset-0 bg-nerdBlue rounded-full origin-left ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default FlagshipEvents;