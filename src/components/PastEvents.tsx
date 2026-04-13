import { useAppData } from '../context/AppDataContext';
import { MapPin, Calendar } from 'lucide-react';

const PastEvents = () => {
  const { pastEvents, loading } = useAppData();

  if (loading) {
    return (
      <section id="past-events" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="h-16 w-64 bg-slate-100 animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] w-full bg-slate-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!pastEvents || pastEvents.length === 0) return null;

  const publicPastEvents = pastEvents.filter(e => (e as any).is_public !== false);

  if (publicPastEvents.length === 0) return null;

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
          <div className="hidden sm:flex bg-slate-50 px-6 py-3 rounded-full border border-slate-100 items-center gap-3">
            <span className="text-nerdBlue font-black text-xl">{publicPastEvents.length}</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Completed</span>
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
                    <Calendar size={12} className="text-nerdLime" />
                    <span>{event.dates || 'Past Event'}</span>
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
    </section>
  );
};

export default PastEvents;
