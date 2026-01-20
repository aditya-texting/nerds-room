const Footer = () => {
  return (
    <footer className="bg-[#202124] text-white relative rounded-t-[40px] md:rounded-t-[60px] mt-8 md:mt-12">
      <div className="mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pt-16 md:pt-20 lg:pt-24 pb-6 md:pb-8">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20">
            {/* Logo & Description */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Nerds Room Logo"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-lg"
                />
                <span className="font-black text-2xl tracking-tight text-white">
                  nerds room<span className="text-nerdLime">.</span>
                </span>
              </div>
              <p className="text-gray-300 text-base leading-relaxed max-w-[250px]">
                Empowering developers to build, learn, and grow together in the tech community.
              </p>
            </div>

            {/* About */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-base font-semibold">About</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="#home"
                  className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  About Us
                </a>
                <a
                  href="#socials"
                  className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Contact Us
                </a>
                <a
                  href="#events"
                  className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Events
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-base font-semibold">Resources</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="#past-events"
                  className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Past Events
                </a>
                <a
                  href="#gallery"
                  className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Gallery
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  Testimonials
                </a>
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-5">
              <h3 className="text-white text-base font-semibold">Follow Us</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://instagram.com/nerdsroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 group-hover:text-white transition-colors"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  <span>nerdsroom</span>
                </a>
                <a
                  href="https://twitter.com/nerdsroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 group-hover:text-white transition-colors"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span>nerdsroom</span>
                </a>
                <a
                  href="https://linkedin.com/company/nerdsroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 group-hover:text-white transition-colors"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span>nerdsroom</span>
                </a>
                <a
                  href="https://youtube.com/@nerdsroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 group-hover:text-white transition-colors"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                  <span>nerdsroom</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-gray-400 text-base font-medium">© Nerds Room. All rights reserved.</div>
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                <a href="#privacy" className="text-gray-400 text-base hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
                <span className="text-gray-600">•</span>
                <a href="#terms" className="text-gray-400 text-base hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
                <span className="text-gray-600">•</span>
                <a href="#cookies" className="text-gray-400 text-base hover:text-white transition-colors duration-200">
                  Cookies Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
