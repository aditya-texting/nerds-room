import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { supabase } from '../supabaseClient';
import { QrCode, Calendar } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface Hackathon {
  id: number;
  title: string;
  slug: string;
  organizer: string;
  timeLeft?: string;
  mode: 'Online' | 'In-person';
  prize: string;
  participants?: string;
  tags: string[];
  dates?: string;
  logo?: string;
  status: 'upcoming' | 'open' | 'ended';
  is_featured: boolean;
  registration_link?: string;
  registration_type?: 'external' | 'managed';
  managed_form_id?: string;
  managed_by_nerds?: boolean;
  length_category?: 'short' | 'medium' | 'long';
  is_public?: boolean;
  description?: string;
  about?: string;
}

// Icons Component
const Icons = {
  X: ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};


const HackathonsPage = () => {
  const { hackathons: dbHackathons, navigate } = useAppData();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  // Map database hackathons to component format
  const hackathons: Hackathon[] = useMemo(() => dbHackathons
    .filter(h => h.is_public !== false)
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    })
    .map(h => ({
      id: h.id,
      title: h.title,
      slug: h.slug,
      organizer: h.organizer,
      timeLeft: h.time_left || 'TBA',
      mode: h.mode,
      prize: h.prize,
      participants: h.participants || '0',
      tags: h.tags || [],
      dates: h.dates || 'TBA',
      logo: h.logo_url,
      status: h.status,
      is_featured: !!h.is_featured,
      registration_link: h.registration_link,
      registration_type: h.registration_type || 'external',
      managed_form_id: h.managed_form_id,
      managed_by_nerds: h.managed_by_nerds,
      length_category: h.length_category,
      is_public: h.is_public
    })), [dbHackathons]);

  const [userRegistrations, setUserRegistrations] = useState<Record<string, any>>({});
  const [showTicket, setShowTicket] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<any>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
        setUserRegistrations({});
        return;
      }

      const email = user.primaryEmailAddress.emailAddress;

      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('email', email);

        if (error) throw error;

        const updates: Record<string, any> = {};
        if (data) {
          data.forEach(reg => {
            const hack = dbHackathons.find(h => h.id === reg.hackathon_id);
            if (hack) {
              updates[hack.slug] = { isRegistered: true, status: reg.status, ...reg };
            }
          });
        }
        setUserRegistrations(updates);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      }
    };

    fetchRegistrations();
  }, [isSignedIn, user, dbHackathons]);

  const [search, setSearch] = useState('');
  const [matchEligibility, setMatchEligibility] = useState(false);
  const [managedByNerds, setManagedByNerds] = useState(false);
  const [locationFilters, setLocationFilters] = useState<{ online: boolean; inPerson: boolean }>({
    online: false,
    inPerson: false,
  });
  const [statusFilters, setStatusFilters] = useState<{ upcoming: boolean; open: boolean; ended: boolean }>({
    upcoming: false,
    open: false,
    ended: false,
  });
  const [lengthFilters, setLengthFilters] = useState<{ short: boolean; medium: boolean; long: boolean }>({
    short: false,
    medium: false,
    long: false,
  });
  const [interestTags, setInterestTags] = useState<{ [key: string]: boolean }>({});
  const [openTo, setOpenTo] = useState<{ public: boolean; inviteOnly: boolean }>({
    public: false,
    inviteOnly: false,
  });
  const [sortBy, setSortBy] = useState<'relevant' | 'date' | 'recent' | 'prize'>('relevant');
  const [selectedHost, setSelectedHost] = useState<string>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allTags = Array.from(new Set(hackathons.flatMap(h => h.tags))).sort();
  const allHosts = Array.from(new Set(hackathons.map(h => h.organizer))).sort();

  const filtered = useMemo(() => {
    return hackathons.filter((hack) => {
      const matchesSearch =
        !search ||
        hack.title.toLowerCase().includes(search.toLowerCase()) ||
        hack.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

      const matchesLocation =
        (!locationFilters.online && !locationFilters.inPerson) ||
        (locationFilters.online && hack.mode === 'Online') ||
        (locationFilters.inPerson && hack.mode === 'In-person');

      const matchesStatus =
        (!statusFilters.upcoming && !statusFilters.open && !statusFilters.ended) ||
        (statusFilters.upcoming && hack.status === 'upcoming') ||
        (statusFilters.open && hack.status === 'open') ||
        (statusFilters.ended && hack.status === 'ended');

      const matchesManaged = !managedByNerds || hack.managed_by_nerds;

      const matchesInterests = Object.keys(interestTags).filter(t => interestTags[t]).length === 0 ||
        Object.keys(interestTags).filter(t => interestTags[t]).some(t => hack.tags.includes(t));

      const matchesLength = (!lengthFilters.short && !lengthFilters.medium && !lengthFilters.long) ||
        (lengthFilters.short && hack.length_category === 'short') ||
        (lengthFilters.medium && hack.length_category === 'medium') ||
        (lengthFilters.long && hack.length_category === 'long');

      const matchesOpenTo = (!openTo.public && !openTo.inviteOnly) ||
        (openTo.public && hack.is_public !== false) ||
        (openTo.inviteOnly && hack.is_public === false);

      const matchesHost = selectedHost === 'all' || hack.organizer === selectedHost;

      return matchesSearch && matchesLocation && matchesStatus && matchesManaged && matchesInterests && matchesLength && matchesOpenTo && matchesHost;
    });
  }, [hackathons, search, locationFilters, statusFilters, managedByNerds, interestTags, lengthFilters, openTo, selectedHost]);

  const activeFilterCount =
    (locationFilters.online ? 1 : 0) +
    (locationFilters.inPerson ? 1 : 0) +
    (statusFilters.upcoming ? 1 : 0) +
    (statusFilters.open ? 1 : 0) +
    (statusFilters.ended ? 1 : 0) +
    (lengthFilters.short ? 1 : 0) +
    (lengthFilters.medium ? 1 : 0) +
    (lengthFilters.long ? 1 : 0) +
    Object.values(interestTags).filter(Boolean).length +
    (openTo.public ? 1 : 0) +
    (openTo.inviteOnly ? 1 : 0) +
    (managedByNerds ? 1 : 0) +
    (selectedHost !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setLocationFilters({ online: false, inPerson: false });
    setStatusFilters({ upcoming: false, open: false, ended: false });
    setLengthFilters({ short: false, medium: false, long: false });
    setInterestTags({});
    setOpenTo({ public: false, inviteOnly: false });
    setManagedByNerds(false);
    setSelectedHost('all');
  };

  // Intersection Observer for card reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      <Navbar />

      {/* Header */}
      <header
        className="relative pt-32 lg:pt-48 pb-20 lg:pb-32 px-4 sm:px-6 md:px-8 overflow-hidden bg-nerdBlue"
        style={{
          backgroundImage: 'url("/hackathon-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay with Gradient to White transition at bottom */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-nerdBlue/70 via-nerdBlue/40 to-white"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl">
            BUILD. COMPETE. <br />
            <span className="text-nerdLime">WIN BIG.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-white text-base md:text-lg mb-10 font-bold leading-relaxed drop-shadow-md">
            Discover elite hackathons, form powerhouse teams, and turn your vision into impact. Join the community of elite builders.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-lg mx-auto">
            <div className="relative flex-1 w-full group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hackathons, tags, or hosts..."
                className="w-full px-5 py-4 pl-12 rounded-2xl border-none bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-nerdLime/30 shadow-2xl transition-all font-semibold text-sm placeholder:text-slate-400"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-nerdBlue transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="w-full sm:w-auto px-10 py-4 bg-nerdLime text-nerdBlue rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95 text-xs">
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Filter bar + Sort */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-[72px] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center gap-4 justify-between">
            {/* Left side - Filters Toggle & Count */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all group"
              >
                <svg className="w-4 h-4 text-slate-600 group-hover:text-nerdBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-nerdBlue text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black animate-in zoom-in">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-nerdBlue transition-colors"
                  >
                    Clear filters
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eligibility</span>
                  <button
                    onClick={() => setMatchEligibility(!matchEligibility)}
                    className={`relative w-10 h-5 rounded-full transition-all duration-300 border-2 ${matchEligibility ? 'bg-nerdLime border-nerdLime' : 'bg-slate-100 border-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-all duration-300 ${matchEligibility ? 'translate-x-5 bg-nerdBlue' : 'translate-x-0 bg-white'}`} />
                  </button>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full border-2 transition-all relative ${managedByNerds ? 'bg-nerdBlue border-nerdBlue' : 'bg-slate-100 border-slate-200'}`}>
                    <input type="checkbox" checked={managedByNerds} onChange={(e) => setManagedByNerds(e.target.checked)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${managedByNerds ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-nerdBlue">Managed</span>
                </label>
              </div>
            </div>

            {/* Right side - Count & Sort */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-tight">
                <span className="text-slate-900">{filtered.length}</span> Results
              </span>
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-slate-400">Sort</span>
                <select
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-nerdBlue/10 transition-all cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="relevant">Relevant</option>
                  <option value="date">Date</option>
                  <option value="recent">Recent</option>
                  <option value="prize">Prize</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Discord CTA Box */}
        {/* Quick Filters - Chips (Mobile Only) */}
        <div className="lg:hidden flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => setStatusFilters({ upcoming: false, open: true, ended: false })}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${statusFilters.open ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 border-slate-100'}`}
          >
            ● Open Now
          </button>
          <button
            onClick={() => setStatusFilters({ upcoming: true, open: false, ended: false })}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${statusFilters.upcoming ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200' : 'bg-white text-slate-500 border-slate-100'}`}
          >
            ● Upcoming
          </button>
          <button
            onClick={() => setManagedByNerds(!managedByNerds)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${managedByNerds ? 'bg-nerdBlue text-white border-nerdBlue shadow-lg shadow-nerdBlue/20' : 'bg-white text-slate-500 border-slate-100'}`}
          >
            Managed
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap bg-white text-slate-400 border-2 border-slate-100"
          >
            Reset
          </button>
        </div>

        {/* Discord CTA Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-6 group hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
            </div>
            <div>
              <p className="text-sm text-slate-900 font-bold mb-1">Join the Nerds Squad</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Bridge the gap between coding and winning. Elite teams are forming now.</p>
            </div>
          </div>
          <button
            onClick={() => window.open('https://discord.gg/QNqAF3kRFz', '_blank')}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95 whitespace-nowrap"
          >
            Join Discord
          </button>
        </div>

        {/* Container: Filters + List */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Drawer Backdrop */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Filters Sidebar - Becomes Bottom Sheet on Mobile */}
          <aside
            className={`
              fixed inset-x-0 bottom-0 bg-white z-[120] rounded-t-[3rem] p-10 overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.15)] h-[90vh] lg:static lg:block lg:w-60 lg:p-0 lg:bg-transparent lg:z-auto lg:translate-y-0 lg:h-auto
              ${showMobileFilters ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100'}
            `}
          >
            {/* Grabber Handle */}
            <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-10 lg:hidden" />

            <div className="flex items-center justify-between mb-12 lg:hidden">
              <div>
                <h3 className="text-3xl font-black text-nerdBlue leading-none">Filters</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Refine Search</p>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-14 h-14 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-slate-100 transition-all text-slate-400 shadow-sm"
              >
                <Icons.X className="w-7 h-7" />
              </button>
            </div>
            <div className="space-y-3 bg-transparent">

              {/* Location */}
              <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Location</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={locationFilters.online}
                      onChange={(e) =>
                        setLocationFilters((prev) => ({ ...prev, online: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">Online</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={locationFilters.inPerson}
                      onChange={(e) =>
                        setLocationFilters((prev) => ({ ...prev, inPerson: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">In-person</span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Status</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={statusFilters.upcoming}
                      onChange={(e) =>
                        setStatusFilters((prev) => ({ ...prev, upcoming: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                      Upcoming
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={statusFilters.open}
                      onChange={(e) =>
                        setStatusFilters((prev) => ({ ...prev, open: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#22b8a0] animate-pulse"></span>
                      Open
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={statusFilters.ended}
                      onChange={(e) =>
                        setStatusFilters((prev) => ({ ...prev, ended: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      Ended
                    </span>
                  </label>
                </div>
              </div>

              {/* Length */}
              <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Length</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={lengthFilters.short}
                      onChange={(e) => setLengthFilters(prev => ({ ...prev, short: e.target.checked }))}
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">1–6 days</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={lengthFilters.medium}
                      onChange={(e) => setLengthFilters(prev => ({ ...prev, medium: e.target.checked }))}
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">1–4 weeks</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={lengthFilters.long}
                      onChange={(e) => setLengthFilters(prev => ({ ...prev, long: e.target.checked }))}
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">1+ month</span>
                  </label>
                </div>
              </div>

              {/* Interest tags */}
              <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Interest tags</h4>
                <div className="space-y-3">
                  {allTags.slice(0, 10).map(
                    (tag) => (
                      <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={interestTags[tag] || false}
                          onChange={(e) =>
                            setInterestTags((prev) => ({ ...prev, [tag]: e.target.checked }))
                          }
                          className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                        />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">{tag}</span>
                      </label>
                    )
                  )}
                  {allTags.length > 10 && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 italic">+{allTags.length - 10} more tags found</p>
                  )}
                </div>
              </div>

              {/* Host */}
              <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Host</h4>
                <select
                  value={selectedHost}
                  onChange={(e) => setSelectedHost(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-nerdBlue focus:border-nerdBlue transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="all">All Hosts</option>
                  {allHosts.map(host => (
                    <option key={host} value={host}>{host}</option>
                  ))}
                </select>
              </div>

              {/* Open to */}
              <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Open to</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={openTo.public}
                      onChange={(e) =>
                        setOpenTo((prev) => ({ ...prev, public: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">Public</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={openTo.inviteOnly}
                      onChange={(e) =>
                        setOpenTo((prev) => ({ ...prev, inviteOnly: e.target.checked }))
                      }
                      className="w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-nerdBlue transition-all"
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-nerdBlue transition-colors">Invite only</span>
                  </label>
                </div>
              </div>


              {showMobileFilters && (
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-6 py-4 bg-nerdBlue text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] lg:hidden mb-12 shadow-xl shadow-nerdBlue/20"
                >
                  Apply Filters
                </button>
              )}
            </div>
          </aside>

          {/* Hackathon List */}
          <section className="flex-1 space-y-6 lg:space-y-8">
            {filtered.map((hack, index) => (
              <div
                key={hack.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="hackathon-card bg-white flex flex-col md:flex-row items-stretch border border-slate-100 hover:border-nerdLime hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group rounded-[2rem] md:rounded-[2.5rem]"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/hackathons/${hack.slug}`);
                }}
              >
                {/* Featured Glow */}
                {hack.is_featured && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-nerdLime/20 rounded-full blur-2xl group-hover:bg-nerdLime/30 transition-all"></div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col sm:flex-row p-5 md:p-6 lg:p-7 gap-5 lg:gap-8">
                  {/* LOGO */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden group-hover:border-nerdLime/40 transition-all p-3 group-hover:-translate-y-1 duration-700 ease-out shadow-inner">
                      {hack.logo ? (
                        <img src={hack.logo} alt={hack.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-slate-200">NR</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CENTER INFO */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {hack.is_featured && (
                          <span className="bg-nerdBlue text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">Featured</span>
                        )}
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{hack.organizer}</span>
                      </div>
                      <h3 className="text-nerdDark text-lg sm:text-xl lg:text-xl font-black mb-2 tracking-normal group-hover:text-nerdBlue transition-all leading-snug">
                        {hack.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center bg-nerdLime/10 text-nerdBlue px-2 py-1 rounded-lg text-[9px] font-black">
                          <div className="w-1 h-1 rounded-full bg-nerdLime mr-1.5 animate-pulse"></div>
                          {hack.timeLeft}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{hack.mode}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {hack.description && (
                        <p className="text-slate-500 text-[11px] mt-4 leading-relaxed line-clamp-2 font-medium max-w-[65ch]">
                          {hack.description}
                        </p>
                      )}

                      {/* Tags */}
                      {hack.tags && hack.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {hack.tags.map((tag) => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-[0.1em] bg-indigo-50/50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100/30">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {hack.length_category && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
                          {hack.length_category === 'short' ? '⚡ Short Format' : hack.length_category === 'medium' ? '🗓️ Medium Pack' : '🏆 Marathon'}
                        </span>
                      )}
                      {hack.managed_by_nerds && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100/50 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Nerds Managed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-4 mt-5 pt-5 border-t border-slate-100 w-full relative">
                      {/* Subtle accent border */}
                      <div className="absolute top-0 left-0 w-12 h-1 bg-nerdBlue rounded-full -translate-y-1/2"></div>

                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em] mb-2">Prize Pool</span>
                        <span className="text-nerdDark font-black text-lg lg:text-xl tracking-tight leading-none">
                          {hack.prize}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em] mb-2">Participants</span>
                        <span className="text-nerdDark font-black text-lg lg:text-xl tracking-tight leading-none">
                          {hack.participants}+
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.1em] mb-2">Event Status</span>
                        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 ${hack.status === 'open' ? 'text-emerald-500' : 'text-orange-500'}`}>
                          <span className="w-2 h-2 rounded-full bg-current shadow-lg shadow-current/20"></span>
                          {hack.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL - ACTIONS */}
                <div className="w-full md:w-56 lg:w-60 bg-slate-50/30 p-5 md:p-5 lg:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100/80 transition-all">
                  <div className="hidden md:block mb-4">
                    <div className="flex items-start gap-3 text-slate-400 mb-2">
                      <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
                        <svg className="w-4 h-4 text-nerdBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-2">Schedule</p>
                        <p className="text-[13px] font-black text-slate-700 leading-relaxed break-words">{hack.dates}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full h-px bg-slate-100 mb-4 hidden md:block"></div>
                    {(hack.registration_link || hack.registration_type === 'managed' || userRegistrations[hack.slug]?.isRegistered) && (
                      <div className="flex gap-2">
                        {userRegistrations[hack.slug]?.status === 'approved' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingTicket({ ...userRegistrations[hack.slug], hackathon_title: hack.title, hackathon_dates: hack.dates });
                              setShowTicket(true);
                            }}
                            className="p-4 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center min-w-[56px]"
                            title="View Ticket"
                          >
                            <QrCode size={20} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSignedIn) {
                              openSignIn();
                              return;
                            }
                            if (hack.registration_type === 'managed') {
                              window.location.href = `/hackathons/${hack.slug}${userRegistrations[hack.slug]?.isRegistered ? '' : '?register=true'}`;
                            } else if (hack.registration_link) {
                              window.open(hack.registration_link, '_blank');
                            }
                          }}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.96] flex items-center justify-center gap-2 group/btn ${userRegistrations[hack.slug]?.status === 'approved'
                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                            : userRegistrations[hack.slug]?.status === 'rejected'
                              ? 'bg-red-500 text-white shadow-red-200'
                              : userRegistrations[hack.slug]?.isRegistered
                                ? 'bg-nerdBlue text-white shadow-nerdBlue/20'
                                : 'bg-nerdDark text-white hover:bg-nerdBlue shadow-nerdDark/20'
                            }`}
                        >
                          {userRegistrations[hack.slug]?.status === 'approved' && (
                            <svg className="w-4 h-4 animate-in zoom-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>
                            {userRegistrations[hack.slug]?.status === 'approved'
                              ? 'Approved'
                              : userRegistrations[hack.slug]?.status === 'rejected'
                                ? 'Rejected'
                                : userRegistrations[hack.slug]?.isRegistered
                                  ? 'Registered'
                                  : 'Register Now'}
                          </span>
                        </button>
                      </div>
                    )}
                    <p className="text-[8px] text-slate-400 text-center font-black uppercase tracking-[0.2em] opacity-30 mt-4">System Identity Verified</p>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white p-8 rounded-lg text-center text-slate-600">
                No hackathons match your filters. Try adjusting your search or filters.
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Ticket Modal */}
      {
        showTicket && viewingTicket && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg" onClick={() => setShowTicket(false)} />

            <div className="bg-[#0a0a0a] rounded-[2.5rem] w-full max-w-[340px] sm:max-w-sm relative z-10 overflow-hidden border border-white/10 shadow-3xl animate-in zoom-in-95 fade-in duration-300">
              {/* Top Glossy Gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

              <div className="p-6 sm:p-8 pb-4">
                <div className="bg-white p-3 sm:p-4 rounded-3xl aspect-square flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.15)] relative z-10">
                  <div className="w-full h-full">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        ticket_id: viewingTicket.ticket_token || viewingTicket.id,
                        name: viewingTicket.name,
                        email: viewingTicket.email,
                        hackathon: viewingTicket.hackathon_title
                      })}
                      size={window.innerWidth < 400 ? 180 : 220}
                      level="H"
                      includeMargin={false}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-4 space-y-5 sm:space-y-6 relative z-10">
                <div className="space-y-1.5">
                  <h3 className="text-white font-bold text-lg sm:text-xl leading-tight line-clamp-2">
                    {viewingTicket.hackathon_title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-xs font-medium">
                    <Calendar size={12} className="text-indigo-400" />
                    {viewingTicket.hackathon_dates}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Attendee</p>
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{viewingTicket.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Access Tier</p>
                    <p className="text-indigo-400 font-bold text-xs sm:text-sm truncate uppercase tracking-tighter">Approved</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowTicket(false)}
                    className="w-full py-3.5 sm:py-4 rounded-2xl bg-white text-black font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>

              {/* Bottom Glow */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        )
      }
      <Footer />
    </div>
  );
};


export default HackathonsPage;
