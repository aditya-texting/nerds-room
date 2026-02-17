import { useEffect, useRef, useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';

const WhatWeDo = () => {
  const { whatWeDoCards, hackathons, workshops, pastEvents, loading, navigate } = useAppData();
  const [isActive, setIsActive] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<{ [key: number]: number }>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Process cards to include real data counts
  const cards = useMemo(() => {
    const publicHackathons = hackathons.filter(h => h.is_public !== false);
    const publicWorkshops = workshops.filter(w => w.is_public !== false);

    // Actual count for hackathons
    const hackathonCount = publicHackathons.length + pastEvents.filter(e => e.event_type?.toLowerCase().includes('hackathon')).length;
    // Actual count for workshops
    const workshopCount = publicWorkshops.length;

    return whatWeDoCards.map(card => {
      const title = (card.title || '').toLowerCase();
      const label = (card.statLabel || '').toLowerCase();

      if (title.includes('hackathon') || label.includes('hosted')) {
        return { ...card, stat: `${hackathonCount}+` };
      }
      // Set stats for workshops
      if (title.includes('workshop') || label.includes('sessions')) {
        return { ...card, stat: `${workshopCount}+` };
      }
      // Others are still coming soon
      if (title.includes('community') || label.includes('members')) {
        return { ...card, stat: `0+` };
      }
      if (title.includes('project') || label.includes('shipped')) {
        return { ...card, stat: `0+` };
      }

      return card;
    });
  }, [whatWeDoCards, hackathons, pastEvents]);

  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsActive(true);
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );

    // Initial check
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setIsActive(true);
    }

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Handle Animation
  useEffect(() => {
    if (!isActive || cards.length === 0) return;

    // Pre-initialize stats to avoid empty object access
    setAnimatedStats(prev => {
      if (Object.keys(prev).length === cards.length) return prev;
      const initial: { [key: number]: number } = {};
      cards.forEach((_, i) => { initial[i] = 0; });
      return initial;
    });

    const duration = 2000;
    const startTime = performance.now();
    let frameId: number;

    const parsedTargets = cards.map(card => {
      const num = parseFloat((card.stat || '').replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    });

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const next: { [key: number]: number } = {};
      parsedTargets.forEach((target, i) => {
        next[i] = target % 1 === 0 ? Math.floor(target * eased) : target * eased;
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
  }, [isActive, cards]);

  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50 rounded-3xl my-10 border border-gray-200">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80">
              <Skeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Helper functions used in render
  const getCardLink = (title: string) => {
    const t = (title || '').toLowerCase();
    if (t.includes('hackathon')) return '/hackathons';
    if (t.includes('workshop')) return '/events'; // Redirect to /events as requested
    return null;
  };

  const isComingSoon = (title: string) => {
    const t = (title || '').toLowerCase();
    return (
      t.includes('ideathon') ||
      t.includes('cohort') ||
      t.includes('community') ||
      t.includes('project')
    );
  };

  const getIconBgColor = (idx: number) => {
    const colors = ['bg-[#9BE600]', 'bg-[#00308F]', 'bg-yellow-400', 'bg-red-500'];
    return colors[idx % colors.length];
  };

  const getIconTextColor = (idx: number) => {
    const colors = ['text-[#00308F]', 'text-white', 'text-[#00308F]', 'text-white'];
    return colors[idx % colors.length];
  };

  return (
    <section ref={sectionRef} id="what-we-do" className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50 rounded-3xl my-10 border border-gray-200">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-[#00308F] mb-2">WHAT WE DO</h2>
        <p className="font-bold text-[#00308F]/60 text-xl">Not just talks. We do stuff.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const cardLink = getCardLink(card.title || '');
          const comingSoon = isComingSoon(card.title || '');
          const isClickable = !!cardLink;

          return (
            <div
              key={index}
              onClick={() => {
                if (cardLink) {
                  navigate(cardLink);
                  window.scrollTo(0, 0);
                }
              }}
              className={`relative bg-white border-2 border-[#00308F] p-6 shadow-[5px_5px_0px_rgba(0,48,143,0.2)] ${isClickable ? 'hover:shadow-[6px_6px_0px_#00308F] cursor-pointer' : 'opacity-75'} transition-all group rounded-xl flex flex-col justify-between h-full`}
            >
              {comingSoon && (
                <div className="absolute top-4 right-4 bg-[#9BE600] text-[#00308F] text-xs font-black px-3 py-1 rounded-full">
                  COMING SOON
                </div>
              )}
              <div>
                <div className={`w-12 h-12 ${getIconBgColor(index)} rounded-lg flex items-center justify-center ${getIconTextColor(index)} mb-4 font-black text-xl`}>
                  {(() => {
                    const title = (card.title || '').toLowerCase();
                    if (title.includes('hackathon')) {
                      return <>&lt;/&gt;</>;
                    }
                    if (title.includes('ideathon') || title.includes('community')) {
                      return (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      );
                    }
                    if (title.includes('workshop')) {
                      return (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      );
                    }
                    if (title.includes('cohort') || title.includes('project')) {
                      return (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      );
                    }
                    return <>&lt;/&gt;</>;
                  })()}
                </div>
                <h3 className="text-2xl font-black text-[#00308F] mb-1 uppercase tracking-tight leading-tight">{card.title}</h3>
                <p className="font-medium text-sm text-gray-500 mb-4 leading-relaxed">{card.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-3xl font-black text-[#00308F]">
                  {cards[index].stat.includes('.')
                    ? (animatedStats[index] || 0).toFixed(1)
                    : (animatedStats[index] || 0)}
                  {(card.stat || '').replace(/[\d,.]/g, '')}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.statLabel || 'Hosted'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhatWeDo;