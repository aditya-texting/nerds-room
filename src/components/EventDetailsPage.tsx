import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { supabase } from '../supabaseClient';
import { Clock, Trophy, ShieldCheck, Globe, Users, Zap, QrCode, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import ParticipantBadge from './ParticipantBadge';

// --- Types ---
interface Hackathon {
  id?: number;
  title: string;
  slug: string;
  organizer: string;
  organizers?: { name: string; role?: string; logo_url?: string; social_links?: any[] }[];
  timeLeft: string;
  mode: 'Online' | 'In-person';
  prize: string;
  participants: string;
  tags: string[];
  dates: string;
  description: string;
  about?: string;
  prizes: { title: string; amount: string; description: string }[];
  rules: string[];
  resources: { name: string; link: string }[];
  logo?: string;
  banner?: string;
  managed_by_nerds?: boolean;
  registration_type?: 'external' | 'managed';
  registration_link?: string;
  managed_form_id?: string;
  auto_approve?: boolean;
  badge_image_url?: string;
  badge_enabled?: boolean;
  challenges?: { title: string; description: string; icon?: string }[];
  schedule?: { date: string; time: string; title: string; description?: string }[];
  rewards?: { title: string; description: string; image?: string }[];
  partners?: { name: string; logo: string; type: string }[];
  mentors?: { name: string; role?: string; bio?: string; image_url?: string; social_links?: any[] }[];
  jury?: { name: string; role?: string; bio?: string; image_url?: string; social_links?: any[] }[];
  faq?: { question: string; answer: string }[];
}

// --- Specialized Internal Components (Memoized for Production) ---

const LoadingSkeleton = memo(() => (
  <div className="min-h-screen bg-white">
    <Navbar />
    {/* Skeleton Header */}
    <div className="h-[480px] md:h-[650px] bg-slate-50 animate-pulse relative">
      <div className="absolute bottom-36 left-10 space-y-4 max-w-2xl">
        <div className="h-4 w-32 bg-slate-200 rounded-full" />
        <div className="h-16 w-full bg-slate-200 rounded-2xl" />
        <div className="h-16 w-3/4 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  </div>
));

const BadgeViewWrapper = memo(({ hackathon, onClose }: { hackathon: any, onClose: () => void }) => {
  return (
    <ParticipantBadge
      hackathonId={hackathon.id}
      hackathonTitle={hackathon.title}
      badgeImageUrl={hackathon.badge_image_url}
      onClose={onClose}
    />
  );
});

// --- Main Page Component ---

const EventDetailsPage = () => {
  const { hackathons: dbHackathons, registrationForms, registrations: dbRegistrations, loading, navigate } = useAppData();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [activeTab, setActiveTab] = useState('overview');
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // Derive registration state from AppData (real-time) with useMemo for performance
  const slug = useMemo(() => window.location.pathname.split('/').pop() || '', []);

  const savedEmail = useMemo(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress;
    }
    return null;
  }, [isSignedIn, user]);

  const userRegistration = useMemo(() => {
    if (!hackathon?.id || !savedEmail) return null;
    return dbRegistrations.find(r => r.hackathon_id === hackathon.id && r.email === savedEmail) || null;
  }, [hackathon?.id, dbRegistrations, savedEmail]);

  const isRegistered = useMemo(() => {
    return !!userRegistration;
  }, [userRegistration]);

  const regStatus = useMemo(() => {
    return userRegistration?.status || (isRegistered ? 'pending' : null);
  }, [userRegistration?.status, isRegistered]);

  // Sync Hackathon data from context
  useEffect(() => {
    if (loading && dbHackathons.length === 0) return;

    const dbData = dbHackathons.find(h =>
      h.slug.toLowerCase() === slug.toLowerCase() ||
      h.slug.replace(/-/g, '').toLowerCase() === slug.replace(/-/g, '').toLowerCase()
    );

    if (dbData) {
      setHackathon({
        id: dbData.id,
        title: dbData.title,
        slug: dbData.slug,
        organizer: dbData.organizer || '',
        organizers: dbData.organizers || [],
        timeLeft: dbData.time_left || 'TBA',
        mode: dbData.mode || 'Online',
        prize: dbData.prize || 'TBA',
        participants: dbData.participants || '0',
        tags: dbData.tags || [],
        dates: dbData.dates || 'TBA',
        description: dbData.description || '',
        registration_type: dbData.registration_type || (dbData.managed_form_id ? 'managed' : 'external'),
        registration_link: dbData.registration_link,
        managed_form_id: dbData.managed_form_id,
        logo: dbData.logo_url,
        banner: dbData.banner_url,
        about: dbData.about || '',
        prizes: dbData.prizes || [],
        rules: dbData.rules || [],
        resources: dbData.resources || [],
        badge_image_url: dbData.badge_image_url,
        badge_enabled: dbData.badge_enabled !== false,
        challenges: dbData.challenges || [],
        schedule: dbData.schedule || [],
        rewards: dbData.rewards || [],
        managed_by_nerds: dbData.managed_by_nerds !== false,
        auto_approve: dbData.auto_approve,
        partners: dbData.partners || [],
        mentors: dbData.mentors || [],
        jury: dbData.jury || [],
        faq: dbData.faq || []
      });
    }

    if (!loading) window.scrollTo(0, 0);
  }, [dbHackathons, loading, slug]);

  // Keep localStorage in sync with real-time status

  const handleRegisterClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!hackathon) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (hackathon.registration_type === 'managed') {
      setShowRegModal(true);
    } else if (hackathon.registration_link) {
      window.open(hackathon.registration_link, '_blank');
    } else {
      alert('Registration details not available yet.');
    }
  }, [hackathon, isSignedIn, openSignIn]);

  useEffect(() => {
    if (hackathon?.title) {
      document.title = `${hackathon.title} | Nerds Room`;
    }
  }, [hackathon?.title]);

  if (!hackathon && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
            <Clock className="text-slate-200 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Event Not Found</h1>
          <p className="text-slate-500 max-w-md mx-auto">The event you're looking for might have been moved or deleted.</p>
          <button
            onClick={() => navigate('/hackathons')}
            className="px-8 py-3 bg-nerdBlue text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
          >
            Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  if (!hackathon) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Badge View Modal */}
      {showBadge && userRegistration && hackathon && (
        <BadgeViewWrapper
          hackathon={hackathon}
          onClose={() => setShowBadge(false)}
        />
      )}

      {/* Contained Banner Section */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 pt-20 md:pt-24">
        <div className="relative h-[160px] sm:h-[300px] md:h-[350px] w-full rounded-none md:rounded-[3rem] overflow-hidden shadow-lg border border-slate-100">
          <img
            src={hackathon.banner}
            alt={hackathon.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Header Info Section (Horizontal Row) - Clean Reskill Style */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 py-8 md:py-10 relative z-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10 flex-grow">
            {/* Logo - Circle Style */}
            <div className="flex-shrink-0 w-[85px] h-[85px] sm:w-[130px] sm:h-[135px] rounded-full bg-white p-1 shadow-md border-2 border-white flex items-center justify-center overflow-hidden">
              <img src={hackathon.logo} alt={hackathon.title} className="w-full h-full object-contain rounded-full" />
            </div>

            {/* Title & Info */}
            <div className="text-left space-y-3 max-w-[665px]">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-normal leading-tight">{hackathon.title}</h1>
                <div className="flex flex-wrap gap-2">
                  {(hackathon.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-wider rounded-lg border border-indigo-100 flex items-center gap-1.5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-slate-500 font-medium text-base leading-relaxed max-w-3xl">
                {hackathon.description}
              </p>

              {/* Metadata Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-2 text-slate-900 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span className="capitalize">{hackathon.mode} Hackathon</span>
                </div>
                <div className="flex items-center gap-2 sm:border-l border-slate-200 sm:pl-5">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span>2 - 4 Team Members</span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    setTimeout(() => {
                      const el = document.getElementById('tab-content');
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.pageYOffset - 140;
                        window.scrollTo({ top, behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="flex items-center gap-2 text-nerdBlue hover:text-nerdLime hover:underline sm:border-l border-slate-200 sm:pl-5"
                >
                  <Clock className="w-5 h-5" />
                  <span>View full Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right CTA Area */}
          <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-[220px] pt-4">
            <div className="text-center lg:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Date to Register</p>
              <p className="text-lg md:text-xl font-black text-slate-900 uppercase">{hackathon.dates}</p>
            </div>

            {regStatus === 'approved' ? (
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full">
                <div className="bg-green-100 text-green-700 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 flex-grow text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approved</span>
                </div>
                <button
                  onClick={() => setShowTicket(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Ticket</span>
                </button>
                {hackathon.badge_enabled && (
                  <button
                    onClick={() => setShowBadge(true)}
                    className="bg-nerdLime text-nerdBlue px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-nerdLime/90 transition-all flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-nerdLime/20"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Claim Badge</span>
                  </button>
                )}
              </div>
            ) : regStatus === 'pending' ? (
              <div className="w-full bg-amber-100 text-amber-700 px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Pending</span>
              </div>
            ) : (
              <button
                onClick={handleRegisterClick}
                className="w-full lg:w-auto bg-nerdBlue hover:bg-nerdDark text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-nerdBlue/30 transform hover:-translate-y-1"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <div className="sticky top-[64px] z-50 bg-nerdBlue shadow-xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0 h-16">
            {[
              { id: 'overview', label: 'About' },
              { id: 'challenges', label: 'Challenges' },
              { id: 'mentors', label: 'Mentors' },
              { id: 'jury', label: 'Jury Panel' },
              { id: 'schedule', label: 'Schedule' },
              { id: 'prizes', label: 'Prize' },
              { id: 'partners', label: 'Partners' },
              { id: 'faq', label: 'FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={(e) => {
                  setActiveTab(tab.id);
                  // Focus the tab button
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

                  const el = document.getElementById('tab-content');
                  const offset = 140;
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className={`
                  relative h-full px-4 sm:px-6 flex items-center text-xs sm:text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? 'text-white bg-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'}
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

      {/* Main Content Layout (Sidebar + Body) */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 py-12" id="content-area">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch gap-0">
          {/* LEFT SIDEBAR COLUMN - Contains the divider line */}
          <div className="md:col-span-4 lg:col-span-4 md:pr-8 lg:pr-12 md:border-r lg:border-r border-slate-100 pb-12">
            {/* STICKY CONTAINER - Stays fixed while scrolling body */}
            <div className="md:sticky lg:sticky top-[128px] z-40 space-y-8 h-fit">
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center">
                  <img src={hackathon.logo} alt={hackathon.title} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-normal">{hackathon.title}</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{hackathon.description}</p>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Date to Register</p>
                  <p className="text-xl font-black text-slate-900 mb-6 uppercase">{hackathon.dates}</p>

                  {regStatus === 'approved' ? (
                    <div className="space-y-3">
                      <div className="bg-green-100 text-green-700 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span>Approved</span>
                      </div>
                      <button
                        onClick={() => setShowTicket(true)}
                        className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View Ticket</span>
                      </button>
                      {hackathon.badge_enabled && (
                        <button
                          onClick={() => setShowBadge(true)}
                          className="w-full bg-nerdLime text-nerdBlue px-6 py-3.5 rounded-xl font-black uppercase tracking-widest hover:bg-nerdLime/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-nerdLime/20"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Claim Your Badge</span>
                        </button>
                      )}
                    </div>
                  ) : regStatus === 'pending' ? (
                    <div className="bg-amber-100 text-amber-700 px-6 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>Pending</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegisterClick}
                      className="w-full bg-nerdBlue hover:bg-nerdDark text-white px-6 py-4.5 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-nerdBlue/20 active:scale-95"
                    >
                      Register Now
                    </button>
                  )}
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <div className="space-y-6">
                    {(hackathon.organizers && hackathon.organizers.length > 0
                      ? hackathon.organizers
                      : [{ name: hackathon.organizer, role: 'Main Organizer' }]
                    ).map((org, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/item">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden group-hover/item:scale-105 transition-transform shrink-0">
                          {hackathon.logo ? (
                            <img src={hackathon.logo} alt={org.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            <Zap className="text-indigo-600" size={24} strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-900 leading-tight truncate uppercase tracking-normal text-lg">{org.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">
                              {org.role || 'Partner'}
                            </div>
                            {hackathon.managed_by_nerds && (
                              <>
                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                  Verified
                                </div>
                              </>
                            )}
                          </div>
                          {/* Social Media Links for Organizers */}
                          {org.social_links && org.social_links.length > 0 && (
                            <div className="flex gap-3 mt-3">
                              {org.social_links.map((link: any, lIdx: number) => (
                                <a
                                  key={lIdx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-indigo-600 transition-colors transform hover:-translate-y-0.5"
                                  title={link.platform}
                                >
                                  {link.platform === 'twitter' && <Twitter size={14} />}
                                  {link.platform === 'linkedin' && <Linkedin size={14} />}
                                  {link.platform === 'github' && <Github size={14} />}
                                  {link.platform === 'instagram' && <Instagram size={14} />}
                                  {link.platform === 'website' && <Globe size={14} />}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-8 mt-4 border-t border-slate-50/50">
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="capitalize">{hackathon.mode}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span>Hackathon Event</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <span>2 - 4 Team Members</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('schedule');
                        const el = document.getElementById('tab-content');
                        if (el) {
                          const top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 140;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                      className="w-full mt-4 flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all group"
                    >
                      <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span>View full Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Tab Body */}
          <div className="md:col-span-8 lg:col-span-8 md:pl-8 lg:pl-16" id="tab-content">
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              {activeTab === 'overview' && (
                <div className="space-y-12">
                  <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 border border-slate-100 shadow-sm">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">About</h2>
                    <div
                      className="prose prose-lg prose-slate text-slate-600 max-w-none whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: hackathon.about || '' }}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50 flex flex-col items-center justify-center text-center">
                      <Users size={24} className="text-indigo-600 mb-2" />
                      <p className="text-xl font-black text-slate-900">{hackathon?.participants || '0'}+</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Builders</p>
                    </div>
                    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                      <Trophy size={24} className="text-emerald-600 mb-2" />
                      <p className="text-xl font-black text-slate-900">{hackathon?.prize || 'TBA'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prize Pool</p>
                    </div>
                    <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50 flex flex-col items-center justify-center text-center">
                      <Clock size={24} className="text-orange-600 mb-2" />
                      <p className="text-xl font-black text-slate-900 md:text-md truncate px-2">{hackathon?.timeLeft || 'Ended'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    </div>
                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 flex flex-col items-center justify-center text-center">
                      <Globe size={24} className="text-blue-600 mb-2" />
                      <p className="text-lg font-black text-slate-900 truncate w-full">{hackathon?.mode}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Format</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'challenges' && (
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-8">Challenges</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hackathon.challenges?.map((challenge: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#5f33e1]/30 transition-all group flex flex-col h-full">
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5f33e1] to-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <Trophy className="w-7 h-7" />
                          </div>
                          <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Track {idx + 1}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-nerdBlue transition-colors line-clamp-2">{challenge.title}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 flex-grow">{challenge.description}</p>
                      </div>
                    ))}
                    {(!hackathon.challenges || hackathon.challenges.length === 0) && (
                      <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Challenges coming soon</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="max-w-4xl mx-auto px-2 sm:px-0">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-normal">Event Schedule</h2>
                      <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-[0.1em]">Complete roadmap for Innovation</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100">
                      <Clock className="w-4 h-4" />
                      {hackathon.dates}
                    </div>
                  </div>

                  <div className="relative">
                    {/* Timeline Track */}
                    <div className="absolute left-0 sm:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-600 via-violet-500 to-transparent -translate-x-1/2 rounded-full opacity-20 hidden sm:block" />

                    <div className="space-y-12 relative">
                      {hackathon.schedule?.map((item: any, idx: number) => (
                        <div key={idx} className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 group ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                          {/* Dot */}
                          <div className="absolute left-0 sm:left-1/2 top-6 sm:top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)] z-10 group-hover:scale-150 transition-transform duration-500" />

                          {/* Time Label (Desktop) */}
                          <div className={`hidden sm:flex flex-1 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                            <div className={`px-6 py-2 rounded-2xl bg-slate-50 border border-slate-100 font-black text-slate-800 text-sm tracking-tight transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                              {item.time}
                              {item.date && <span className="block text-[10px] opacity-60 mt-0.5">{item.date}</span>}
                            </div>
                          </div>

                          {/* Content Card */}
                          <div className="flex-1 w-full sm:w-auto pl-8 sm:pl-0">
                            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group-hover:-translate-y-1 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

                              {/* Mobile Time */}
                              <div className="sm:hidden mb-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-lg text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                {item.time} {item.date && `• ${item.date}`}
                              </div>

                              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{item.title}</h3>
                              <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!hackathon.schedule || hackathon.schedule.length === 0) && (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Clock className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Roadmap is being digitized</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'prizes' && (
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-8">Prizes & Rewards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hackathon.prizes?.map((prize: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center group">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${idx === 0 ? 'bg-amber-100 text-amber-600' :
                          idx === 1 ? 'bg-slate-100 text-slate-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                          <Trophy size={idx === 0 ? 36 : 32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{prize.amount}</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">{prize.position || `Winner #${idx + 1}`}</p>
                        <p className="text-slate-500 text-sm font-medium">{prize.description}</p>
                      </div>
                    ))}
                    {(!hackathon.prizes || hackathon.prizes.length === 0) && (
                      <div className="col-span-3 text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Prize details to be announced</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'partners' && (
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-8">Event Partners</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {hackathon.partners?.map((partner: any, idx: number) => (
                      <div key={idx} className="group p-6 bg-white rounded-3xl border border-slate-100 hover:border-[#5f33e1]/30 hover:shadow-xl transition-all flex flex-col items-center">
                        <div className="h-12 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100">
                          {partner.logo ? <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" /> : <Globe className="w-10 h-10 text-slate-300" />}
                        </div>
                        <span className="text-slate-900 text-xs font-bold text-center">{partner.name}</span>
                        <span className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mt-1">{partner.type}</span>
                      </div>
                    ))}
                    {(!hackathon.partners || hackathon.partners.length === 0) && (
                      <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Partners to be announced</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'mentors' && (
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-8">Event Mentors</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathon.mentors?.map((mentor: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                            {mentor.image_url ? (
                              <img src={mentor.image_url} alt={mentor.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Users size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 leading-tight">{mentor.name}</h3>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{mentor.role}</p>
                          </div>
                        </div>
                        {mentor.bio && <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">{mentor.bio}</p>}
                      </div>
                    ))}
                    {(!hackathon.mentors || hackathon.mentors.length === 0) && (
                      <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Mentors to be announced</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'jury' && (
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-8">Jury Panel</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathon.jury?.map((judge: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                            {judge.image_url ? (
                              <img src={judge.image_url} alt={judge.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Users size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 leading-tight">{judge.name}</h3>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{judge.role}</p>
                          </div>
                        </div>
                        {judge.bio && <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">{judge.bio}</p>}
                      </div>
                    ))}
                    {(!hackathon.jury || hackathon.jury.length === 0) && (
                      <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Jury panel being finalized</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-black text-slate-900 mb-8">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {hackathon.faq?.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-3">{item.question}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                    {(!hackathon.faq || hackathon.faq.length === 0) && (
                      <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">FAQs coming soon</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal - Preserved from original layout */}
      {showRegModal && hackathon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 p-3">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[8px]" onClick={() => setShowRegModal(false)} />
          <div className="bg-white sm:rounded-[3rem] rounded-[2.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] w-full max-w-2xl relative z-10 overflow-hidden max-h-[96vh] flex flex-col border border-slate-200/50">
            <div className="sm:p-10 p-8 sm:pb-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Register Now</h2>
                <p className="text-[10px] sm:text-[11px] font-bold text-indigo-500 mt-1 uppercase tracking-[0.2em]">Join {hackathon.title} cluster</p>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all group border border-transparent hover:border-slate-100"
              >
                <svg className="w-6 h-6 text-slate-300 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:p-10 px-6 py-8 overflow-y-auto custom-scrollbar">
              {registrationForms.find(f => f.id === hackathon.managed_form_id) ? (
                <form
                  className="space-y-8"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const responses: Record<string, any> = {};

                    const currentForm = registrationForms.find(f => f.id === hackathon.managed_form_id);
                    currentForm?.fields.forEach(field => {
                      if (field.type === 'multiselect') {
                        responses[field.label] = formData.getAll(field.id);
                      } else {
                        responses[field.label] = formData.get(field.id);
                      }
                    });

                    const getFieldValue = (labels: string[], partialKeyword: string) => {
                      let entry = Object.entries(responses).find(([key]) =>
                        labels.some(label => key.toLowerCase().trim() === label.toLowerCase().trim())
                      );
                      if (!entry && partialKeyword) {
                        entry = Object.entries(responses).find(([key]) =>
                          key.toLowerCase().includes(partialKeyword.toLowerCase())
                        );
                      }
                      return entry ? entry[1] : '';
                    };

                    const name = getFieldValue(['Name', 'Full Name', 'Your Name'], 'name') || 'Anonymous User';
                    const email = getFieldValue(['Email', 'Email Address', 'Your Email'], 'email');
                    const role = getFieldValue(['Role', 'Designation', 'Position'], 'role') || 'Participant';

                    if (!email) {
                      alert('Email field is required for registration tracking.');
                      return;
                    }

                    try {
                      const { data, error } = await supabase.from('registrations').insert([
                        {
                          name,
                          email,
                          role,
                          status: hackathon?.auto_approve ? 'approved' : 'pending',
                          hackathon_id: hackathon?.id,
                          form_responses: responses
                        }
                      ]).select().single();

                      if (error) throw error;

                      const status = data.status as any;

                      const registeredEvents = JSON.parse(localStorage.getItem('registered_events') || '[]');
                      if (hackathon?.slug) {
                        const slug = hackathon.slug;
                        if (!registeredEvents.includes(slug)) {
                          registeredEvents.push(slug);
                          localStorage.setItem('registered_events', JSON.stringify(registeredEvents));
                        }
                        localStorage.setItem(`reg_email_${slug}`, email);
                        localStorage.setItem(`reg_status_${slug}`, status);
                      }

                      alert(status === 'approved' ? 'Registration successful! You are approved.' : 'Registration successful! We will contact you soon.');
                      setShowRegModal(false);
                      window.location.reload();
                    } catch (err: any) {
                      console.error('Submission error:', err);
                      alert('Failed to register: ' + err.message);
                    }
                  }}
                >
                  {registrationForms.find(f => f.id === hackathon.managed_form_id)?.fields.map((field) => (
                    <div key={field.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 group-focus-within:text-indigo-600 transition-colors">
                        {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.id}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 outline-none transition-all h-32 font-medium text-sm placeholder:text-slate-300"
                        />
                      ) : field.type === 'select' ? (
                        <div className="relative group/select">
                          <select
                            name={field.id}
                            required={field.required}
                            className="w-full sm:px-7 sm:py-5 px-5 py-4 rounded-[1.25rem] sm:rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/40 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm appearance-none cursor-pointer pr-14 text-slate-900 hover:border-slate-200"
                          >
                            <option value="" disabled selected hidden>Choose {field.label}...</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt} className="py-3">{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 group-focus-within/select:rotate-180">
                            <div className="w-8 h-8 flex items-center justify-center bg-slate-100 group-focus-within/select:bg-indigo-600 group-focus-within/select:text-white rounded-xl text-slate-400 transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : field.type === 'multiselect' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {field.options?.map((opt, optIdx) => (
                            <label key={optIdx} className="relative flex items-center p-4 bg-slate-50/50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-500/30 transition-all group/opt">
                              <input
                                type="checkbox"
                                name={field.id}
                                value={opt}
                                className="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer accent-indigo-600"
                              />
                              <span className="ml-3 text-sm font-bold text-slate-700 group-hover/opt:text-indigo-600 transition-colors">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          name={field.id}
                          defaultValue={
                            (field.type === 'email' || field.label.toLowerCase().includes('email'))
                              ? user?.primaryEmailAddress?.emailAddress
                              : (field.label.toLowerCase().includes('name') && !field.label.toLowerCase().includes('team') && !field.label.toLowerCase().includes('project'))
                                ? user?.fullName || ''
                                : ''
                          }
                          type={(field.type === 'phone' || field.label.toLowerCase().includes('phone') || field.label.toLowerCase().includes('mobile')) ? 'tel' : field.type}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          required={field.required}
                          maxLength={(field.type === 'phone' || field.label.toLowerCase().includes('phone') || field.label.toLowerCase().includes('mobile')) ? 10 : undefined}
                          minLength={(field.type === 'phone' || field.label.toLowerCase().includes('phone') || field.label.toLowerCase().includes('mobile')) ? 10 : undefined}
                          pattern={(field.type === 'phone' || field.label.toLowerCase().includes('phone') || field.label.toLowerCase().includes('mobile')) ? "[0-9]{10}" : undefined}
                          onInput={(e) => {
                            if (field.type === 'phone' || field.label.toLowerCase().includes('phone') || field.label.toLowerCase().includes('mobile')) {
                              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 10);
                            }
                          }}
                          className="w-full sm:px-7 sm:py-5 px-5 py-4 rounded-[1.25rem] sm:rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/40 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm placeholder:text-slate-300 text-slate-900 placeholder:font-medium"
                        />
                      )}
                    </div>
                  ))}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/30 hover:shadow-[0_24px_48px_-12px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                    >
                      <span className="relative z-10">Confirm Registration</span>
                      <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                      Secure, managed & real-time delivery
                    </p>
                  </div>
                </form>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Clock size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Registration Restricted</h3>
                  <p className="text-slate-500 mt-2 font-medium text-sm">Please reach out to the event support team for access.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicket && userRegistration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowTicket(false)} />
          <div className="relative w-full max-w-[380px] bg-[#0c0e12] rounded-[2.5rem] p-8 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 animate-in zoom-in-95 duration-300">
            {/* Design Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-indigo-600/50 rounded-full blur-[2px]" />

            <div className="flex flex-col items-center">
              {/* QR Section */}
              <div className="bg-white p-5 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)] mb-8">
                <QRCodeCanvas
                  value={JSON.stringify({ id: userRegistration.id, email: userRegistration.email, h_id: hackathon?.id })}
                  size={180}
                  level="H"
                />
              </div>

              {/* Event Info */}
              <div className="text-center mb-10">
                <h3 className="text-xl font-black tracking-tight mb-2 leading-tight">
                  {hackathon?.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{hackathon?.dates}</span>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-8 w-full mb-10 px-2">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Attendee</p>
                  <p className="text-sm font-black truncate">{userRegistration.name}</p>
                </div>
                <div className="space-y-1.5 text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Tier</p>
                  <p className="text-sm font-black text-indigo-400 uppercase">{userRegistration.status}</p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowTicket(false)}
                className="w-full py-4 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
              >
                Close Ticket
              </button>
            </div>

            {/* Subtle Textures */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-600/10 rounded-full blur-[60px]" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-600/10 rounded-full blur-[60px]" />
          </div>
        </div>
      )}

      {/* Fixed Bottom Register Bar for Mobile */}
      {!isRegistered && !loading && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 animate-in slide-in-from-bottom-full duration-500">
          <button
            onClick={handleRegisterClick}
            className="w-full bg-[#5f33e1] hover:bg-[#4f2ac0] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#5f33e1]/30 active:scale-[0.98] transition-all"
          >
            Register Now
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetailsPage;
