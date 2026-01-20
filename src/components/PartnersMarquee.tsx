const PartnersMarquee = () => {
  const partners = ['Physics Wallah', 'Eleven Labs', 'Bolt', 'Y Combinator', 'Github'];

  return (
    <div className="bg-white py-6 sm:py-8 overflow-hidden">
      <p className="text-center text-nerdLime font-mono text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] font-black uppercase px-4">
        Supported by leading tech
      </p>
      <div className="marquee-container relative w-full overflow-hidden">
        <div className="flex w-max animate-scroll gap-8 xs:gap-12 sm:gap-16 items-center text-black font-black text-base xs:text-lg sm:text-xl md:text-2xl uppercase font-sans whitespace-nowrap">
          {[...partners, ...partners].map((partner, index) => (
            <span key={index}>
              <span>{partner}</span>
              {index < partners.length * 2 - 1 && <span className="text-nerdLime mx-2 sm:mx-4">•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;
