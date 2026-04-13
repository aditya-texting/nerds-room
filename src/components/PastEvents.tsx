import { useAppData } from '../context/AppDataContext';
import { MapPin, Calendar, Users, Rocket, Globe, Award } from 'lucide-react';

const PastEvents = () => {
  const { 
    pastEvents = [], 
    loading = false, 
    totalRegs = 0, 
    chapters = [], 
    workshops = [], 
    flagshipEvents = [], 
    otherEvents = [] 
  } = useAppData();

  const publicPastEvents = pastEvents?.filter(e => (e as any).is_public !== false) || [];
  
  // Calculate community stats
  const stats = {
    participants: totalRegs > 500 ? totalRegs : "500+",
    events: (pastEvents?.length || 0) + (flagshipEvents?.length || 0) + (workshops?.length || 0) + (otherEvents?.length || 0),
    cities: chapters?.length || 5,
    chapters: chapters?.length || 3
  };

  return (
    <section id="past-events" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col gap-12">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-nerdBlue uppercase tracking-tighter leading-tight">
              PAST<br />EVENTS
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mt-3">Our journey of impact so far</p>
          </div>
          {!loading && publicPastEvents.length > 0 && (
            <div className="hidden sm:flex bg-slate-50 px-6 py-3 rounded-full border border-slate-100 items-center gap-3">
              <span className="text-nerdBlue font-black text-xl">{publicPastEvents.length}</span>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Completed</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Community Stats Card - Always Visible */}
          <div className="relative group bg-nerdBlue rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between min-h-[400px] border border-nerdBlue shadow-2xl shadow-nerdBlue/20">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-nerdLime/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-nerdLime/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8">
                <Award size={16} className="text-nerdLime" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Our Impact</span>
              </div>
              <h3 className="text-3xl font-black text-white leading-tight mb-4">
                BUILDING THE <br />
                <span className="text-nerdLime">NEXT GEN</span> <br />
                COMMUNITY
              </h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed max-w-[240px]">
                Empowering students across the nation to innovate, create, and lead in technology.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-y-8 mt-8 border-t border-white/10 pt-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-nerdLime">
                  <Users size={16} />
                  <span className="text-2xl font-black text-white">{loading ? '...' : stats.participants}</span>
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Participants</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-nerdLime">
                  <Rocket size={16} />
                  <span className="text-2xl font-black text-white">{loading ? '...' : stats.events}</span>
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Events Hosted</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-nerdLime">
                  <Globe size={16} />
                  <span className="text-2xl font-black text-white">{loading ? '...' : stats.cities}</span>
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cities Covered</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-nerdLime">
                  <Award size={16} />
                  <span className="text-2xl font-black text-white">{loading ? '...' : stats.chapters}</span>
                </div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Chapters</span>
              </div>
            </div>
          </div>

          {/* Past Events Cards or Skeleton */}
          {loading ? (
            [1, 2].map(i => (
              <div key={i} className="h-full min-h-[400px] w-full bg-slate-50 animate-pulse rounded-[2rem] border border-slate-100" />
            ))
          ) : publicPastEvents.length > 0 ? (
            publicPastEvents.map((event, idx) => (
              <div 
                key={idx} 
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-nerdLime/50 hover:shadow-2xl hover:shadow-nerdBlue/10 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  <img 
                    src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 backdrop-blur-md text-nerdBlue text-[10px] font-black px-4 py-1.5 rounded-full border border-white shadow-lg uppercase tracking-widest">
                      {event.event_type || 'Workshop'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <button className="bg-white text-nerdBlue font-black text-xs px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-nerdLime hover:text-nerdBlue transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-2xl font-black text-nerdBlue group-hover:text-nerdLime transition-colors leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {event.description || 'Exploring technology and innovation with the community.'}
                  </p>
                  <div className="flex flex-col gap-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-nerdLime/10 transition-colors">
                        <Calendar size={14} className="text-nerdLime" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{event.dates || 'Past Event'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-nerdLime/10 transition-colors">
                        <MapPin size={14} className="text-nerdLime" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{event.location || 'Delhi, NCR'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>

        {!loading && publicPastEvents.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No past events recorded yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PastEvents;
