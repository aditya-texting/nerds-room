import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CardData {
  icon: string | React.ReactElement;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  iconBg: string;
  gradient: string;
}

const WhatWeDo = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const cards: CardData[] = [
    {
      icon: '</>',
      title: 'HACKATHONS',
      description: '24-48 hour building marathons. Code, coffee, chaos.',
      stat: '12+',
      statLabel: 'Hosted',
      iconBg: 'bg-nerdLime',
      gradient: 'from-nerdLime/20 via-nerdLime/10 to-transparent',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: 'IDEATHONS',
      description: 'Brainstorming sessions to solve real-world problems.',
      stat: '10+',
      statLabel: 'Sessions',
      iconBg: 'bg-nerdBlue',
      gradient: 'from-nerdBlue/20 via-nerdBlue/10 to-transparent',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      title: 'WORKSHOPS',
      description: 'Hands-on sessions on AI, Web3, Design & more.',
      stat: '20+',
      statLabel: 'Speakers',
      iconBg: 'bg-yellow-400',
      gradient: 'from-yellow-400/20 via-yellow-400/10 to-transparent',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: 'COHORTS',
      description: 'Long-term learning groups for deep diving into stacks.',
      stat: 'upcoming',
      statLabel: 'Active',
      iconBg: 'bg-red-500',
      gradient: 'from-red-500/20 via-red-500/10 to-transparent',
    },
  ];

  // GSAP scroll-triggered animations for heading + cards
  useEffect(() => {
    if (!sectionRef.current) return;

    let hasAnimated = false;

    const animateIn = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      // Heading animation
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
          }
        );
      }

      // Cards stagger animation
      if (cardRefs.current.length) {
        gsap.fromTo(
          cardRefs.current,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          }
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateIn();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto"
    >
      <div className="relative">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-10 sm:mb-14 md:mb-16 opacity-0">
          <div className="inline-block mb-3">
            <span className="inline-flex items-center rounded-full border border-nerdLime/30 bg-nerdLime/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-nerdBlue">
              WHAT WE DO
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
            Not just talks.{' '}
            <span className="font-bold">We do stuff.</span>
          </h2>
        </div>

        {/* Cards Grid - responsive and modern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) {
                  cardRefs.current[index] = el;
                }
              }}
              className="group relative bg-white/80 backdrop-blur-sm border-2 border-nerdBlue/20 rounded-2xl p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full cursor-pointer overflow-hidden opacity-0"
              style={{
                transitionDelay: `${index * 100}ms`,
                transform: hoveredIndex === index ? 'translateY(-8px) scale(1.02)' : undefined,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
              />

              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-nerdLime/50 transition-all duration-500" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`${card.iconBg} ${
                    card.iconBg === 'bg-nerdLime' ? 'text-nerdBlue' : 'text-white'
                  } w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-5 sm:mb-6 font-black text-xl sm:text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  {typeof card.icon === 'string' ? card.icon : card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-nerdBlue mb-2 sm:mb-3 group-hover:text-nerdBlue transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="font-medium text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Stats */}
              <div className="relative z-10 mt-auto pt-4 sm:pt-5 border-t border-gray-100 group-hover:border-nerdLime/30 transition-colors duration-500">
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-nerdBlue group-hover:scale-110 transition-transform duration-500">
                    {card.stat}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {card.statLabel}
                  </span>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
