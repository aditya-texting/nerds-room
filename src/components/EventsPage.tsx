import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';

const EventsPage = () => {
    const { pastEvents, flagshipEvents, workshops, hackathons, otherEvents, navigate } = useAppData();
    const [activeTab, setActiveTab] = useState<'all' | 'hackathons' | 'flagship' | 'workshops' | 'other' | 'past'>('all');

    const [search, setSearch] = useState('');

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
            <header
                className="relative pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 md:px-8 overflow-hidden bg-nerdBlue"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Improved Overlay for better professional look and contrast */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-nerdBlue/90 via-nerdBlue/60 to-nerdBlue/40"></div>
                <div className="absolute inset-0 z-0 bg-black/20"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
                    <span className="inline-block bg-nerdLime/20 text-nerdLime text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-nerdLime/30 backdrop-blur-md">
                        Nerds Room Events
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-[1.2]">
                        Build. Learn. <br />
                        <span className="text-nerdLime">Connect.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base mb-8 font-medium leading-relaxed">
                        From elite hackathons to hands-on workshops — explore every event happening at Nerds Room. Join our community of builders and innovators.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-lg mx-auto mb-12">
                        <div className="relative flex-1 w-full group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search events, topics, or hosts..."
                                className="w-full px-5 py-3.5 pl-12 rounded-xl border-none bg-white/95 text-slate-900 focus:outline-none focus:ring-2 focus:ring-nerdLime/50 shadow-lg transition-all font-medium text-sm placeholder:text-slate-400"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nerdBlue transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="w-full sm:w-auto px-8 py-3.5 bg-nerdLime text-nerdBlue rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg active:scale-95 text-xs">
                            Search
                        </button>
                    </div>

                    {/* Stats row - more compact and professional */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-8 pt-8 border-t border-white/5">
                        {[
                            { value: publicHackathons.length + '+', label: 'Hackathons' },
                            { value: publicWorkshops.length + '+', label: 'Workshops' },
                            { value: pastEvents.length + '+', label: 'Past Events' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center group cursor-default">
                                <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-nerdLime transition-colors">{stat.value}</div>
                                <div className="text-white/50 text-[10px] font-semibold uppercase tracking-[0.15em] mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── STICKY TABS ── */}
            <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2.5">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-nerdBlue text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
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
                                    <h2 className="text-xl md:text-2xl font-bold text-nerdBlue">Hackathons</h2>
                                    <p className="text-slate-500 text-xs md:text-sm mt-1">Compete, build, and win amazing prizes</p>
                                </div>
                                <button
                                    onClick={() => navigate('/hackathons')}
                                    className="text-nerdBlue text-xs font-bold uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1.5"
                                >
                                    View All
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeTab === 'all' ? publicHackathons.slice(0, 3) : publicHackathons).map((hack, idx) => (
                                <div
                                    key={`hack-${hack.id ?? idx}`}
                                    onClick={() => navigate(`/hackathons/${hack.slug}`)}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-nerdLime/40 transition-all cursor-pointer group overflow-hidden flex flex-col"
                                >
                                    {/* Banner / Logo area */}
                                    <div className="relative h-44 bg-nerdBlue overflow-hidden">
                                        {hack.banner_url ? (
                                            <img src={hack.banner_url} alt={hack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Status badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`${getStatusColor(hack.status)} text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}>
                                                <span className="w-1 h-1 rounded-full bg-white/70 animate-pulse" />
                                                {hack.status}
                                            </span>
                                        </div>
                                        {hack.is_featured && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-nerdLime text-nerdBlue text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                                    Featured
                                                </span>
                                            </div>
                                        )}
                                        {/* Logo */}
                                        {hack.logo_url && (
                                            <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-xl shadow-md overflow-hidden border border-white/20">
                                                <img src={hack.logo_url} alt="" className="w-full h-full object-contain p-1.5" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{hack.organizer}</p>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-nerdBlue transition-colors leading-tight mb-2">{hack.title}</h3>
                                        {hack.description && <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium">{hack.description}</p>}

                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {(hack.tags || []).slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Prize Pool</p>
                                                <p className="text-sm font-bold text-nerdBlue">{hack.prize}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Mode</p>
                                                <p className="text-xs font-bold text-slate-700">{hack.mode}</p>
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
                                <h2 className="text-xl md:text-2xl font-bold text-nerdBlue">Other Events</h2>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">Ideathons, meetups, design competitions & more</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeTab === 'all' ? publicOtherEvents.slice(0, 3) : publicOtherEvents).map((ev, idx) => {
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
                                        onClick={() => navigate(`/other-events/${ev.slug}`)}
                                        className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-sky-200 transition-all group flex flex-col cursor-pointer"
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                                            {ev.image_url ? (
                                                <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className={`w-full h-full ${typeColor} flex items-center justify-center opacity-80`}>
                                                    <svg className="w-14 h-14 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <span className={`absolute top-3 left-3 ${typeColor} text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}>
                                                <span className="w-1 h-1 rounded-full bg-white/70 animate-pulse" />
                                                {ev.status}
                                            </span>
                                            <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/30">
                                                {ev.event_type?.replace(/-/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-nerdBlue transition-colors leading-tight mb-2">{ev.title}</h3>
                                            {ev.description && <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium">{ev.description}</p>}
                                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    <span>{ev.date || 'TBA'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-slate-400" />
                                                    <span>{ev.location || 'TBA'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px]">
                                                    {ev.mode || 'Online'}
                                                </div>
                                            </div>
                                            {ev.prize && <p className="text-xs font-bold text-nerdBlue mt-3 flex items-center gap-1">🏆 {ev.prize}</p>}
                                            <div className="mt-4 text-nerdBlue text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2 transition-all">
                                                View Details
                                                <ArrowRight size={14} />
                                            </div>
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
                                <h2 className="text-xl md:text-2xl font-bold text-nerdBlue">Flagship Events</h2>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">Our signature high-impact experiences</p>
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
                                            <span className="absolute top-3 left-3 bg-nerdBlue text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                                Flagship
                                            </span>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-nerdBlue transition-colors mb-2">{event.title}</h3>
                                            <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium">{event.description}</p>
                                            <div className="mt-auto flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                                                <MapPin size={12} />
                                                <span>{event.location || 'TBA'}</span>
                                            </div>
                                            {link && (
                                                <div className="mt-4 text-nerdBlue text-xs font-bold uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1.5 group-hover:gap-2 transition-all">
                                                    View Details
                                                    <ArrowRight size={14} />
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
                                    <h2 className="text-xl md:text-2xl font-bold text-nerdBlue">Workshops</h2>
                                    <p className="text-slate-500 text-xs md:text-sm mt-1">Skill-building sessions led by experts</p>
                                </div>
                                <button
                                    onClick={() => navigate('/workshops')}
                                    className="text-nerdBlue text-xs font-bold uppercase tracking-widest hover:text-nerdLime transition-colors flex items-center gap-1.5"
                                >
                                    View All
                                    <ArrowRight size={14} />
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
                                        <span className="absolute top-3 left-3 bg-nerdLime text-nerdBlue text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                            Workshop
                                        </span>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-nerdBlue transition-colors leading-tight mb-2">{ws.title}</h3>
                                        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium">{ws.description}</p>

                                        {ws.topics && ws.topics.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {ws.topics.slice(0, 3).map(topic => (
                                                    <span key={topic} className="text-[9px] font-bold uppercase tracking-wider bg-nerdLime/10 text-nerdBlue px-2 py-0.5 rounded-md border border-nerdLime/20">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-slate-400" />
                                                <span>{ws.date || 'TBA'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={12} className="text-slate-400" />
                                                <span>{ws.attendees_count}+ attendees</span>
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
                                <h2 className="text-xl md:text-2xl font-bold text-nerdBlue">Past Events</h2>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">Our journey of impact so far</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event, i) => (
                                <div
                                    key={`past-${event.id ?? i}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-slate-100/50">
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent text-white" />
                                        <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                            Completed
                                        </span>
                                        {event.event_type && (
                                            <span className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                                                {event.event_type}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-nerdBlue transition-colors leading-tight mb-2">{event.title}</h3>
                                        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium">{event.description}</p>
                                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                <span>{event.dates}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={12} />
                                                <span>{event.attendees_count}+</span>
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
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No events found</h3>
                        <p className="text-slate-500 mt-2 text-sm">Stay tuned! New events will be added soon.</p>
                    </div>
                ) : null}

            </main>

            <Footer />
        </div>
    );
};

export default EventsPage;
