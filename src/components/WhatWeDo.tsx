import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';

interface DisplayCard {
  id?: number | string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  icon?: string;
}

const DEFAULT_CARDS: DisplayCard[] = [
  {
    title: 'HACKATHONS',
    description: '24-48 hour building marathons. Code, coffee, and shipping real products.',
    stat: '12+',
    statLabel: 'Hosted',
  },
  {
    title: 'BUILDATHONS',
    description: '6 to 12 hours dedicated buildathons.',
    stat: '10+',
    statLabel: 'Sessions',
  },
  {
    title: 'WORKSHOPS',
    description: 'Hands-on technical sessions on AI, Web3, full stack, and design engineering.',
    stat: '20+',
    statLabel: 'Speakers',
  },
  {
    title: 'COHORTS',
    description: 'Intensive peer learning groups for deep diving into modern tech stacks.',
    stat: '5+',
    statLabel: 'Active',
  },
];

const WhatWeDo = () => {
  const { whatWeDoCards, loading } = useAppData();

  // Process cards to include real data counts or fall back to default cards
  const cards: DisplayCard[] = useMemo(() => {
    if (whatWeDoCards && whatWeDoCards.length > 0) {
      return whatWeDoCards.map(card => {
        const titleLower = (card.title || '').toLowerCase();
        if (titleLower.includes('ideathon')) {
          return {
            ...card,
            title: 'BUILDATHONS',
            description: '6 to 12 hours dedicated buildathons.',
            stat: card.stat || '10+',
            statLabel: card.statLabel || 'Sessions'
          };
        }
        return {
          ...card,
          stat: card.stat || '0+',
          statLabel: card.statLabel || ''
        };
      });
    }
    return DEFAULT_CARDS;
  }, [whatWeDoCards]);

  if (loading && (!whatWeDoCards || whatWeDoCards.length === 0)) {
    return (
      <section id="what-we-do" className="py-12 sm:py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20 md:scroll-mt-24">
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

  const getIconBgColor = (idx: number) => {
    const colors = ['bg-[#9BE600]', 'bg-[#00308F]', 'bg-yellow-400', 'bg-red-500'];
    return colors[idx % colors.length];
  };

  const getIconTextColor = (idx: number) => {
    const colors = ['text-[#00308F]', 'text-white', 'text-[#00308F]', 'text-white'];
    return colors[idx % colors.length];
  };

  return (
    <section id="what-we-do" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto scroll-mt-20 md:scroll-mt-24">
      <div className="text-center mb-10 sm:mb-14 md:mb-16">
        <span className="text-nerdLime font-black tracking-widest text-xs uppercase mb-3 block">
          WHAT WE DO
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-nerdBlue tracking-tight mb-3">
          NOT JUST TALKS. <span className="text-black">WE DO STUFF.</span>
        </h2>
        <p className="font-semibold text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          We bring builders together to create, innovate, and ship real products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          return (
            <div
              key={card.id || index}
              className="relative bg-white border-2 border-[#00308F] p-6 shadow-[5px_5px_0px_rgba(0,48,143,0.2)] hover:shadow-[8px_8px_0px_#00308F] hover:-translate-y-1 transition-all duration-300 group rounded-xl flex flex-col justify-between h-full"
            >
              <div>
                <div className={`w-12 h-12 ${getIconBgColor(index)} rounded-lg flex items-center justify-center ${getIconTextColor(index)} mb-4 font-black text-xl`}>
                  {(() => {
                    const title = (card.title || '').toLowerCase();
                    if (title.includes('hackathon')) {
                      return <>&lt;/&gt;</>;
                    }
                    if (title.includes('buildathon') || title.includes('ideathon') || title.includes('community')) {
                      return (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
                <h3 className="text-2xl font-black text-[#00308F] mb-2 uppercase tracking-tight leading-tight">{card.title}</h3>
                <p className="font-medium text-sm text-gray-600 mb-4 leading-relaxed">{card.description}</p>
              </div>

              {card.stat && (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-[#00308F]">{card.stat}</span>
                  {card.statLabel && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.statLabel}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhatWeDo;