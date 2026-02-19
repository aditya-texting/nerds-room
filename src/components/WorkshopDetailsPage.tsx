import { useState, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { Clock, Users, Calendar, MapPin, ArrowRight, MessageCircle } from 'lucide-react';

const WorkshopDetailsPage = () => {
    const { workshops: dbWorkshops, loading, navigate } = useAppData();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [activeTab, setActiveTab] = useState('overview');

    const slug = useMemo(() => window.location.pathname.split('/').pop() || '', []);

    const workshop = useMemo(() => {
        return dbWorkshops.find(w => w.slug === slug) || null;
    }, [dbWorkshops, slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="h-[400px] bg-slate-50 animate-pulse" />
            </div>
        );
    }

    if (!workshop) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Workshop Not Found</h1>
                    <button onClick={() => navigate('/workshops')} className="text-indigo-600 font-bold uppercase tracking-widest text-sm hover:underline">Back to Workshops</button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isSignedIn) {
            openSignIn({ redirectUrl: window.location.href });
            return;
        }
        if (workshop.registration_link) {
            window.open(workshop.registration_link, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <Navbar />

            {/* Premium Hero Header */}
            <header className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={workshop.banner_url || workshop.image_url} alt="" className="w-full h-full object-cover opacity-10 blur-xl scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Poster Card */}
                        <div className="w-full lg:w-1/3 shrink-0">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                                    <img src={workshop.image_url} alt={workshop.title} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                                {workshop.is_featured && <span className="bg-yellow-400 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-yellow-200 uppercase tracking-widest">Featured</span>}
                                <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-indigo-100 uppercase tracking-widest">Masterclass</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                {workshop.title}
                            </h1>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                                        <div className="text-sm font-bold text-slate-900">{workshop.date}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</div>
                                        <div className="text-sm font-bold text-slate-900">{workshop.location}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                                        <Users size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learners</div>
                                        <div className="text-sm font-bold text-slate-900">{workshop.attendees_count || 0}+ Enrolled</div>
                                    </div>
                                </div>
                            </div>

                            {workshop.registration_link && (
                                <button
                                    onClick={handleRegisterClick}
                                    className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-95 group"
                                >
                                    Secure Your Seat
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-100 sticky top-[72px] bg-white/80 backdrop-blur-xl z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide py-4 items-center justify-center lg:justify-start">
                        {[
                            { id: 'overview', label: 'OVERVIEW' },
                            ...((workshop.schedule?.length || 0) > 0 ? [{ id: 'curriculum', label: 'CURRICULUM' }] : []),
                            ...((workshop.mentors?.length || 0) > 0 ? [{ id: 'mentors', label: 'MENTORS' }] : []),
                            ...((workshop.faq?.length || 0) > 0 ? [{ id: 'faq', label: 'FAQ' }] : [])
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <main className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left/Main Column */}
                    <div className="lg:col-span-2 space-y-20">

                        {/* OVERVIEW */}
                        {activeTab === 'overview' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                    Workshop Overview
                                </h2>
                                <div className="max-w-3xl">
                                    <div className="prose prose-slate prose-lg font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {workshop.about ? (
                                            <div dangerouslySetInnerHTML={{ __html: workshop.about.replace(/\n/g, '<br/>') }} />
                                        ) : (
                                            <p>{workshop.description}</p>
                                        )}
                                    </div>
                                </div>

                                {workshop.topics && workshop.topics.length > 0 && (
                                    <div className="mt-12">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-left">Key Highlights</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {workshop.topics.map((topic, i) => (
                                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-all">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm font-black text-sm">{i + 1}</div>
                                                    <span className="font-bold text-slate-700">{topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* CURRICULUM */}
                        {activeTab === 'curriculum' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3 text-left">
                                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                    Expert Roadmap
                                </h2>
                                {workshop.schedule && workshop.schedule.length > 0 ? (
                                    <div className="space-y-6">
                                        {workshop.schedule.map((item, i) => (
                                            <div key={i} className="flex gap-6 group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black z-10">{i + 1}</div>
                                                    <div className="w-0.5 h-full bg-indigo-50 group-last:bg-transparent -mt-1" />
                                                </div>
                                                <div className="flex-1 pb-10 text-left">
                                                    <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">{item.time}</div>
                                                    <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Full Syllabus coming soon</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* MENTORS */}
                        {activeTab === 'mentors' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase tracking-tight flex items-center gap-3 text-left">
                                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                    Lead Experts
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {workshop.mentors && workshop.mentors.length > 0 ? (
                                        workshop.mentors.map((mentor, i) => (
                                            <div key={i} className="group p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center hover:bg-white hover:shadow-2xl transition-all duration-500">
                                                <div className="w-32 h-32 rounded-[2rem] overflow-hidden mb-6 border-4 border-white shadow-xl">
                                                    <img src={mentor.image_url || 'https://via.placeholder.com/150'} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900">{mentor.name}</h4>
                                                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">{mentor.role}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Expert list will be revealed soon</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* FAQ */}
                        {activeTab === 'faq' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3 text-left">
                                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                    Common Doubts
                                </h2>
                                <div className="space-y-4">
                                    {workshop.faq && workshop.faq.length > 0 ? (
                                        workshop.faq.map((item, i) => (
                                            <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-left">
                                                <h4 className="text-lg font-black text-slate-900 mb-3">{item.question}</h4>
                                                <p className="text-slate-600 font-medium leading-relaxed">{item.answer}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                            <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No questions yet. Ask us on Discord!</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <div className="bg-nerdDark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                            <div className="relative z-10 text-left">
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Live Status</div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    <span className="text-xl font-black">Registrations Open</span>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                                        <span className="text-white/50 font-medium">Difficulty</span>
                                        <span className="font-black text-indigo-400 uppercase tracking-widest">Intermediate</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                                        <span className="text-white/50 font-medium">Certification</span>
                                        <span className="font-black text-emerald-400 uppercase tracking-widest">Yes, Verified</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-4">
                                        <span className="text-white/50 font-medium">Duration</span>
                                        <span className="font-black text-purple-400 uppercase tracking-widest">3+ Hours</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRegisterClick}
                                    className="w-full bg-white text-nerdBlue py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-nerdLime transition-all transform active:scale-95"
                                >
                                    Claim Your Spot
                                </button>
                            </div>
                        </div>

                        {/* Social/Community Card */}
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200/50 text-left">
                            <h4 className="text-lg font-black text-slate-900 mb-4">Learn Together</h4>
                            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">Join our circle of 5,000+ developers to discuss topics, get help, and find collaborators.</p>
                            <a href="#" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group hover:border-indigo-600 transition-all">
                                <span className="font-bold text-slate-700">Join Community</span>
                                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default WorkshopDetailsPage;
