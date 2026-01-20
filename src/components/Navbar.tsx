import { useState, useEffect } from 'react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      id="navbar"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-6xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-full transition-all duration-300 px-4 py-2"
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group z-50" onClick={(e) => handleSmoothScroll(e, '#home')}>
          <img
            src="/logo.png"
            alt="Nerds Room Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-black text-2xl tracking-tight text-nerdBlue">
            nerds room<span className="text-nerdLime">.</span>
          </span>
        </a>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-nerdDark text-[15px]">
            <a
              href="#home"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => handleSmoothScroll(e, '#home')}
            >
              Home
            </a>
            <a
              href="#past-events"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => handleSmoothScroll(e, '#past-events')}
            >
              Events
            </a>
            <a
              href="#events"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => handleSmoothScroll(e, '#events')}
            >
              What We Do
            </a>
            <a
              href="#socials"
              className="hover:text-nerdBlue transition-colors"
              onClick={(e) => handleSmoothScroll(e, '#socials')}
            >
              Contact
            </a>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <a
              href="/partner"
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
        className={`fixed inset-x-0 top-[80px] bg-white border-b-2 border-nerdBlue shadow-xl p-6 lg:hidden animate-fade-in origin-top ${
          mobileMenuOpen ? 'block' : 'hidden'
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
            href="#past-events"
            className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
            onClick={(e) => handleSmoothScroll(e, '#past-events')}
          >
            EVENTS <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
          </a>
          <a
            href="#events"
            className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
            onClick={(e) => handleSmoothScroll(e, '#events')}
          >
            WHAT WE DO <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
          </a>
          <a
            href="#socials"
            className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
            onClick={(e) => handleSmoothScroll(e, '#socials')}
          >
            CONTACT <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
          </a>
          <a
            href="/partner"
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
