
import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

// Types moved to src/types/index.ts
import type {
  Registration,
  WhatWeDoCard,
  FlagshipEvent,
  PhotoGalleryItem,
  SuccessStory,
  Chapter,
  Hackathon,
  Workshop,
  PastEvent,
  OtherEvent,
  DashboardStats,
  HeroContent,
  SocialLinks,
  MissionLetterData,
  RegistrationForm,
  Tag,
  Toast
} from '../types';

interface AppDataContextType {

  // Auth
  session: Session | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;

  // Registrations
  registrations: Registration[];
  totalRegs: number;
  totalApprovedRegs: number;
  addRegistration: (reg: Omit<Registration, 'id' | 'createdAt'>) => Promise<void>;
  updateRegistrationStatus: (id: number, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  updateRegistration: (id: number, updates: Partial<Registration>) => Promise<void>;
  deleteRegistration: (id: number) => Promise<void>;

  // WhatWeDo Cards
  whatWeDoCards: WhatWeDoCard[];
  addWhatWeDoCard: (card: Omit<WhatWeDoCard, 'id'>) => Promise<void>;
  updateWhatWeDoCard: (id: number, updates: Partial<WhatWeDoCard>) => Promise<void>;
  deleteWhatWeDoCard: (id: number) => Promise<void>;

  // Flagship Events
  flagshipEvents: FlagshipEvent[];
  addFlagshipEvent: (event: Omit<FlagshipEvent, 'id'>) => Promise<void>;
  updateFlagshipEvent: (id: number, updates: Partial<FlagshipEvent>) => Promise<void>;
  deleteFlagshipEvent: (id: number) => Promise<void>;

  // Photo Gallery
  photoGallery: PhotoGalleryItem[];
  addPhotoGalleryItem: (item: Omit<PhotoGalleryItem, 'id'>) => Promise<void>;
  updatePhotoGalleryItem: (id: number, updates: Partial<PhotoGalleryItem>) => Promise<void>;
  deletePhotoGalleryItem: (id: number) => Promise<void>;

  // Success Stories
  successStories: SuccessStory[];
  addSuccessStory: (story: Omit<SuccessStory, 'id'>) => Promise<void>;
  updateSuccessStory: (id: number, updates: Partial<SuccessStory>) => Promise<void>;
  deleteSuccessStory: (id: number) => Promise<void>;

  // Chapters
  chapters: Chapter[];
  addChapter: (chapter: Omit<Chapter, 'id'>) => Promise<void>;
  updateChapter: (id: number, updates: Partial<Chapter>) => Promise<void>;
  deleteChapter: (id: number) => Promise<void>;

  // Hackathons
  hackathons: Hackathon[];
  addHackathon: (hackathon: Omit<Hackathon, 'id'>) => Promise<void>;
  updateHackathon: (id: number, updates: Partial<Hackathon>) => Promise<void>;
  deleteHackathon: (id: number) => Promise<void>;

  // Past Events
  pastEvents: PastEvent[];
  addPastEvent: (event: Omit<PastEvent, 'id'>) => Promise<void>;
  updatePastEvent: (id: number, updates: Partial<PastEvent>) => Promise<void>;
  deletePastEvent: (id: number) => Promise<void>;

  // Other Events
  otherEvents: OtherEvent[];
  addOtherEvent: (event: Omit<OtherEvent, 'id'>) => Promise<void>;
  updateOtherEvent: (id: number, updates: Partial<OtherEvent>) => Promise<void>;
  deleteOtherEvent: (id: number) => Promise<void>;

  // Workshops
  workshops: Workshop[];
  addWorkshop: (workshop: Omit<Workshop, 'id'>) => Promise<void>;
  updateWorkshop: (id: number, updates: Partial<Workshop>) => Promise<void>;
  deleteWorkshop: (id: number) => Promise<void>;

  // Registration Forms
  registrationForms: RegistrationForm[];
  addRegistrationForm: (form: Omit<RegistrationForm, 'id' | 'created_at'>) => Promise<void>;
  updateRegistrationForm: (id: string, updates: Partial<RegistrationForm>) => Promise<void>;
  deleteRegistrationForm: (id: string) => Promise<void>;

  // Partners
  partners: string[];
  setPartners: (partners: string[]) => Promise<void>;


  // Site Content
  supportedByText: string;
  setSupportedByText: (text: string) => Promise<void>;
  heroContent: HeroContent;
  updateHeroContent: (updates: Partial<HeroContent>) => Promise<void>;
  socialLinks: SocialLinks;
  updateSocialLinks: (updates: Partial<SocialLinks>) => Promise<void>;
  footerDescription: string;
  setFooterDescription: (text: string) => Promise<void>;
  announcementText: string;
  setAnnouncementText: (text: string) => Promise<void>;

  // Mission Letter
  missionLetter: MissionLetterData | null;
  updateMissionLetter: (updates: Partial<MissionLetterData>) => Promise<void>;

  // Tags
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => Promise<void>;
  updateTag: (id: number, updates: Partial<Tag>) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;

  // Dashboard Stats
  dashboardStats: DashboardStats;

  // Settings
  registrationsOpen: boolean;
  setRegistrationsOpen: (open: boolean) => Promise<void>;
  emailNotifications: boolean;
  setEmailNotifications: (enabled: boolean) => Promise<void>;
  autoApprove: boolean;
  setAutoApprove: (enabled: boolean) => Promise<void>;
  maintenanceMode: boolean;
  setMaintenanceMode: (enabled: boolean) => Promise<void>;

  // Utility
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  uploadFile: (file: File, bucket: string) => Promise<string | null>;
  getGrowthData: () => { labels: string[], data: number[] };
  refreshData: () => Promise<void>;
  navigate: (to: string) => void;
}



const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);


  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalRegs, setTotalRegs] = useState(0);
  const [totalApprovedRegs, setTotalApprovedRegs] = useState(0);
  const [whatWeDoCards, setWhatWeDoCards] = useState<WhatWeDoCard[]>([]);
  const [flagshipEvents, setFlagshipEvents] = useState<FlagshipEvent[]>([]);
  const [photoGallery, setPhotoGallery] = useState<PhotoGalleryItem[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>(() => {
    try {
      const cached = localStorage.getItem('cache_hackathons');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [otherEvents, setOtherEvents] = useState<OtherEvent[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrationForms, setRegistrationForms] = useState<RegistrationForm[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [missionLetter, setMissionLetter] = useState<MissionLetterData | null>(null);
  const [partners, setPartnersState] = useState<string[]>([]);
  const [supportedByText, setSupportedByTextState] = useState('');
  const [heroContent, setHeroContentState] = useState<HeroContent>({
    headingLine1: 'THINK. CREATE.',
    headingLine2: 'INNOVATE THE',
    headingLine3: 'FUTURE.',
    description: 'Join the premier student community building the future of technology.',
    primaryCTA: 'JOIN US',
    primaryCTALink: '#join',
    secondaryCTA: 'EVENTS',
    secondaryCTALink: '/events',
  });

  const [socialLinks, setSocialLinksState] = useState<SocialLinks>({
    telegram: '', instagram: '', linkedin: '', discord: '', twitter: '', youtube: '', whatsapp: ''
  });
  const [footerDescription, setFooterDescriptionState] = useState('');
  const [announcementText, setAnnouncementTextState] = useState('');

  // Config
  const [registrationsOpen, setRegistrationsOpenState] = useState(true);
  const [emailNotifications, setEmailNotificationsState] = useState(true);
  const [autoApprove, setAutoApproveState] = useState(false);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);

  // Cache timestamps to prevent excessive fetching
  const lastFetchTime = useRef<{ [key: string]: number }>({});
  const CACHE_DURATION = 30000; // 30 seconds cache
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shouldFetch = (key: string): boolean => {
    const now = Date.now();
    const lastFetch = lastFetchTime.current[key] || 0;
    return now - lastFetch > CACHE_DURATION;
  };

  const markFetched = (key: string) => {
    lastFetchTime.current[key] = Date.now();
  };

  const fetchData = async (force: boolean = false) => {
    // Clear any pending debounced fetch
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    const modules = [
      { key: 'registrations', fn: fetchRegistrations },
      { key: 'whatWeDo', fn: fetchWhatWeDo },
      { key: 'flagshipEvents', fn: fetchFlagshipEvents },
      { key: 'photoGallery', fn: fetchPhotoGallery },
      { key: 'successStories', fn: fetchSuccessStories },
      { key: 'chapters', fn: fetchChapters },
      { key: 'hackathons', fn: fetchHackathons },
      { key: 'pastEvents', fn: fetchPastEvents },
      { key: 'otherEvents', fn: fetchOtherEvents },
      { key: 'workshops', fn: fetchWorkshops },
      { key: 'registrationForms', fn: fetchRegistrationForms },
      { key: 'tags', fn: fetchTags },
      { key: 'missionLetter', fn: fetchMissionLetter },
      { key: 'partners', fn: fetchPartners },
      { key: 'settings', fn: fetchSettings }
    ];

    const promises: { key: string; fn: () => Promise<void> }[] = [];
    modules.forEach(mod => {
      if (force || shouldFetch(mod.key)) {
        promises.push(mod);
      }
    });

    if (promises.length === 0) return;

    // Only show global loading on forced refreshes or initial load (force = true or first fetch)
    const showGlobalLoading = force || !lastFetchTime.current['hackathons'];
    if (showGlobalLoading) setLoading(true);

    try {
      const startTime = Date.now();

      const fetchPromises = promises.map(mod =>
        mod.fn().then(() => markFetched(mod.key))
      );

      await Promise.all(fetchPromises);
      console.log('[NerdsRoom] Data fetch complete.');

      // Ensure loading lasts at least 0.5 seconds ONLY for initial/forced loads
      if (showGlobalLoading) {
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 500;
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
      }
    } catch (error) {
      console.error('[NerdsRoom] Global Fetch Error:', error);
    } finally {
      if (showGlobalLoading) setLoading(false);
    }
  };

  // Debounced version for realtime updates
  const debouncedFetchData = () => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
      fetchData();
    }, 2000); // 2 second debounce for realtime bursts
  };

  // Initialize Auth & Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      }
      fetchData();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        // Clear caches on logout
        lastFetchTime.current = {};
      }
    });

    const handleOnline = () => {
      fetchData(true);
    };

    window.addEventListener('online', handleOnline);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  const refreshData = () => fetchData(true);

  // Real-time subscription for changes (Generic listener for all tables)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          // Invalidate cache for this specific table
          const tableToKeyMap: any = {
            'registrations': 'registrations',
            'photo_gallery': 'photoGallery',
            'hackathons': 'hackathons',
            'registration_forms': 'registrationForms',
            'tags': 'tags',
            'workshops': 'workshops'
          };

          if (tableToKeyMap[payload.table]) {
            delete lastFetchTime.current[tableToKeyMap[payload.table]];
            debouncedFetchData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Fetchers ---

  const fetchRegistrations = async () => {
    try {
      const { count: total, error: e1 } = await supabase.from('registrations').select('*', { count: 'exact', head: true });
      if (e1) console.error('[NerdsRoom] fetchRegistrations Count Error:', e1);

      const { count: approved, error: e2 } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      if (e2) console.error('[NerdsRoom] fetchRegistrations Approved Count Error:', e2);

      if (total !== null) setTotalRegs(total);
      if (approved !== null) setTotalApprovedRegs(approved);

      const { data, error: e3 } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (e3) console.error('[NerdsRoom] fetchRegistrations Data Error:', e3);
      if (data) setRegistrations(data.map(d => ({ ...d, createdAt: d.created_at })));
    } catch (err) {
      console.error('[NerdsRoom] fetchRegistrations Unexpected Error:', err);
    }
  };

  const fetchWhatWeDo = async () => {
    const { data } = await supabase.from('what_we_do_cards').select('*').order('id', { ascending: true });
    if (data) setWhatWeDoCards(data.map(d => ({ ...d, statLabel: d.stat_label, iconBg: d.icon_bg })));
  };

  const fetchFlagshipEvents = async () => {
    const { data, error } = await supabase.from('flagship_events').select('*').order('created_at', { ascending: true });
    if (error) console.error('[NerdsRoom] fetchFlagshipEvents Error:', error);
    if (data) setFlagshipEvents(data.map(d => ({ ...d, image: d.image_url })));
  };

  const fetchPhotoGallery = async () => {
    const { data } = await supabase.from('photo_gallery').select('*').order('created_at', { ascending: true });
    if (data) setPhotoGallery(data);
  };

  const fetchSuccessStories = async () => {
    const { data } = await supabase.from('success_stories').select('*').order('display_order', { ascending: true });
    if (data) setSuccessStories(data);
  };

  const fetchChapters = async () => {
    const { data } = await supabase.from('chapters').select('*').order('created_at', { ascending: true });
    if (data) setChapters(data);
  };

  const fetchHackathons = async () => {
    const { data } = await supabase.from('hackathons').select('*').order('created_at', { ascending: false });
    if (data) {
      const mapped = data.map(h => ({
        ...h,
        tags: h.tags || []
      }));
      setHackathons(mapped);
      localStorage.setItem('cache_hackathons', JSON.stringify(mapped));
    }
  };

  const fetchPastEvents = async () => {
    const { data } = await supabase.from('past_events').select('*').order('created_at', { ascending: false });
    if (data) setPastEvents(data);
  };

  const fetchOtherEvents = async () => {
    const { data } = await supabase.from('other_events').select('*').order('created_at', { ascending: false });
    if (data) setOtherEvents(data);
  };

  const fetchRegistrationForms = async () => {
    const { data } = await supabase.from('registration_forms').select('*').order('created_at', { ascending: false });
    if (data) setRegistrationForms(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase.from('tags').select('*').order('name', { ascending: true });
    if (data) setTags(data);
  };

  const fetchPartners = async () => {
    const { data } = await supabase.from('partners').select('name').order('created_at', { ascending: true });
    if (data && data.length > 0) setPartnersState(data.map(p => p.name));
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) console.error('[NerdsRoom] fetchSettings Error:', error);
    if (data) {
      data.forEach(setting => {
        const val = setting.value;
        switch (setting.key) {
          case 'hero_content': setHeroContentState(val); break;
          case 'social_links': setSocialLinksState(val); break;
          case 'supported_by_text': if (val) setSupportedByTextState(val); break;
          case 'footer_description': setFooterDescriptionState(val); break;
          case 'announcement_text': setAnnouncementTextState(val); break;
          case 'registrations_open': setRegistrationsOpenState(val); break;
          case 'email_notifications': setEmailNotificationsState(val); break;
          case 'auto_approve': setAutoApproveState(val); break;
          case 'maintenance_mode': setMaintenanceModeState(val); break;
        }
      });
    }
  };

  // --- Actions ---

  const signIn = async (email: string, pass: string) => {
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Registrations
  const addRegistration = async (reg: Omit<Registration, 'id' | 'createdAt'>) => {
    // Optimistic update
    const dummyId = Date.now();
    const optimisticReg = { ...reg, id: dummyId, createdAt: new Date().toISOString() } as Registration;

    // 1. Update list and count immediately
    setRegistrations(prev => [optimisticReg, ...prev].slice(0, 50));
    setTotalRegs(prev => prev + 1);
    if (reg.status === 'approved') setTotalApprovedRegs(prev => prev + 1);

    try {
      const { data, error } = await supabase.from('registrations').insert([reg]).select().single();
      if (error) throw error;

      // Update with real data if needed (optional since we're using realtime often)
      if (data) {
        setRegistrations(prev => prev.map(r => r.id === dummyId ? { ...data, createdAt: data.created_at } : r));
      }
    } catch (err) {
      // Revert on error
      setRegistrations(prev => prev.filter(r => r.id !== dummyId));
      setTotalRegs(prev => prev - 1);
      if (reg.status === 'approved') setTotalApprovedRegs(prev => prev - 1);
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const updateRegistrationStatus = async (id: number, status: string) => {
    // Optimistic
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    await supabase.from('registrations').update({ status }).eq('id', id);
  };

  const updateRegistration = async (id: number, updates: Partial<Registration>) => {
    // Optimistic
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    const { error } = await supabase.from('registrations').update(updates).eq('id', id);
    if (error) {
      console.error(error);
      fetchRegistrations();
    }
  };

  const deleteRegistration = async (id: number) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
    await supabase.from('registrations').delete().eq('id', id);
  };

  // What We Do
  const addWhatWeDoCard = async (card: Omit<WhatWeDoCard, 'id'>) => {
    const { error } = await supabase.from('what_we_do_cards').insert([{
      title: card.title,
      description: card.description,
      icon: typeof card.icon === 'string' ? card.icon : '🚀', // Handle react node vs string
      stat: card.stat,
      stat_label: card.statLabel,
      icon_bg: card.iconBg,
      gradient: card.gradient
    }]);
    if (!error) fetchWhatWeDo();
  };

  const updateWhatWeDoCard = async (id: number, updates: Partial<WhatWeDoCard>) => {
    const { error } = await supabase.from('what_we_do_cards').update({
      title: updates.title,
      description: updates.description,
      stat: updates.stat,
      stat_label: updates.statLabel
    }).eq('id', id);
    if (!error) fetchWhatWeDo();
  };

  const deleteWhatWeDoCard = async (id: number) => {
    const { error } = await supabase.from('what_we_do_cards').delete().eq('id', id);
    if (!error) fetchWhatWeDo();
  };

  // Flagship Events
  const addFlagshipEvent = async (event: Omit<FlagshipEvent, 'id'>) => {
    const { error } = await supabase.from('flagship_events').insert([{
      title: event.title,
      description: event.description,
      image_url: event.image,
      location: event.location,
      stats: event.stats,
      is_public: event.is_public ?? true,
      is_featured: event.is_featured ?? false,
      registration_link: event.registration_link ?? null,
    }]);
    if (!error) fetchFlagshipEvents();
  };

  const updateFlagshipEvent = async (id: number, updates: Partial<FlagshipEvent>) => {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.stats !== undefined) payload.stats = updates.stats;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.is_public !== undefined) payload.is_public = updates.is_public;
    if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;
    if (updates.registration_link !== undefined) payload.registration_link = updates.registration_link || null;

    const { error } = await supabase.from('flagship_events').update(payload).eq('id', id);
    if (!error) fetchFlagshipEvents();
  };

  const deleteFlagshipEvent = async (id: number) => {
    const { error } = await supabase.from('flagship_events').delete().eq('id', id);
    if (!error) fetchFlagshipEvents();
  };

  // Photo Gallery
  // Helper to rebalance gallery layout to 2-3-4-3-2
  const balanceGallery = async () => {
    // 1. Fetch current list
    const { data: allPhotos } = await supabase.from('photo_gallery').select('*').order('created_at', { ascending: true });

    if (!allPhotos || allPhotos.length === 0) return;

    // 2. Define ideal distribution
    const distribution = [
      { cat: 'col1', count: 2 },
      { cat: 'col2', count: 3 },
      { cat: 'center', count: 4 },
      { cat: 'col3', count: 3 },
      { cat: 'col4', count: 2 }
    ];

    let currentIndex = 0;
    const updates = [];

    // 3. Assign categories
    for (const dist of distribution) {
      for (let i = 0; i < dist.count; i++) {
        if (currentIndex < allPhotos.length) {
          const photo = allPhotos[currentIndex];
          if (photo.category !== dist.cat) {
            updates.push(supabase.from('photo_gallery').update({ category: dist.cat }).eq('id', photo.id));
          }
          currentIndex++;
        }
      }
    }

    // Handle overflow - put rest in col4 for now
    while (currentIndex < allPhotos.length) {
      const photo = allPhotos[currentIndex];
      if (photo.category !== 'col4') {
        updates.push(supabase.from('photo_gallery').update({ category: 'col4' }).eq('id', photo.id));
      }
      currentIndex++;
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    // Final fetch to update UI
    fetchPhotoGallery();
  };

  const addPhotoGalleryItem = async (item: Omit<PhotoGalleryItem, 'id'>) => {
    // Insert with a placeholder category, we'll fix it immediately
    const { error } = await supabase.from('photo_gallery').insert([{ ...item, category: 'col4' }]);
    if (!error) {
      await balanceGallery();
    }
  };

  const updatePhotoGalleryItem = async (id: number, updates: Partial<PhotoGalleryItem>) => {
    const { error } = await supabase.from('photo_gallery').update(updates).eq('id', id);
    if (!error) fetchPhotoGallery();
  };

  const deletePhotoGalleryItem = async (id: number) => {
    const { error } = await supabase.from('photo_gallery').delete().eq('id', id);
    if (!error) {
      await balanceGallery();
    }
  };

  // Success Stories
  const addSuccessStory = async (story: Omit<SuccessStory, 'id'>) => {
    const { error } = await supabase.from('success_stories').insert([story]);
    if (!error) fetchSuccessStories();
  };

  const updateSuccessStory = async (id: number, updates: Partial<SuccessStory>) => {
    const { error } = await supabase.from('success_stories').update(updates).eq('id', id);
    if (!error) fetchSuccessStories();
  };

  const deleteSuccessStory = async (id: number) => {
    const { error } = await supabase.from('success_stories').delete().eq('id', id);
    if (!error) fetchSuccessStories();
  };

  // Mission Letter
  const fetchMissionLetter = async () => {
    const { data } = await supabase.from('mission_letter').select('*').limit(1).single();
    if (data) setMissionLetter(data);
  };

  const updateMissionLetter = async (updates: Partial<MissionLetterData>) => {
    // Upsert logic for single row table, usually ID 1
    const { error } = await supabase.from('mission_letter').upsert({ id: 1, ...updates });
    if (!error) fetchMissionLetter();
  };

  // Chapters
  const addChapter = async (chapter: Omit<Chapter, 'id'>) => {
    const { error } = await supabase.from('chapters').insert([chapter]);
    if (!error) fetchChapters();
  };

  const updateChapter = async (id: number, updates: Partial<Chapter>) => {
    const { error } = await supabase.from('chapters').update(updates).eq('id', id);
    if (!error) fetchChapters();
  };

  const deleteChapter = async (id: number) => {
    const { error } = await supabase.from('chapters').delete().eq('id', id);
    if (!error) fetchChapters();
  };

  // Hackathons
  const addHackathon = async (hackathon: Omit<Hackathon, 'id'>) => {
    const { error } = await supabase.from('hackathons').insert([hackathon]);
    if (!error) fetchHackathons();
  };

  const updateHackathon = async (id: number, updates: Partial<Hackathon>) => {
    console.log('Updating hackathon:', id, 'with:', updates);
    const { error } = await supabase.from('hackathons').update(updates).eq('id', id);
    if (error) {
      console.error('Failed to update hackathon:', error);
      showToast('Failed to update: ' + error.message, 'error');
    } else {
      fetchHackathons();
    }
  };

  const deleteHackathon = async (id: number) => {
    const { error } = await supabase.from('hackathons').delete().eq('id', id);
    if (!error) fetchHackathons();
  };

  // Registration Forms
  const addRegistrationForm = async (form: Omit<RegistrationForm, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('registration_forms').insert([form]);
    if (!error) fetchRegistrationForms();
  };

  const updateRegistrationForm = async (id: string, updates: Partial<RegistrationForm>) => {
    const { error } = await supabase.from('registration_forms').update(updates).eq('id', id);
    if (!error) fetchRegistrationForms();
  };

  const deleteRegistrationForm = async (id: string) => {
    const { error } = await supabase.from('registration_forms').delete().eq('id', id);
    if (!error) fetchRegistrationForms();
  };

  // Tags
  const addTag = async (tag: Omit<Tag, 'id'>) => {
    const { error } = await supabase.from('tags').insert([tag]);
    if (error) {
      showToast('Failed to add tag: ' + error.message, 'error');
    } else {
      fetchTags();
    }
  };

  const updateTag = async (id: number, updates: Partial<Tag>) => {
    const { error } = await supabase.from('tags').update(updates).eq('id', id);
    if (error) {
      showToast('Failed to update tag: ' + error.message, 'error');
    } else {
      fetchTags();
    }
  };

  const deleteTag = async (id: number) => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete tag: ' + error.message, 'error');
    } else {
      fetchTags();
    }
  };

  const addPastEvent = async (event: Omit<PastEvent, 'id'>) => {
    const { error } = await supabase.from('past_events').insert([event]);
    if (!error) fetchPastEvents();
  };

  const updatePastEvent = async (id: number, updates: Partial<PastEvent>) => {
    const { error } = await supabase.from('past_events').update(updates).eq('id', id);
    if (!error) fetchPastEvents();
  };

  const deletePastEvent = async (id: number) => {
    const { error } = await supabase.from('past_events').delete().eq('id', id);
    if (!error) fetchPastEvents();
  };

  // Other Events
  const addOtherEvent = async (event: Omit<OtherEvent, 'id'>) => {
    const { error } = await supabase.from('other_events').insert([event]);
    if (!error) fetchOtherEvents();
  };

  const updateOtherEvent = async (id: number, updates: Partial<OtherEvent>) => {
    const { error } = await supabase.from('other_events').update(updates).eq('id', id);
    if (!error) fetchOtherEvents();
  };

  const deleteOtherEvent = async (id: number) => {
    const { error } = await supabase.from('other_events').delete().eq('id', id);
    if (!error) fetchOtherEvents();
  };


  // ... (existing helper functions for settings)
  // Partners/Settings (Simplified: update the single row)
  const setPartners = async (p: string[]) => {
    setPartnersState(p);
    // Ideally update 'partners' table. 
    // Delete all and re-insert is easiest for this simple list.
    await supabase.from('partners').delete().neq('id', 0); // Delete all
    const inserts = p.map(name => ({ name }));
    if (inserts.length > 0)
      await supabase.from('partners').insert(inserts);
  };

  const updateSetting = async (key: string, value: any) => {
    await supabase.from('site_settings').upsert({ key, value });
  };

  const setSupportedByText = async (text: string) => {
    setSupportedByTextState(text);
    updateSetting('supported_by_text', text);
  };

  const updateHeroContent = async (updates: Partial<HeroContent>) => {
    const newVal = { ...heroContent, ...updates };
    setHeroContentState(newVal);
    updateSetting('hero_content', newVal);
  };

  const updateSocialLinks = async (updates: Partial<SocialLinks>) => {
    const newVal = { ...socialLinks, ...updates };
    setSocialLinksState(newVal);
    updateSetting('social_links', newVal);
  };

  const setFooterDescription = async (text: string) => {
    setFooterDescriptionState(text);
    updateSetting('footer_description', text);
  };

  const setAnnouncementText = async (text: string) => {
    setAnnouncementTextState(text);
    updateSetting('announcement_text', text);
  };

  const setRegistrationsOpen = async (val: boolean) => {
    setRegistrationsOpenState(val);
    updateSetting('registrations_open', val);
  };
  const setEmailNotifications = async (val: boolean) => {
    setEmailNotificationsState(val);
    updateSetting('email_notifications', val);
  };
  const setAutoApprove = async (val: boolean) => {
    setAutoApproveState(val);
    updateSetting('auto_approve', val);
  };
  const setMaintenanceMode = async (val: boolean) => {
    setMaintenanceModeState(val);
    updateSetting('maintenance_mode', val);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Try to upload
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      // 2. If bucket not found, try to create it
      if (uploadError && (uploadError.message.includes('bucket not found') || (uploadError as any).error === 'Bucket not found')) {
        const { error: createError } = await supabase.storage.createBucket(bucket, {
          public: true,
        });

        if (createError) {
          // If creation fails (e.g. permissions), throw original error or creation error
          console.error('Failed to create bucket:', createError);
          throw uploadError;
        }

        // Retry upload after creation
        const { error: retryError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (retryError) throw retryError;
      } else if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Upload failed:', error);
      showToast(error.message || 'Error uploading file', 'error');
      return null;
    }
  };

  const fetchWorkshops = async () => {
    const { data, error } = await supabase.from('workshops').select('*').order('created_at', { ascending: false });
    if (!error && data) setWorkshops(data);
  };

  const addWorkshop = async (workshop: Omit<Workshop, 'id'>) => {
    const { error } = await supabase.from('workshops').insert(workshop);
    if (!error) fetchWorkshops();
  };

  const updateWorkshop = async (id: number, updates: Partial<Workshop>) => {
    const { error } = await supabase.from('workshops').update(updates).eq('id', id);
    if (!error) fetchWorkshops();
  };

  const deleteWorkshop = async (id: number) => {
    const { error } = await supabase.from('workshops').delete().eq('id', id);
    if (!error) fetchWorkshops();
  };


  const calculatedStats: DashboardStats = {
    totalRegistrations: totalRegs,
    pendingApprovals: totalRegs - totalApprovedRegs, // Approximation or fetch specific count if needed
  };

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new Event('pushstate'));
  };

  const getGrowthData = () => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const resultLabels: string[] = [];
    const monthlyCounts: number[] = Array(7).fill(0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      resultLabels.push(months[d.getMonth()]);
    }

    registrations.forEach(reg => {
      const regDate = new Date(reg.createdAt);
      const regMonth = regDate.getMonth();
      const regYear = regDate.getFullYear();

      const idx = resultLabels.findIndex((_, index) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);
        return months[d.getMonth()] === months[regMonth] && d.getFullYear() === regYear;
      });

      if (idx !== -1) {
        monthlyCounts[idx]++;
      }
    });

    // Make it cumulative growth
    let runningTotal = Math.max(0, totalRegs - registrations.length); // Start with regs that aren't in the recent fetch
    const cumulativeData = monthlyCounts.map(count => {
      runningTotal += count;
      return runningTotal;
    });

    // If data is too low, add a tiny organic curve for visual appeal (only for UI)
    // Actually, let's just use real data but ensure the chart handles 0-1 range well.
    return { labels: resultLabels, data: cumulativeData };
  };

  const value = {
    session,
    loading,
    signIn,
    signOut,
    registrations,
    totalRegs,
    totalApprovedRegs,
    addRegistration,
    updateRegistrationStatus,
    deleteRegistration,
    whatWeDoCards,
    addWhatWeDoCard,
    updateWhatWeDoCard,
    deleteWhatWeDoCard,
    flagshipEvents,
    addFlagshipEvent,
    updateFlagshipEvent,
    deleteFlagshipEvent,
    photoGallery,
    addPhotoGalleryItem,
    updatePhotoGalleryItem,
    deletePhotoGalleryItem,
    successStories,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,

    missionLetter,
    updateMissionLetter,

    chapters,
    addChapter,
    updateChapter,
    deleteChapter,
    hackathons,
    addHackathon,
    updateHackathon,
    deleteHackathon,
    pastEvents,
    addPastEvent,
    updatePastEvent,
    deletePastEvent,
    otherEvents,
    addOtherEvent,
    updateOtherEvent,
    deleteOtherEvent,
    workshops,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registrationForms,
    addRegistrationForm,
    updateRegistrationForm,
    deleteRegistrationForm,

    // Tags
    tags,
    addTag,
    updateTag,
    deleteTag,

    // Partners
    partners,
    setPartners,
    supportedByText,
    setSupportedByText,
    heroContent,
    updateHeroContent,
    socialLinks,
    updateSocialLinks,
    footerDescription,
    setFooterDescription,
    announcementText,
    setAnnouncementText,
    dashboardStats: calculatedStats,
    registrationsOpen,
    setRegistrationsOpen,
    emailNotifications,
    setEmailNotifications,
    autoApprove,
    setAutoApprove,
    maintenanceMode,
    setMaintenanceMode,
    showToast,
    uploadFile,
    getGrowthData,
    updateRegistration,
    refreshData,
    navigate,
  };


  return (
    <AppDataContext.Provider value={value}>
      {children}
      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up transform transition-all duration-300 ${toast.type === 'success' ? 'bg-[#5f33e1] text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
                'bg-gray-800 text-white'
              }`}
          >
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className="text-sm font-bold tracking-tight uppercase">{toast.message}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </AppDataContext.Provider>
  );
};

