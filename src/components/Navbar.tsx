import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { navigate } = useAppData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      const targetId = href.startsWith('#') ? href : href.substring(href.indexOf('#'));
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      navigate(href.startsWith('/') ? href : `/${href}`);
    }
  };

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-[100] w-full px-4 pt-4 pointer-events-none"
    >
      <div className="relative max-w-[95vw] sm:max-w-fit mx-auto px-4 sm:px-6 md:px-8 h-12 sm:h-14 flex justify-between items-center gap-4 sm:gap-8 md:gap-12 bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg rounded-full pointer-events-auto transition-all duration-300">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 sm:gap-3 group z-50 shrink-0"
          onClick={(e) => {
            e.preventDefault();
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}
        >
          <img
            src="/logo.png"
            alt="Nerds Room Logo"
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-black text-lg sm:text-2xl tracking-tight text-nerdBlue whitespace-nowrap">
            nerds room<span className="text-nerdLime">.</span>
          </span>
        </a>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-nerdDark text-[15px]">
            <a
              href="/"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
            >
              Home
            </a>
            <a
              href="/events"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => { e.preventDefault(); navigate('/events'); }}
            >
              Events
            </a>
            <a
              href="#what-we-do"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => handleSmoothScroll(e, '#what-we-do')}
            >
              What We Do
            </a>

          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:flex items-center justify-center bg-nerdBlue text-white font-bold px-6 py-2.5 rounded-lg border border-transparent hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-md hover:shadow-none text-sm tracking-wide">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSegbpqFbVYJKHiIXdK8tqGzbOntQGNHaW64qvkGpr9k85lE1Q/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center bg-nerdBlue text-white font-bold px-6 py-2.5 rounded-lg border border-transparent hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-md hover:shadow-none text-sm tracking-wide"
            >
              Partner
            </a>
            <button
              id="mobile-menu-btn"
              className="lg:hidden text-nerdBlue p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[64px] bg-white border-b-2 border-nerdBlue shadow-xl p-6 lg:hidden animate-fade-in origin-top ${mobileMenuOpen ? 'block' : 'hidden'
          }`}
      >
        <div className="flex flex-col space-y-4 font-bold text-nerdBlue text-lg">
          <a
            href="#home"
            className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
            onClick={(e) => handleSmoothScroll(e, '#home')}
          >
            HOME <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
          </a>
          <a
            href="/events"
            className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
            onClick={(e) => { e.preventDefault(); navigate('/events'); setMobileMenuOpen(false); }}
          >
            EVENTS <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
          </a>
          <a
            href="#what-we-do"
            className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
            onClick={(e) => handleSmoothScroll(e, '#what-we-do')}
          >
            WHAT WE DO <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
          </a>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSegbpqFbVYJKHiIXdK8tqGzbOntQGNHaW64qvkGpr9k85lE1Q/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-nerdBlue text-white text-center py-3 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-colors font-black"
          >
            BECOME A PARTNER
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
