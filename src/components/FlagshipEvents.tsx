import { useEffect, useRef, useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';

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
  mtMobile: string;
  mtDesktop: string;
  zIndex: string;
}

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

  const bgColors = ['bg-[#E8F5E9]', 'bg-[#FCE4EC]', 'bg-[#ECEFF1]'];
  const mtMobiles = ['mt-0', 'mt-[25vh]', 'mt-[25vh]'];
  const mtDesktops = ['lg:mt-[39px]', 'lg:mt-[90px]', 'lg:mt-[39px]'];
  const zIndices = ['z-10', 'z-20', 'z-30'];

  // Memoize events to include dynamic counts
  const events: (EventData & { registration_link?: string })[] = useMemo(() => {
    // Dynamic counts calculation
    const totalHackathons = hackathons.length + pastEvents.filter(e => e.event_type?.toLowerCase().includes('hackathon')).length;

    return contextEvents
      .filter((ce: any) => ce.is_public !== false)
      .map((ce: any, i: number) => {
        const dynamicStats = (ce.stats || []).map((s: any) => {
          const label = (s.label || '').toLowerCase();

          // Override 0 or static values with dynamic counts
          if (label.includes('registration')) {
            return { ...s, value: `${totalRegs}+` };
          }
          if (label.includes('attendee')) {
            return { ...s, value: `${totalApprovedRegs || Math.floor(totalRegs * 0.8)}+` };
          }
          if (label.includes('hackathon')) {
            return { ...s, value: `${totalHackathons}+` };
          }
          if (label.includes('speaker') && (s.value === '0' || !s.value)) {
            // Default speakers for flagship events if not set
            return { ...s, value: '25+' };
          }
          return s;
        });

        return {
          ...ce,
          stats: dynamicStats,
          bgColor: bgColors[i % 3],
          mtMobile: mtMobiles[i % 3],
          mtDesktop: mtDesktops[i % 3],
          zIndex: zIndices[i % 3],
          location: ce.location || "TBA",
          registration_link: ce.registration_link
        };
      });
  }, [contextEvents, totalRegs, totalApprovedRegs, hackathons, pastEvents]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<any[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsActive(true);
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );

    // Initial check if section is already in view
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setIsActive(true);
    }

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Handle Animation
  useEffect(() => {
    if (!isActive || events.length === 0) return;

    // Initialize stats if they haven't been set yet to avoid showing 0
    setAnimatedStats(prev => {
      if (prev.length === events.length) return prev;
      return events.map(event => {
        const stats: { [key: string]: number } = {};
        event.stats.forEach(s => { stats[s.label] = 0; });
        return stats;
      });
    });

    const duration = 2000;
    const startTime = performance.now();
    let frameId: number;

    const parsedTargets = events.map(event => {
      const stats: { [key: string]: number } = {};
      event.stats.forEach(s => {
        const num = parseFloat(s.value.replace(/[^0-9.]/g, ''));
        stats[s.label] = isNaN(num) ? 0 : num;
      });
      return stats;
    });

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // Better cubic ease-out

      const next = parsedTargets.map((targets) => {
        const current: { [key: string]: number } = {};
        Object.keys(targets).forEach(label => {
          current[label] = Math.floor(targets[label] * eased);
        });
        return current;
      });

      setAnimatedStats(next);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isActive, events]);



  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full max-w-[372px] h-[520px] rounded-[40px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section ref={sectionRef} id="events" className="py-20 px-4 md:px-8 lg:px-16 transition-all duration-700">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base md:text-2xl text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>

        <div className="relative h-full w-full">
          {maintenanceMode && (
            <div className="absolute inset-0 z-[50] bg-white/95 backdrop-blur-md flex items-center justify-center p-6 text-center rounded-[40px]">
              <div className="max-w-md">
                <div className="text-6xl mb-6">🛠️</div>
                <h1 className="text-4xl font-black text-nerdBlue mb-4 tracking-tighter">EVENTS UNAVAILABLE</h1>
                <p className="text-gray-600 font-bold mb-8">Scheduling maintenance in progress. Check back soon for the next epic event lineup!</p>
              </div>
            </div>
          )}

          <div className="lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-[120px]">
            {events.map((event, index) => (
              <div
                key={index}
                data-event-card
                className={`rounded-[40px] shadow-xl flex flex-col items-center w-full max-w-[280px] md:max-w-[320px] lg:max-w-[372px] h-[380px] md:h-[430px] lg:h-[520px] mx-auto lg:mx-0 ${event.bgColor} ${event.mtMobile} ${event.mtDesktop} lg:z-auto ${event.zIndex} sticky top-[20vh] lg:static transition-all duration-500`}
              >
                <div className="mt-4 md:mt-5 lg:mt-6 mb-3 md:mb-3.5 lg:mb-4 flex items-center justify-center w-full px-4 md:px-5 lg:px-6">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-black text-black">
                    {event.title}
                  </span>
                </div>

                <div className="relative w-[250px] md:w-[290px] lg:w-[334px] h-[260px] md:h-[295px] lg:h-[347px] shrink-0">
                  <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-4 left-[10%] w-[80%] space-y-1.5 md:space-y-2 lg:space-y-2.5">
                    {event.stats.map((stat, sIndex) => (
                      <div key={sIndex} className="bg-white/95 backdrop-blur-sm rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full">
                        <span className="text-[20px] md:text-[24px] lg:text-[28px] font-black text-[#34A853] shrink-0">
                          {animatedStats[index]?.[stat.label] || 0}
                          <span className="align-top text-[14px] md:text-[16px] lg:text-[18px]">
                            {/* Retrieve the suffix by removing the digits */}
                            {stat.value.replace(/[\d,]/g, '')}
                          </span>
                        </span>
                        <span className="text-[12px] md:text-[14px] lg:text-[16px] font-bold text-gray-700 truncate">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto w-full px-4 pb-4 md:pb-5 lg:pb-6 space-y-3">
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 text-black/70">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[12px] md:text-[14px] lg:text-[16px] font-bold uppercase tracking-wider">
                      {event.location}
                    </span>
                  </div>

                  {event.registration_link && (
                    <a
                      href={event.registration_link}
                      target={event.registration_link.startsWith('http') ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-black text-white text-[10px] md:text-[12px] font-black py-2.5 md:py-3 rounded-xl hover:bg-gray-900 transition-colors uppercase tracking-[0.2em] shadow-lg shadow-black/10 active:scale-95 transform transition-transform"
                      onClick={(e) => {
                        if (event.registration_link && !event.registration_link.startsWith('http')) {
                          e.preventDefault();
                          navigate(event.registration_link);
                        }
                      }}
                    >
                      JOIN NOW
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

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
                className={`absolute inset-0 bg-gradient-to-r from-nerdBlue to-nerdLime origin-left transition-all duration-300 ${index === currentIndex ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlagshipEvents;
