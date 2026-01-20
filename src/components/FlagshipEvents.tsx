import { useEffect, useRef, useState } from 'react';

interface EventData {
  title: string;
  logo?: string;
  image: string;
  stats: {
    registrations: number;
    attendees: number;
    speakers: number;
  };
  location: string;
  bgColor: string;
  mtMobile: string;
  mtDesktop: string;
  zIndex: string;
}

const events: EventData[] = [
  {
    title: 'InnovWar Tech Fest',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
    stats: {
      registrations: 500,
      attendees: 400,
      speakers: 25,
    },
    location: 'Multiple Venues, NCR',
    bgColor: 'bg-[#E8F5E9]',
    mtMobile: 'mt-0',
    mtDesktop: 'lg:mt-[39px]',
    zIndex: 'z-10',
  },
  {
    title: 'Major Hackathons',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    stats: {
      registrations: 2000,
      attendees: 1500,
      speakers: 50,
    },
    location: 'Pan India',
    bgColor: 'bg-[#FCE4EC]',
    mtMobile: 'mt-[25vh]',
    mtDesktop: 'lg:mt-[90px]',
    zIndex: 'z-20',
  },
  {
    title: 'Tech Conclaves',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    stats: {
      registrations: 800,
      attendees: 600,
      speakers: 30,
    },
    location: 'Lucknow, Gurugram, Noida',
    bgColor: 'bg-[#ECEFF1]',
    mtMobile: 'mt-[25vh]',
    mtDesktop: 'lg:mt-[39px]',
    zIndex: 'z-30',
  },
];

const FlagshipEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(
    events.map(() => ({
      registrations: 0,
      attendees: 0,
      speakers: 0,
    }))
  );
  const sectionRef = useRef<HTMLElement>(null);

  // Observe section visibility to start animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
          } else {
            setIsActive(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Counting animation for stats
  useEffect(() => {
    if (!isActive) return;

    let frameId: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats(
        events.map((event) => ({
          registrations: Math.floor(event.stats.registrations * eased),
          attendees: Math.floor(event.stats.attendees * eased),
          speakers: Math.floor(event.stats.speakers * eased),
        }))
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isActive]);

  // Auto-switch between cards (like slider dots)
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % events.length;

        if (sectionRef.current) {
          const cardElements = sectionRef.current.querySelectorAll('[data-event-card]');
          const target = cardElements[next] as HTMLElement | undefined;
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          }
        }

        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      id="events"
      className="py-20 px-4 md:px-8 lg:px-16 transition-all duration-700"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
            Our <span className="font-bold">Flagship Events</span>
          </h2>
          <p className="text-base md:text-2xl text-gray-600 mt-3">
            Our signature experiences that define excellence
          </p>
        </div>

        {/* Events Container */}
        <div className="relative lg:overflow-hidden">
          <div
            className="lg:cursor-grab lg:active:cursor-grabbing"
            draggable={false}
            style={{
              zIndex: 1,
              opacity: 1,
              transform: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'pan-y',
            }}
          >
            <div className="block lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-[120px]">
              {events.map((event, index) => (
                <div
                  key={index}
                  data-event-card
                  className={`rounded-[20px] shadow-xl flex flex-col items-center w-full max-w-[280px] md:max-w-[320px] lg:max-w-[372px] h-[380px] md:h-[430px] lg:h-[493px] mx-auto lg:mx-0 ${event.bgColor} ${event.mtMobile} ${event.mtDesktop} lg:z-auto ${event.zIndex} sticky top-[20vh] lg:static`}
                >
                  {/* Logo Section */}
                  <div className="mt-4 md:mt-5 lg:mt-6 mb-3 md:mb-3.5 lg:mb-4 flex items-center justify-center w-full px-4 md:px-5 lg:px-6">
                    <div className="relative w-full h-[45px] md:h-[50px] lg:h-[60px]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl lg:text-4xl font-black text-black">
                          {event.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative w-[250px] md:w-[290px] lg:w-[334px] h-[260px] md:h-[295px] lg:h-[347px] shrink-0">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Stats Badges */}
                    <div className="absolute bottom-2 md:bottom-2.5 lg:bottom-3 left-[30%] md:left-[32%] lg:left-[35%] space-y-1.5 md:space-y-2 lg:space-y-2.5">
                      <div className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit">
                        <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                          {animatedStats[index]?.registrations.toLocaleString()}
                          <span className="align-top text-[18px] md:text-[20px] lg:text-[22px]">+</span>
                        </span>
                        <span className="text-[16px] md:text-[19px] lg:text-[22px] font-normal text-black">
                          Registrations
                        </span>
                      </div>
                      <div className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit">
                        <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                          {animatedStats[index]?.attendees.toLocaleString()}
                          <span className="align-top text-[18px] md:text-[20px] lg:text-[22px]">+</span>
                        </span>
                        <span className="text-[16px] md:text-[19px] lg:text-[22px] font-normal text-black">
                          Attendees
                        </span>
                      </div>
                      <div className="bg-white rounded-[12px] md:rounded-[15px] lg:rounded-[17px] px-2 md:px-2.5 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-fit">
                        <span className="text-[24px] md:text-[28px] lg:text-[33px] font-normal text-[#34A853]">
                          {animatedStats[index]?.speakers.toLocaleString()}
                          <span className="align-top text-[18px] md:text-[20px] lg:text-[22px]">+</span>
                        </span>
                        <span className="text-[16px] md:text-[19px] lg:text-[22px] font-normal text-black">
                          Speakers
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 text-black mt-auto pt-1.5 md:pt-2 pb-4 md:pb-5 lg:pb-6 px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="text-[14px] md:text-[17px] lg:text-[20px] font-medium text-center leading-tight">
                      {event.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-6 lg:mt-16">
            {events.map((_, index) => (
              <button
                key={index}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                  index === currentIndex ? 'w-12 h-3' : 'w-3 h-3'
                }`}
                aria-label={`Go to event set ${index + 1}`}
                onClick={() => {
                  setCurrentIndex(index);
                  // Scroll to the card
                  if (sectionRef.current) {
                    const cardElements = sectionRef.current.querySelectorAll('[data-event-card]');
                    if (cardElements[index]) {
                      cardElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                }}
              >
                <div className="absolute inset-0 bg-gray-300"></div>
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#4285F4] to-[#34A853] origin-left transition-all duration-300 ${
                    index === currentIndex ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ willChange: 'transform' }}
                ></div>
                {index !== currentIndex && (
                  <div className="absolute inset-0 bg-gray-300 hover:bg-gray-400 transition-colors"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlagshipEvents;
