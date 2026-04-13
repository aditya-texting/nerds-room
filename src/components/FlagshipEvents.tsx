import { useEffect, useRef, useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';
import { MapPin } from 'lucide-react';

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
    if (!isActive) return;

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

const FlagshipEvents = () => {
  const {
    flagshipEvents: contextEvents,
    totalRegs,
    totalApprovedRegs,
    hackathons,
    pastEvents,
    maintenanceMode,
    loading,
    navigate
  } = useAppData();

  const bgColors = ['bg-[#E8F5E9]', 'bg-[#FCE4EC]', 'bg-[#ECEFF1]', 'bg-[#FFF3E0]', 'bg-[#F3E5F5]'];
  const zIndices = ['z-10', 'z-20', 'z-30', 'z-40', 'z-50'];

  const events: (EventData & { registration_link?: string })[] = useMemo(() => {
    const totalHackathons = hackathons.length + pastEvents.filter(e => e.event_type?.toLowerCase().includes('hackathon')).length;

    return contextEvents
      .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
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
          zIndex: zIndices[i % zIndices.length],
          location: ce.location || "TBA",
          registration_link: ce.registration_link
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs, hackathons, pastEvents]);

  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsActive(true);
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

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
    <section ref={sectionRef} id="events" className="py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black mb-4 tracking-tighter uppercase">
            Our <span className="text-nerdBlue">Flagship</span> Events
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-bold uppercase tracking-widest">
            Our signature experiences that define excellence
          </p>
        </div>

        <div className="relative">
          {maintenanceMode && (
            <div className="absolute inset-0 z-[50] bg-white/95 backdrop-blur-md flex items-center justify-center p-6 text-center rounded-[40px]">
              <div className="max-w-md">
                <div className="text-6xl mb-6">🛠️</div>
                <h1 className="text-4xl font-black text-nerdBlue mb-4 tracking-tight">EVENTS UNAVAILABLE</h1>
                <p className="text-gray-600 font-bold mb-8">Scheduling maintenance in progress. Check back soon!</p>
              </div>
            </div>
          )}

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`group relative rounded-[2.5rem] p-6 md:p-8 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${event.bgColor} border border-black/5`}
                >
                  {/* Event Title/Logo Section */}
                  <div className="flex flex-col items-center text-center mb-8">
                    {event.logo ? (
                      <img src={event.logo} alt={event.title} className="h-12 md:h-16 object-contain mb-4" />
                    ) : (
                      <span className="text-2xl md:text-3xl font-black text-black leading-tight mb-2">
                        {event.title}
                      </span>
                    )}
                  </div>

                  {/* Main Image Container */}
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl mb-8 group-hover:scale-[1.02] transition-transform duration-700">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                      loading="lazy"
                    />
                    
                    {/* Floating Stats - Inspired by GDG Noida */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-center items-end gap-3 md:gap-4 pointer-events-none">
                      {event.stats.map((stat, sIndex) => {
                        const num = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
                        const suffix = stat.value.replace(/[\d,]/g, '');
                        
                        return (
                          <div 
                            key={sIndex} 
                            className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl px-4 py-2 md:px-6 md:py-3 flex items-center gap-3 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                            style={{ 
                              animationDelay: `${index * 100 + sIndex * 150}ms`,
                              animation: isActive ? 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                              opacity: 0,
                              transform: 'translateX(20px)'
                            }}
                          >
                            <span className="text-2xl md:text-3xl font-black text-[#34A853]">
                              <StatCounter target={isNaN(num) ? 0 : num} suffix={suffix} isActive={isActive} />
                            </span>
                            <span className="text-xs md:text-sm font-black text-gray-800 uppercase tracking-tighter">
                              {stat.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-center gap-2 text-gray-700 font-bold uppercase tracking-wider text-xs md:text-sm">
                      <MapPin size={16} className="text-nerdBlue" />
                      <span>{event.location}</span>
                    </div>

                    {event.registration_link && (
                      <a
                        href={event.registration_link}
                        target={event.registration_link.startsWith('http') ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-black text-white text-xs md:text-sm font-black py-4 md:py-5 rounded-2xl hover:bg-nerdBlue transition-all uppercase tracking-[0.2em] shadow-xl hover:shadow-nerdBlue/20 active:scale-[0.98]"
                        onClick={(e) => {
                          if (event.registration_link && !event.registration_link.startsWith('http')) {
                            e.preventDefault();
                            navigate(event.registration_link);
                          }
                        }}
                      >
                        EXPLORE EVENT
                      </a>
                    )}
                  </div>
                </div>
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
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default FlagshipEvents;