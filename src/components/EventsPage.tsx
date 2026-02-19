import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';

const EventsPage = () => {
    const { pastEvents, flagshipEvents, workshops, hackathons, otherEvents, navigate } = useAppData();
    const [activeTab, setActiveTab] = useState<'all' | 'hackathons' | 'flagship' | 'workshops' | 'other' | 'past'>('all');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const publicHackathons = hackathons.filter(h => h.is_public !== false);
    const publicWorkshops = workshops.filter(w => w.is_public !== false);
    const publicFlagship = flagshipEvents.filter(e => (e as any).is_public !== false);
    const publicOtherEvents = (otherEvents || []).filter(e => e.is_public !== false);

    const tabs = [
        { id: 'all', label: 'All', count: publicHackathons.length + publicWorkshops.length + publicFlagship.length + publicOtherEvents.length + pastEvents.length },
        { id: 'hackathons', label: 'Hackathons', count: publicHackathons.length },
        { id: 'flagship', label: 'Flagship', count: publicFlagship.length },
        { id: 'workshops', label: 'Workshops', count: publicWorkshops.length },
        { id: 'other', label: 'Other Events', count: publicOtherEvents.length },
        { id: 'past', label: 'Past Events', count: pastEvents.length },
    ];

    const getStatusColor = (status: string) => {
        if (status === 'open') return 'bg-emerald-500';
        if (status === 'upcoming') return 'bg-orange-500';
        return 'bg-slate-400';
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            {/* ── HERO HEADER ── */}
            <header className="relative overflow-hidden bg-nerdBlue pt-28 pb-24 px-4 md:px-8">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(155,230,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(155,230,0,0.4) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                {/* Glow blobs */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-nerdLime/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto text-center">
                    <span className="inline-block bg-nerdLime/20 text-nerdLime text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 border border-nerdLime/30">
                        Nerds Room Events
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
                        BUILD. LEARN.<br />
                        <span className="text-nerdLime">CONNECT.</span>
                    </h1>
                    <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                        From elite hackathons to hands-on workshops — explore every event happening at Nerds Room.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {[
                            { value: publicHackathons.length + '+', label: 'Hackathons' },
                            { value: publicWorkshops.length + '+', label: 'Workshops' },
                            { value: pastEvents.length + '+', label: 'Past Events' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-black text-nerdLime">{stat.value}</div>
                                <div className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── STICKY TABS ── */}
            <div className="sticky top-[60px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-nerdBlue text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-16">

                {/* ── HACKATHONS SECTION ── */}
                {(activeTab === 'all' || activeTab === 'hackathons') && publicHackathons.length > 0 && (
                    <section>
                        {activeTab === 'all' && (
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-nerdBlue">Hackathons</h2>
                                    <p className="text-slate-500 text-sm mt-1">Compete, build, and win</p>
                                </div>
                                <button
                                    onClick={() => navigate('/hackathons')}
                                    className="text-nerdBlue text-sm font-black uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1"
                                >
                                    View All
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeTab === 'all' ? publicHackathons.slice(0, 3) : publicHackathons).map((hack, idx) => (
                                <div
                                    key={`hack-${hack.id ?? idx}`}
                                    onClick={() => navigate(`/hackathons/${hack.slug}`)}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-nerdLime/40 transition-all cursor-pointer group overflow-hidden flex flex-col"
                                >
                                    {/* Banner / Logo area */}
                                    <div className="relative h-40 bg-nerdBlue overflow-hidden">
                                        {hack.banner_url ? (
                                            <img src={hack.banner_url} alt={hack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Status badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`${getStatusColor(hack.status)} text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                                                {hack.status}
                                            </span>
                                        </div>
                                        {hack.is_featured && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-nerdLime text-nerdBlue text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        {/* Logo */}
                                        {hack.logo_url && (
                                            <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-xl shadow-lg overflow-hidden border border-white/20">
                                                <img src={hack.logo_url} alt="" className="w-full h-full object-contain p-1" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{hack.organizer}</p>
                                        <h3 className="text-base font-black text-slate-900 group-hover:text-nerdBlue transition-colors leading-snug mb-3">{hack.title}</h3>

                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {(hack.tags || []).slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prize Pool</p>
                                                <p className="text-sm font-black text-nerdBlue">{hack.prize}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mode</p>
                                                <p className="text-xs font-black text-slate-700">{hack.mode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── OTHER EVENTS SECTION ── */}
                {(activeTab === 'all' || activeTab === 'other') && publicOtherEvents.length > 0 && (
                    <section>
                        {activeTab === 'all' && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-nerdBlue">Other Events</h2>
                                <p className="text-slate-500 text-sm mt-1">Ideathons, meetups, design competitions & more</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeTab === 'all' ? publicOtherEvents.slice(0, 3) : publicOtherEvents).map((ev, idx) => {
                                const hasLink = !!ev.registration_link && ev.registration_link.startsWith('http');
                                const handleClick = () => {
                                    if (!hasLink) return;
                                    window.open(ev.registration_link, '_blank', 'noopener,noreferrer');
                                };
                                const typeColors: Record<string, string> = {
                                    'ideathon': 'bg-violet-500',
                                    'meetup': 'bg-sky-500',
                                    'design-competition': 'bg-pink-500',
                                    'pitch-competition': 'bg-amber-500',
                                    'bootcamp': 'bg-emerald-500',
                                    'seminar': 'bg-cyan-500',
                                    'networking': 'bg-indigo-500',
                                    'other': 'bg-slate-500',
                                };
                                const typeColor = typeColors[ev.event_type] || 'bg-slate-500';
                                return (
                                    <div
                                        key={`other-${ev.id ?? idx}`}
                                        onClick={handleClick}
                                        className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col${hasLink ? ' cursor-pointer' : ''}`}
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                                            {ev.image_url ? (
                                                <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className={`w-full h-full ${typeColor} flex items-center justify-center opacity-80`}>
                                                    <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            <span className={`absolute top-3 left-3 ${typeColor} text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                                                {ev.status}
                                            </span>
                                            <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border border-white/30">
                                                {ev.event_type?.replace(/-/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-base font-black text-slate-900 group-hover:text-nerdBlue transition-colors leading-snug mb-2">{ev.title}</h3>
                                            {ev.description && <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{ev.description}</p>}
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-bold">{ev.date || 'TBA'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="font-bold">{ev.location || 'TBA'}</span>
                                                </div>
                                            </div>
                                            {ev.prize && <p className="text-xs font-black text-nerdBlue mt-2">🏆 {ev.prize}</p>}
                                            {hasLink && (
                                                <div className="mt-3 text-nerdBlue text-xs font-black uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1">
                                                    Register Now
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── FLAGSHIP SECTION ── */}
                {(activeTab === 'all' || activeTab === 'flagship') && publicFlagship.length > 0 && (
                    <section>
                        {activeTab === 'all' && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-nerdBlue">Flagship Events</h2>
                                <p className="text-slate-500 text-sm mt-1">Our signature experiences</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publicFlagship.map((event: any, i) => {
                                const link = event.registration_link;
                                const isExternal = link && link.startsWith('http');
                                const handleClick = () => {
                                    if (!link) return;
                                    if (isExternal) window.open(link, '_blank', 'noopener,noreferrer');
                                    else navigate(link);
                                };
                                return (
                                    <div
                                        key={`flagship-${event.id ?? i}`}
                                        onClick={handleClick}
                                        className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col${link ? ' cursor-pointer' : ''}`}
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                                            <img
                                                src={event.image_url || event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            <span className="absolute top-3 left-3 bg-nerdBlue text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                                                Flagship
                                            </span>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-base font-black text-slate-900 group-hover:text-nerdBlue transition-colors mb-2">{event.title}</h3>
                                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{event.description}</p>
                                            <div className="mt-auto flex items-center gap-2 text-slate-400 text-xs">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-bold">{event.location || 'TBA'}</span>
                                            </div>
                                            {link && (
                                                <div className="mt-4 text-nerdBlue text-xs font-black uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1">
                                                    View Details
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── WORKSHOPS SECTION ── */}
                {(activeTab === 'all' || activeTab === 'workshops') && publicWorkshops.length > 0 && (
                    <section>
                        {activeTab === 'all' && (
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-nerdBlue">Workshops</h2>
                                    <p className="text-slate-500 text-sm mt-1">Skill-building sessions</p>
                                </div>
                                <button
                                    onClick={() => navigate('/workshops')}
                                    className="text-nerdBlue text-sm font-black uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1"
                                >
                                    View All
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeTab === 'all' ? publicWorkshops.slice(0, 3) : publicWorkshops).map((ws, idx) => (
                                <div
                                    key={`ws-${ws.id ?? idx}`}
                                    onClick={() => navigate(`/workshops/${ws.slug}`)}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-nerdLime/40 transition-all cursor-pointer group flex flex-col"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                                        <img
                                            src={ws.image_url}
                                            alt={ws.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <span className="absolute top-3 left-3 bg-nerdLime text-nerdBlue text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                                            Workshop
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-base font-black text-slate-900 group-hover:text-nerdBlue transition-colors leading-snug mb-2">{ws.title}</h3>
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{ws.description}</p>

                                        {ws.topics && ws.topics.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {ws.topics.slice(0, 3).map(topic => (
                                                    <span key={topic} className="text-[9px] font-black uppercase tracking-wider bg-nerdLime/10 text-nerdBlue px-2 py-0.5 rounded-md">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-bold">{ws.date || 'TBA'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-bold">{ws.attendees_count}+ attendees</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}



                {/* ── PAST EVENTS SECTION ── */}
                {(activeTab === 'all' || activeTab === 'past') && pastEvents.length > 0 && (
                    <section>
                        {activeTab === 'all' && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-nerdBlue">Past Events</h2>
                                <p className="text-slate-500 text-sm mt-1">Our journey so far</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event, i) => (
                                <div
                                    key={`past-${event.id ?? i}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                                            Completed
                                        </span>
                                        {event.event_type && (
                                            <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border border-white/30">
                                                {event.event_type}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-base font-black text-slate-900 group-hover:text-nerdBlue transition-colors leading-snug mb-2">{event.title}</h3>
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{event.description}</p>
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-bold">{event.dates}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-bold">{event.attendees_count}+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── EMPTY STATE ── */}
                {(activeTab === 'hackathons' && publicHackathons.length === 0) ||
                    (activeTab === 'flagship' && publicFlagship.length === 0) ||
                    (activeTab === 'workshops' && publicWorkshops.length === 0) ||
                    (activeTab === 'other' && publicOtherEvents.length === 0) ||
                    (activeTab === 'past' && pastEvents.length === 0) ? (
                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">No events found</h3>
                        <p className="text-slate-500 mt-2">Stay tuned! New events will be added soon.</p>
                    </div>
                ) : null}

            </main>

            <Footer />
        </div>
    );
};

export default EventsPage;
