import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';

const EventsPage = () => {
    const { pastEvents, flagshipEvents, workshops, navigate } = useAppData();
    const [activeTab, setActiveTab] = useState<'all' | 'flagship' | 'workshops' | 'past'>('all');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredEvents = () => {
        if (activeTab === 'flagship') return flagshipEvents;
        if (activeTab === 'workshops') return workshops;
        if (activeTab === 'past') return pastEvents;
        return [...flagshipEvents, ...workshops, ...pastEvents].sort((a, b) => {
            // Simple sort by ID or title if date isn't consistent across types
            return b.id - a.id;
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            {/* Header */}
            <header className="bg-[#063b4c] text-white pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Explore Our Events</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        From flagship hackathons to skill-building workshops, discover everything happening at Nerds Room.
                    </p>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'all', label: 'All Events' },
                            { id: 'flagship', label: 'Flagship' },
                            { id: 'workshops', label: 'Workshops' },
                            { id: 'past', label: 'Past Events' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-5 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents().map((event: any, i) => (
                        <div
                            key={event.id || i}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
                        >
                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                                <img
                                    src={event.image_url || event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${'status' in event && event.status === 'ended' || activeTab === 'past' || !('status' in event) && !('date' in event) && !('dates' in event)
                                        ? 'bg-slate-900/80 text-white'
                                        : 'bg-blue-600 text-white'
                                        }`}>
                                        {'status' in event ? event.status : (activeTab === 'past' ? 'Completed' : 'Upcoming')}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                                        </svg>
                                        <span className="text-xs font-bold">{event.dates || event.date || 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-xs font-bold">{event.location}</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(n => (
                                            <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                            +
                                        </div>
                                    </div>

                                    {event.registration_link ? (
                                        <a
                                            href={event.registration_link}
                                            target={event.registration_link.startsWith('http') ? "_blank" : "_self"}
                                            className="text-blue-600 text-sm font-black uppercase tracking-widest hover:text-blue-700 flex items-center gap-2"
                                            onClick={(e) => {
                                                if (event.registration_link && !event.registration_link.startsWith('http')) {
                                                    e.preventDefault();
                                                    navigate(event.registration_link);
                                                }
                                            }}
                                        >
                                            View Details
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEvents().length === 0 && (
                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">No events found</h3>
                        <p className="text-slate-500 mt-2">Stay tuned! New events will be added soon.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default EventsPage;
