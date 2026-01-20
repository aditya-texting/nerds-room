import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PartnersMarquee from './components/PartnersMarquee';
import PastEvents from './components/PastEvents';
import FlagshipEvents from './components/FlagshipEvents';
import WhatWeDo from './components/WhatWeDo';
import CommunitySays from './components/CommunitySays';
import JoinCommunity from './components/JoinCommunity';
import MissionLetter from './components/MissionLetter';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans relative scroll-smooth">
      <Navbar />
      <Hero />
      <PartnersMarquee />
      <PastEvents />
      <WhatWeDo />
      <FlagshipEvents />
      <CommunitySays />
      <JoinCommunity />
      <MissionLetter />
      <PhotoGallery />
      <Footer />
    </div>
  );
}

export default App;
