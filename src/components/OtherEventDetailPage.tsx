import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { Clock, Trophy, MapPin, Globe, Users, Zap, Twitter, Linkedin, Github, Instagram, CheckCircle, Calendar, ExternalLink } from 'lucide-react';

const OtherEventDetailPage = () => {
    const { otherEvents, navigate, loading: contextLoading } = useAppData();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const slug = decodeURIComponent(window.location.pathname.split('/').pop() || '');

    useEffect(() => {
        if (!contextLoading) {
            const found = otherEvents.find((e: any) =>
                e.slug === slug || e.slug?.toLowerCase() === slug.toLowerCase()
            );
            setEvent(found || null);
            setLoading(false);
        }
    }, [otherEvents, slug, contextLoading]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (event?.title) document.title = `${event.title} | Nerds Room`;
    }, [event]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-[1140px] mx-auto px-4 pt-24 space-y-8">
                    <div className="h-[300px] bg-slate-100 rounded-[3rem] animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-10 w-2/3 bg-slate-100 rounded-xl animate-pulse" />
                        <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-12 h-12 text-slate-200" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Event Not Found</h1>
                    <p className="text-slate-500 mb-6 max-w-md">The event you're looking for might have been removed or the link is incorrect.</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-8 py-3 bg-nerdBlue text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
                    >
                        Back to Events
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const hasRegLink = !!event.registration_link?.startsWith('http');

    // Define Tabs based on available content
    const tabs = [
        { id: 'overview', label: 'About' },
        ...(event.format_process?.length > 0 ? [{ id: 'process', label: 'Process' }] : []),
        ...(event.rules?.length > 0 ? [{ id: 'rules', label: 'Rules' }] : []),
        ...(event.eligibilities?.length > 0 ? [{ id: 'eligibility', label: 'Eligibility' }] : []),
        ...(event.perks?.length > 0 ? [{ id: 'perks', label: 'Perks' }] : []),
        ...(event.organizers?.length > 0 ? [{ id: 'organizers', label: 'Organizers' }] : []),
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Banner Section */}
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 pt-20 md:pt-24">
                <div className="relative w-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-lg border border-slate-100 bg-slate-50 flex items-center justify-center group">
                    {(event.banner_url || event.image_url) ? (
                        <img
                            src={event.banner_url || event.image_url}
                            alt={event.title}
                            className="w-full h-auto object-contain max-h-[500px]"
                        />
                    ) : (
                        <Zap className="w-20 h-20 text-slate-200" />
                    )}
                </div>
            </div>

            {/* Header Info Section */}
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 py-8 md:py-10 relative z-20">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10 flex-grow">
                        {/* Logo */}
                        <div className="flex-shrink-0 w-[85px] h-[85px] sm:w-[130px] sm:h-[135px] rounded-full bg-white p-1 shadow-md border-2 border-white flex items-center justify-center overflow-hidden">
                            {event.logo_url ? (
                                <img src={event.logo_url} alt={event.title} className="w-full h-full object-contain rounded-full" />
                            ) : (
                                <Zap className="w-10 h-10 text-indigo-500" />
                            )}
                        </div>

                        {/* Title & Info */}
                        <div className="text-left space-y-3 max-w-[665px]">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-5xl font-roboto font-bold text-slate-900 tracking-tight leading-tight">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${event.status === 'upcoming' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        event.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'upcoming' ? 'bg-emerald-500' :
                                            event.status === 'open' ? 'bg-blue-500' : 'bg-slate-500'
                                            }`} />
                                        {event.status}
                                    </span>
                                    {event.mode && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-wider rounded-lg border border-indigo-100">
                                            {event.mode}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {event.description && (
                                <p className="text-slate-500 font-medium text-base leading-relaxed max-w-3xl">
                                    {event.description}
                                </p>
                            )}

                            {/* Metadata Row */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-2 text-slate-900 font-bold text-sm">
                                {event.date && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                )}
                                {event.location && (
                                    <div className="flex items-center gap-2 sm:border-l border-slate-200 sm:pl-5">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                                {event.attendees_count > 0 && (
                                    <div className="flex items-center gap-2 sm:border-l border-slate-200 sm:pl-5">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        <span>{event.attendees_count}+ Registered</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right CTA */}
                    <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-[250px] pt-4">
                        {event.prize && (
                            <div className="text-center lg:text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prize Pool</p>
                                <p className="text-xl md:text-2xl font-black text-nerdBlue">{event.prize}</p>
                            </div>
                        )}

                        {hasRegLink ? (
                            <a
                                href={event.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-nerdBlue hover:bg-nerdDark text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-nerdBlue/30 text-center transform hover:-translate-y-1"
                            >
                                Register Now
                            </a>
                        ) : (
                            <button disabled className="w-full bg-slate-100 text-slate-400 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest cursor-not-allowed">
                                Registration Closed
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Navigation Bar */}
            <div className="sticky top-[64px] z-50 bg-nerdBlue shadow-xl text-white">
                <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0 h-16">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={(e) => {
                                    setActiveTab(tab.id);
                                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                                    const el = document.getElementById('content-area');
                                    if (el) {
                                        const top = el.getBoundingClientRect().top + window.pageYOffset - 140;
                                        window.scrollTo({ top, behavior: 'smooth' });
                                    }
                                }}
                                className={`
                                    relative h-full px-4 sm:px-6 flex items-center text-xs sm:text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors
                                    ${activeTab === tab.id ? 'text-white bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10'}
                                `}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-nerdLime shadow-[0_0_8px_#9BE600]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 py-12" id="content-area">
                <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-0">

                    {/* LEFT SIDEBAR (Sticky Info) */}
                    <div className="md:col-span-4 lg:col-span-4 md:pr-8 lg:pr-12 md:border-r border-slate-100 pb-12">
                        <div className="md:sticky top-[140px] space-y-8">
                            {/* Event Card */}
                            <div className="space-y-6">
                                <div className="w-20 h-20 rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center">
                                    {event.logo_url ? (
                                        <img src={event.logo_url} alt={event.title} className="w-full h-full object-contain" />
                                    ) : (
                                        <Zap className="text-indigo-600" size={24} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{event.title}</h2>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">{event.description}</p>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    {hasRegLink ? (
                                        <a
                                            href={event.registration_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center bg-nerdBlue hover:bg-nerdDark text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                        >
                                            Register Now
                                        </a>
                                    ) : (
                                        <div className="w-full bg-slate-100 text-slate-400 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-center">
                                            Closed
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Organizers List Sidebar */}
                            {event.organizers && event.organizers.length > 0 && (
                                <div className="pt-8 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Event Organizers</p>
                                    <div className="space-y-4">
                                        {event.organizers.map((org: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                                                    {org.logo_url ? (
                                                        <img src={org.logo_url} alt={org.name} className="w-full h-full object-contain p-1" />
                                                    ) : (
                                                        <Users className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900 text-sm truncate">{org.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{org.role || 'Organizer'}</p>
                                                    {org.social_links && org.social_links.length > 0 && (
                                                        <div className="flex gap-2 mt-1">
                                                            {org.social_links.map((link: any, i: number) => (
                                                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-nerdBlue transition-colors">
                                                                    {link.platform === 'linkedin' && <Linkedin size={12} />}
                                                                    {link.platform === 'twitter' && <Twitter size={12} />}
                                                                    {link.platform === 'github' && <Github size={12} />}
                                                                    {link.platform === 'instagram' && <Instagram size={12} />}
                                                                    {link.platform === 'website' && <Globe size={12} />}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sidebar Metadata */}
                            <div className="space-y-4 pt-8 border-t border-slate-50">
                                {event.mode && (
                                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <span>{event.mode}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <span className="capitalize">{event.event_type?.replace(/-/g, ' ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="md:col-span-8 lg:col-span-8 md:pl-8 lg:pl-16 pt-8 md:pt-0">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-12">
                                    <div className="bg-white rounded-[2rem] p-6 sm:p-10 border border-slate-100 shadow-sm">
                                        <h2 className="text-3xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-50">About Event</h2>
                                        {event.about ? (
                                            <div
                                                className="prose prose-lg prose-slate prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: event.about }}
                                            />
                                        ) : (
                                            <p className="text-slate-500 italic">No details provided.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* PROCESS TAB */}
                            {activeTab === 'process' && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-8">How it Works</h2>
                                    <div className="space-y-6">
                                        {event.format_process.map((step: any, i: number) => (
                                            <div key={i} className="flex gap-6 group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform">
                                                        {i + 1}
                                                    </div>
                                                    {i !== event.format_process.length - 1 && (
                                                        <div className="w-0.5 flex-1 bg-slate-100 my-2" />
                                                    )}
                                                </div>
                                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex-1 hover:shadow-md transition-shadow pb-8">
                                                    <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
                                                    <p className="text-slate-500 leading-relaxed">{step.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* RULES TAB */}
                            {activeTab === 'rules' && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-8">Rules & Guidelines</h2>
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="grid grid-cols-1 gap-6 relative z-10">
                                            {event.rules.map((rule: string, i: number) => (
                                                <div key={i} className="flex gap-4 items-start">
                                                    <CheckCircle className="w-6 h-6 text-nerdLime shrink-0 mt-0.5" />
                                                    <p className="text-slate-300 font-medium text-lg leading-relaxed">{rule}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ELIGIBILITY TAB */}
                            {activeTab === 'eligibility' && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-8">Eligibility</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {event.eligibilities.map((item: any, i: number) => (
                                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                                                <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                                                <p className="text-slate-500 leading-relaxed">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PERKS TAB */}
                            {activeTab === 'perks' && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-8">Perks & Benefits</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {event.perks.map((item: any, i: number) => (
                                            <div key={i} className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ORGANIZERS TAB (Mobile view mainly, or redundant but detailed view) */}
                            {activeTab === 'organizers' && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-8">Hosts & Organizers</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {event.organizers.map((org: any, i: number) => (
                                            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 p-2">
                                                    {org.logo_url ? <img src={org.logo_url} className="w-full h-full object-contain" /> : <Users className="text-slate-300" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-lg">{org.name}</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{org.role}</p>
                                                    {org.social_links && org.social_links.length > 0 && (
                                                        <div className="flex gap-2 mt-2">
                                                            {org.social_links.map((link: any, idx: number) => (
                                                                <a
                                                                    key={idx}
                                                                    href={link.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-slate-400 hover:text-nerdBlue transition-colors"
                                                                >
                                                                    <ExternalLink size={12} />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OtherEventDetailPage;
