import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotFound from './NotFound';
import AdminPanel from './components/AdminPanel';
import HackathonsPage from './components/HackathonsPage';
import WorkshopsPage from './components/WorkshopsPage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventDetailsPage';
import WorkshopDetailsPage from './components/WorkshopDetailsPage';
import OtherEventDetailPage from './components/OtherEventDetailPage';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import './index.css';
import GlobalLoadingScreen from './components/GlobalLoadingScreen';
import OfflineOverlay from './components/OfflineOverlay';

const MainContent = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);
  const { loading } = useAppData();

  const [bootTimeout, setBootTimeout] = React.useState(false);

  React.useEffect(() => {
    console.log('[NerdsRoom] App Initialized. Path:', window.location.pathname);
    console.log('[NerdsRoom] Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'MISSING');

    // Safety timeout for the loader
    const timer = setTimeout(() => {
      setBootTimeout(true);
    }, 10000);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);

      if (window.location.hash) {
        setTimeout(() => {
          const id = window.location.hash.substring(1);
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/partner') return <NotFound />;
  if (currentPath === '/admin') return <AdminPanel />;
  if (currentPath === '/hackathons') return <HackathonsPage />;
  if (currentPath === '/workshops') return <WorkshopsPage />;
  if (currentPath === '/events') return <EventsPage />;

  if (currentPath.startsWith('/hackathons/')) return <EventDetailsPage />;
  if (currentPath.startsWith('/workshops/')) return <WorkshopDetailsPage />;
  if (currentPath.startsWith('/other-events/')) return <OtherEventDetailPage />;

  return (
    <>
      <OfflineOverlay />
      {loading && !bootTimeout && (
        <div className="fixed inset-0 z-[50]">
          <GlobalLoadingScreen />
        </div>
      )}
      <App />
    </>
  );
};

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AppDataProvider>
        <MainContent />
      </AppDataProvider>
    </ClerkProvider>
  </React.StrictMode>,
);

