import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const EventsPage = () => {
    const { pastEvents, loading, navigate } = useAppData();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const publicPastEvents = pastEvents.filter(e => (e as any).is_public !== false);

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
                </div>
            </header>

            {/* ── EVENT CALENDAR SECTION ── */}
            <section className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
                    <div className="flex flex-col gap-12">
                        {/* Luma Calendar Embed */}
                        <div className="w-full flex flex-col">
                            <div className="mb-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Calendar className="text-nerdBlue" size={24} />
                                    <h2 className="text-2xl md:text-3xl font-bold text-nerdBlue uppercase tracking-tighter">Event Calendar</h2>
                                </div>
                                <p className="text-slate-500 text-sm md:text-base font-medium">Check out our upcoming schedule and register directly on Luma.</p>
                            </div>
                            <div className="w-full min-h-[600px] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-xl shadow-slate-200/50 bg-white relative group">
                                <div className="absolute inset-0 bg-slate-50 animate-pulse -z-10" />
                                <iframe
                                    src="https://luma.com/embed/calendar/cal-RnzTQXOxDIzD7SU/events"
                                    width="100%"
                                    height="600"
                                    frameBorder="0"
                                    style={{ border: 'none' }}
                                    allowFullScreen
                                    aria-hidden="false"
                                    tabIndex={0}
                                    className="relative z-10 w-full"
                                />
                            </div>
                        </div>

                        {/* Past Events Section */}
                        {!loading && publicPastEvents.length > 0 && (
                            <div className="w-full pt-12 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-nerdBlue uppercase tracking-tighter">Past Events</h2>
                                        <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mt-1">Our journey of impact so far</p>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                        <span className="text-nerdBlue font-black text-sm">{publicPastEvents.length}</span>
                                        <span className="text-slate-400 font-bold text-[10px] ml-2 uppercase tracking-widest">Completed</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {publicPastEvents.map((event, idx) => (
                                        <div 
                                            key={idx} 
                                            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-nerdLime/50 hover:shadow-2xl hover:shadow-nerdBlue/10 transition-all duration-500 flex flex-col h-full"
                                        >
                                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                                                <img 
                                                    src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} 
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-white/90 backdrop-blur-md text-nerdBlue text-[10px] font-black px-3 py-1 rounded-full border border-white shadow-sm uppercase tracking-widest">
                                                        {event.event_type || 'Workshop'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="text-xl font-black text-nerdBlue mb-3 group-hover:text-nerdLime transition-colors line-clamp-1">{event.title}</h3>
                                                <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 flex-1">
                                                    {event.description || 'Exploring technology and innovation with the community.'}
                                                </p>
                                                <div className="flex flex-wrap gap-4 items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} className="text-nerdLime" />
                                                        <span>{event.date || 'Past Event'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={12} className="text-nerdLime" />
                                                        <span>{event.location || 'Delhi, NCR'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EventsPage;
