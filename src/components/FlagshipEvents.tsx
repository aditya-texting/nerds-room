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
    loading
  } = useAppData();

  const bgColors = ['bg-[#E8F5E9]', 'bg-[#FCE4EC]', 'bg-[#ECEFF1]'];
  const mtMobiles = ['mt-0', 'mt-[25vh]', 'mt-[25vh]'];
  const mtDesktops = ['lg:mt-[39px]', 'lg:mt-[90px]', 'lg:mt-[39px]'];
  const zIndices = ['z-10', 'z-20', 'z-30'];

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
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <section ref={sectionRef} id="events" className="py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden transition-all duration-700">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base md:text-2xl text-gray-600 mt-3">
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
            <div className="block lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-[120px] pb-12 lg:pb-0">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`rounded-[20px] shadow-xl flex flex-col items-center w-full max-w-[280px] md:max-w-[320px] lg:max-w-[372px] h-[380px] md:h-[430px] lg:h-[493px] mx-auto lg:mx-0 ${event.bgColor} ${index > 0 ? 'mt-[25vh] lg:mt-[90px]' : 'mt-0 lg:mt-[39px]'} lg:z-auto ${zIndices[index % zIndices.length]} sticky top-[20vh] lg:static transition-all duration-500`}
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
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Floating Stats - GDG Style with dynamic positioning */}
                    <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-3 left-[30%] md:left-[32%] lg:left-[35%] space-y-1.5 md:space-y-2 lg:space-y-2.5 pointer-events-none">
                      {event.stats.map((stat, sIndex) => {
                        const num = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
                        const suffix = stat.value.replace(/[\d,]/g, '');
                        
                        return (
                          <div 
                            key={sIndex} 
                            className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit"
                            style={{ 
                              animationDelay: `${index * 100 + sIndex * 150}ms`,
                              animation: isActive ? 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                              opacity: 0,
                              transform: 'translateX(40px)'
                            }}
                          >
                            <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                              <StatCounter target={isNaN(num) ? 0 : num} suffix={suffix} isActive={isActive} />
                            </span>
                            <span className="text-[16px] md:text-[19px] lg:text-[22px] font-normal text-black truncate">
                              {stat.label}
                            </span>
                          </div>
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

        {/* Carousel Dots - GDG Style */}
        <div className="flex justify-center gap-3 mt-6 lg:mt-16">
          {events.map((_, index) => (
            <button
              key={index}
              className={`relative rounded-full overflow-hidden transition-all duration-300 ${index === currentIndex ? 'w-12 h-3' : 'w-3 h-3'}`}
              aria-label={`Go to event ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="absolute inset-0 bg-gray-300"></div>
              <div
                className={`absolute inset-0 bg-gradient-to-r from-[#4285F4] to-[#34A853] origin-left transition-all duration-300 ${index === currentIndex ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>
          ))}
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