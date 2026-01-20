import { useEffect, useRef } from 'react';

const PastEvents = () => {
  const slidesRef = useRef<HTMLImageElement[]>([]);
  let currentSlide = 0;

  useEffect(() => {
    const slides = slidesRef.current;
    if (slides.length === 0) return;

    const nextSlide = () => {
      slides[currentSlide]?.classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide]?.classList.add('active');
    };

    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="past-events" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
        {/* Image Carousel */}
        <div className="order-2 md:order-1 relative">
          <div className="bg-nerdBlue p-1.5 sm:p-2 shadow-hard transform md:-rotate-1 rounded-lg hover:shadow-[8px_8px_0px_0px_#00308F] transition-shadow duration-300">
            <div className="carousel-container h-[250px] xs:h-[280px] sm:h-[320px] md:h-[400px] lg:h-[450px] w-full bg-black relative rounded overflow-hidden">
              <img
                ref={(el) => {
                  if (el) slidesRef.current[0] = el;
                }}
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                className="slide active"
                alt="Event 1"
              />
              <img
                ref={(el) => {
                  if (el) slidesRef.current[1] = el;
                }}
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
                className="slide"
                alt="Event 2"
              />
              <img
                ref={(el) => {
                  if (el) slidesRef.current[2] = el;
                }}
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
                className="slide"
                alt="Event 3"
              />
              <img
                ref={(el) => {
                  if (el) slidesRef.current[3] = el;
                }}
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                className="slide"
                alt="Event 4"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 h-16 sm:h-20"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="order-1 md:order-2 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-nerdBlue inline-block border-b-4 sm:border-b-6 md:border-b-8 border-nerdLime leading-[0.85] pb-2 sm:pb-3">
              PAST<br />
              EVENTS
            </h2>
          </div>
          
          <div className="text-base sm:text-lg font-medium text-gray-700 space-y-3 sm:space-y-4">
            <p className="border-l-4 border-nerdBlue pl-3 sm:pl-4 leading-relaxed">
              We are tired of boring corporate conferences. We wanted a space where the energy is practical, the people
              are building, and the ideas are raw.
            </p>
            <p className="leading-relaxed">
              From 24-hour hackathons to intense ideation jams, we've brought together hundreds of students across NCR
              to build things that actually matter.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 pt-2">
            <div className="text-center flex-1">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-nerdBlue">15+</span>
              <span className="text-[10px] xs:text-xs font-bold uppercase text-gray-500 tracking-wide">Events Hosted</span>
            </div>
            <div className="w-px bg-gray-300 h-10 sm:h-12"></div>
            <div className="text-center flex-1">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-nerdBlue">500+</span>
              <span className="text-[10px] xs:text-xs font-bold uppercase text-gray-500 tracking-wide">Builders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;
