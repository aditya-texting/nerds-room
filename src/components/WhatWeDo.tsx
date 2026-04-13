import { useEffect, useRef, useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import Skeleton from './Skeleton';

const WhatWeDo = () => {
  const { whatWeDoCards, loading, navigate } = useAppData();
  const sectionRef = useRef<HTMLElement>(null);

  // Process cards to include real data counts
  const cards = useMemo(() => {
    return whatWeDoCards.map(card => {
      return { ...card, stat: `0+` };
    });
  }, [whatWeDoCards]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <section id="what-we-do" className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50 rounded-3xl my-10 border border-gray-200">
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
    if (t.includes('hackathon') || t.includes('workshop')) return '/events';
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
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhatWeDo;