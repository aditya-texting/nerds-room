import { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface PublicEvent {
  id: string;
  title: string;
  coverUrl: string;
  badge: 'Luma' | 'Unstop' | 'Devfolio' | 'HackerEarth' | 'Nerds Room' | 'External';
  dateStr: string;
  timestamp?: number;
  location: string;
  chapterName?: string;
  chapterId?: number | null;
  link: string;
  isPast?: boolean;
  isExternal?: boolean;
}

// Fallback real Luma event for instant load before API responds
const REAL_LUMA_UPCOMING: PublicEvent[] = [
  {
    id: 'evt-1C7tBN73sPGztag',
    title: 'Let Start: Zero to Prototype',
    coverUrl: 'https://images.lumacdn.com/uploads/06/f0fb4a76-6cd8-419c-9c8a-0b682d506b9b.png',
    badge: 'Luma',
    dateStr: '11 Oct 2026',
    location: 'NIT Jalandhar',
    chapterName: 'Jalandhar',
    link: 'https://lu.ma/ocvbp9p0',
    isPast: false,
  },
];

const REAL_LUMA_PAST: PublicEvent[] = [
  {
    id: 'past-luma-1',
    title: 'AI in Observability w/ CNCG Noida & Nerds Room',
    coverUrl: 'https://images.lumacdn.com/uploads/6y/7ed9587d-f89d-477b-bf5b-d4cf296363b2.png',
    badge: 'Nerds Room',
    dateStr: '26 Sep 2026',
    location: 'Noida',
    chapterName: 'Noida',
    link: 'https://lu.ma/nerdsroom',
    isPast: true,
  },
  {
    id: 'past-luma-2',
    title: 'AI Day Noida',
    coverUrl: 'https://images.lumacdn.com/uploads/w7/8ba49e6d-260c-480f-bdaf-f14b9a6eca48.png',
    badge: 'Nerds Room',
    dateStr: '20 Sep 2026',
    location: 'Noida',
    chapterName: 'Noida',
    link: 'https://lu.ma/nerdsroom',
    isPast: true,
  },
  {
    id: 'past-luma-3',
    title: 'Nerds Meetup 2.0',
    coverUrl: 'https://images.lumacdn.com/uploads/gw/ca35b752-affb-4f3d-90aa-d95ee0d2ed40.png',
    badge: 'Nerds Room',
    dateStr: '13 Sep 2026',
    location: 'Noida',
    chapterName: 'Noida',
    link: 'https://lu.ma/nerdsroom',
    isPast: true,
  },
];

const formatDate = (dateString?: string) => {
  if (!dateString) return 'TBA';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
};

const EventsPage = () => {
  const [lumaUpcoming, setLumaUpcoming] = useState<PublicEvent[]>(() => {
    try {
      const cached = localStorage.getItem('nerds_luma_upcoming');
      return cached ? JSON.parse(cached) : REAL_LUMA_UPCOMING;
    } catch {
      return REAL_LUMA_UPCOMING;
    }
  });

  const [lumaPast, setLumaPast] = useState<PublicEvent[]>(() => {
    try {
      const cached = localStorage.getItem('nerds_luma_past');
      return cached ? JSON.parse(cached) : REAL_LUMA_PAST;
    } catch {
      return REAL_LUMA_PAST;
    }
  });

  // External events created in Admin Panel (Unstop, Devfolio, etc.)
  const [externalEvents, setExternalEvents] = useState<PublicEvent[]>(() => {
    try {
      const cached = localStorage.getItem('nerds_external_events');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [showAllPast, setShowAllPast] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const fetchLumaEvents = useCallback(async () => {
    try {
      const calId = 'cal-RnzTQXOxDIzD7SU';
      const timestamp = Date.now();

      // 1. Fetch Upcoming Events (No fake dummy filler!)
      const upcomingRes = await fetch(`/api/luma/calendar/get-items?calendar_api_id=${calId}&t=${timestamp}`);
      if (upcomingRes.ok) {
        const data = await upcomingRes.json();
        if (Array.isArray(data?.entries)) {
          const mapped: PublicEvent[] = data.entries.map((entry: any) => {
            const ev = entry.event || {};
            const loc = ev.geo_address_info?.city || ev.location?.city || ev.geo_address_info?.short_address || 'India';
            const lumaSlug = ev.url ? (ev.url.startsWith('http') ? ev.url : `https://lu.ma/${ev.url}`) : 'https://lu.ma/nerdsroom';
            return {
              id: ev.api_id || entry.api_id || String(Math.random()),
              title: ev.name || 'Community Event',
              coverUrl: ev.cover_url || 'https://images.lumacdn.com/uploads/06/f0fb4a76-6cd8-419c-9c8a-0b682d506b9b.png',
              badge: 'Luma',
              dateStr: formatDate(ev.start_at),
              timestamp: ev.start_at ? new Date(ev.start_at).getTime() : 0,
              location: loc,
              chapterName: loc.includes('Jalandhar') ? 'Jalandhar' : loc.includes('Noida') ? 'Noida' : undefined,
              link: lumaSlug,
              isPast: false,
            };
          });
          setLumaUpcoming(mapped);
          localStorage.setItem('nerds_luma_upcoming', JSON.stringify(mapped));
        }
      }

      // 2. Fetch Past Events
      const pastRes = await fetch(`/api/luma/calendar/get-items?calendar_api_id=${calId}&period=past&t=${timestamp}`);
      if (pastRes.ok) {
        const pastData = await pastRes.json();
        if (Array.isArray(pastData?.entries) && pastData.entries.length > 0) {
          const mappedPast: PublicEvent[] = pastData.entries.map((entry: any) => {
            const ev = entry.event || {};
            const loc = ev.geo_address_info?.city || ev.location?.city || ev.geo_address_info?.short_address || 'India';
            const lumaSlug = ev.url ? (ev.url.startsWith('http') ? ev.url : `https://lu.ma/${ev.url}`) : 'https://lu.ma/nerdsroom';
            return {
              id: ev.api_id || entry.api_id || String(Math.random()),
              title: ev.name || 'Past Event',
              coverUrl: ev.cover_url || 'https://images.lumacdn.com/uploads/w7/8ba49e6d-260c-480f-bdaf-f14b9a6eca48.png',
              badge: 'Nerds Room',
              dateStr: formatDate(ev.start_at),
              timestamp: ev.start_at ? new Date(ev.start_at).getTime() : 0,
              location: loc,
              chapterName: loc.includes('Jalandhar') ? 'Jalandhar' : loc.includes('Noida') ? 'Noida' : undefined,
              link: lumaSlug,
              isPast: true,
            };
          });
          setLumaPast(mappedPast);
          localStorage.setItem('nerds_luma_past', JSON.stringify(mappedPast));
        }
      }
    } catch (err) {
      console.warn('[NerdsRoom] Luma live fetch warning:', err);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLumaEvents();

    // Listen for external events updates from Admin Panel
    const syncExternal = () => {
      try {
        const cached = localStorage.getItem('nerds_external_events');
        if (cached) setExternalEvents(JSON.parse(cached));
      } catch {}
    };
    window.addEventListener('storage', syncExternal);
    return () => window.removeEventListener('storage', syncExternal);
  }, [fetchLumaEvents]);

  // Combine external events and Luma events (NO DUMMIES)
  const allUpcoming = useMemo(() => {
    const extUpcoming = externalEvents.filter(ev => !ev.isPast);
    return [...extUpcoming, ...lumaUpcoming];
  }, [externalEvents, lumaUpcoming]);

  const allPast = useMemo(() => {
    const extPast = externalEvents.filter(ev => ev.isPast);
    return [...extPast, ...lumaPast];
  }, [externalEvents, lumaPast]);

  const displayedUpcoming = useMemo(() => {
    return showAllUpcoming ? allUpcoming : allUpcoming.slice(0, 4);
  }, [allUpcoming, showAllUpcoming]);

  const displayedPast = useMemo(() => {
    return showAllPast ? allPast : allPast.slice(0, 4);
  }, [allPast, showAllPast]);

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Unstop':
        return 'bg-[#4338CA] text-white border-[#4338CA]';
      case 'Devfolio':
        return 'bg-[#2762EA] text-white border-[#2762EA]';
      case 'HackerEarth':
        return 'bg-[#2C3454] text-white border-[#2C3454]';
      case 'Nerds Room':
        return 'bg-[#9BE600] text-[#00308F] border-[#00308F]';
      case 'Luma':
      default:
        return 'bg-[#00308F] text-white border-[#00308F]';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-nerdLime selection:text-nerdBlue relative overflow-x-hidden">
      <Navbar />

      {/* Background Decorative Ambient Lighting (Pure Nerds Room Light Grid & Glow) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-nerdBlue/5 blur-[160px] rounded-full" />
        <div className="absolute top-[35%] -right-32 w-[550px] h-[550px] bg-nerdLime/15 blur-[180px] rounded-full" />
        <div className="absolute bottom-20 left-[20%] w-[600px] h-[600px] bg-nerdBlue/5 blur-[170px] rounded-full" />
        {/* Subtle Light Grid Pattern matching Homepage */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <main className="relative z-10 pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* ── TOP HERO HEADER (Pure Nerds Room Light Theme) ── */}
        <section className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nerdLime/15 border-2 border-nerdLime text-nerdBlue text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-nerdLime animate-pulse" />
              COMMUNITY EVENTS HUB
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-nerdBlue leading-[1.08] mb-4">
              EXPERIENCE THE <br />
              <span className="text-black">FUTURE, TODAY.</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl font-semibold max-w-2xl mx-auto">
              Live from our Luma calendar and community chapters. Discover hackathons, buildathons, hands-on workshops, and meetups across India.
            </p>
          </motion.div>
        </section>

        {/* ── SECTION 1: UPCOMING EVENTS ── */}
        <section id="upcoming-events" className="mb-20 sm:mb-28">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-nerdLime font-black tracking-widest text-xs uppercase mb-1 block">
                WHAT'S NEXT
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-nerdBlue tracking-tight flex items-center gap-3">
                Upcoming <span className="text-black">Events</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1.5 font-semibold">
                Discover and join exciting hackathons, buildathons, workshops and meetups.
              </p>
            </div>
            {allUpcoming.length > 4 && (
              <button
                onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                className="group self-start sm:self-auto text-sm font-black text-nerdBlue hover:text-[#002570] transition-colors flex items-center gap-1.5"
              >
                <span>{showAllUpcoming ? 'Show Less' : `View All Events (${allUpcoming.length})`}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* 4-Column Compact Card Grid with 800x800 Square Posters */}
          {allUpcoming.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No Upcoming Events Right Now</h3>
              <p className="text-sm text-gray-500 mt-1">Check back soon or explore our past event archives!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {displayedUpcoming.map((event, idx) => (
                <motion.article
                  key={event.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="bg-white border-2 border-nerdBlue rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-[4px_4px_0px_rgba(0,48,143,0.16)] hover:shadow-[6px_6px_0px_#00308F] hover:-translate-y-1 transition-all duration-300 group max-w-[280px] w-full mx-auto sm:mx-0"
                >
                  <div>
                    {/* 800x800 Exact 1:1 Square Cover Container */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner">
                      <img
                        src={event.coverUrl}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.lumacdn.com/uploads/06/f0fb4a76-6cd8-419c-9c8a-0b682d506b9b.png';
                        }}
                      />
                    </div>

                    {/* Platform Badge & Chapter / City Tag */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getBadgeStyle(event.badge)}`}>
                        {event.badge}
                      </span>
                      {event.chapterName && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-nerdBlue border border-nerdBlue/30">
                          <MapPin className="w-2.5 h-2.5 text-nerdBlue" />
                          {event.chapterName}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-nerdBlue transition-colors line-clamp-2 mb-2">
                      {event.title}
                    </h3>

                    {/* Meta Information */}
                    <div className="flex flex-col gap-1 text-gray-500 text-[11px] font-semibold mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-nerdBlue shrink-0" />
                        <span className="truncate">{event.dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-nerdBlue shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Register Button */}
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-nerdBlue hover:bg-[#002570] text-white font-black rounded-lg text-center text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0px_#9BE600] hover:shadow-[1px_1px_0px_#9BE600] hover:translate-y-0.5 active:translate-y-1 transition-all"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2: PAST EVENTS (Matches Mockup Structure & Light Theme) ── */}
        <section id="past-events">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-nerdLime font-black tracking-widest text-xs uppercase mb-1 block">
                EVENT ARCHIVE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-nerdBlue tracking-tight flex items-center gap-3">
                Past <span className="text-black">Events</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-1.5 font-semibold">
                Relive the moments, explore highlights and see what our community has built.
              </p>
            </div>
            {allPast.length > 4 && (
              <button
                onClick={() => setShowAllPast(!showAllPast)}
                className="group self-start sm:self-auto text-sm font-black text-nerdBlue hover:text-[#002570] transition-colors flex items-center gap-1.5"
              >
                <span>{showAllPast ? 'Show Less' : `View Event Archive (${allPast.length})`}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* 4-Column Compact Card Grid with 800x800 Square Posters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayedPast.map((event, idx) => (
              <motion.article
                key={event.id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white border-2 border-slate-200 hover:border-nerdBlue rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_rgba(0,0,0,0.06)] hover:shadow-[6px_6px_0px_#00308F] hover:-translate-y-1 transition-all duration-300 group max-w-[280px] w-full mx-auto sm:mx-0"
              >
                <div>
                  {/* 800x800 Exact 1:1 Square Poster Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner">
                    <img
                      src={event.coverUrl}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.lumacdn.com/uploads/w7/8ba49e6d-260c-480f-bdaf-f14b9a6eca48.png';
                      }}
                    />
                  </div>

                  {/* Platform Badge & Chapter / City Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-nerdBlue border border-slate-300">
                      {event.badge}
                    </span>
                    {event.chapterName && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-nerdBlue border border-nerdBlue/30">
                        <MapPin className="w-2.5 h-2.5 text-nerdBlue" />
                        {event.chapterName}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-nerdBlue transition-colors line-clamp-2 mb-2">
                    {event.title}
                  </h3>

                  {/* Meta Information */}
                  <div className="flex flex-col gap-1 text-gray-500 text-[11px] font-semibold mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-nerdBlue shrink-0" />
                      <span className="truncate">{event.dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-nerdBlue shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Compact Outlined Action Button */}
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-white hover:bg-nerdBlue text-nerdBlue hover:text-white border-2 border-nerdBlue font-black rounded-lg text-center text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0px_rgba(0,48,143,0.12)] hover:shadow-[2px_2px_0px_#9BE600] transition-all"
                >
                  <span>View Event</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.article>
            ))}
          </div>

          {/* Quick Pagination / Load More if not showing all */}
          {!showAllPast && allPast.length > 4 && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setShowAllPast(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-nerdBlue hover:bg-nerdBlue text-nerdBlue hover:text-white text-xs sm:text-sm font-black transition-all shadow-[4px_4px_0px_#00308F] hover:shadow-[2px_2px_0px_#00308F] hover:translate-y-0.5 cursor-pointer"
              >
                <span>EXPLORE ALL {allPast.length} ARCHIVED EVENTS</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;
