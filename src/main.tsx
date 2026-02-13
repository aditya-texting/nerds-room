import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotFound from './NotFound';
import AdminPanel from './components/AdminPanel';
import HackathonsPage from './components/HackathonsPage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventDetailsPage';
import { AppDataProvider } from './context/AppDataContext';
import './index.css';

import OfflineOverlay from './components/OfflineOverlay';

const MainContent = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Custom event for programmatic navigation without popstate
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/partner') return <NotFound />;
  if (currentPath === '/admin') return <AdminPanel />;
  if (currentPath === '/hackathons') return <HackathonsPage />;
  if (currentPath === '/events') return <EventsPage />;

  if (currentPath.startsWith('/hackathons/')) return <EventDetailsPage />;

  return (
    <>
      <OfflineOverlay />
      <App />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppDataProvider>
      <MainContent />
    </AppDataProvider>
  </React.StrictMode>,
);

