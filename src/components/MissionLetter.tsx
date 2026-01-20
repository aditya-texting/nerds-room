const MissionLetter = () => {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-20 lg:py-24 bg-white px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center px-0 sm:px-4">
          <div
            className="relative bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-14 w-full max-w-xl sm:max-w-2xl shadow-lg md:-rotate-1"
          >
            {/* Letter Content */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Heading */}
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-1 sm:mb-2 leading-tight"
                style={{ fontFamily: 'Host Grotesk, sans-serif' }}
              >
                Dear Future Innovator,
              </h2>

              {/* Paragraphs */}
              <div
                className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-black leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <p>The world is moving faster than ever. Standard education isn't keeping up. The old paths are crumbling.</p>

                <p className="font-semibold">The truth is:</p>

                <p>No one knows exactly what the future looks like. But we know who will build it.</p>

                <p>
                  At Nerds Room, we aren't just a community; we are an engine. An engine that turns raw potential into
                  shipping products. We believe that the most valuable thing we can do is help each other create.
                </p>

                <p>We are here to make sense of this new era, one line of code at a time.</p>

                <p>Welcome to Nerds Room. Let's build the future we want to live in.</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6">
              <div className="w-10 h-10 sm:w-[46px] sm:h-[46px] rounded-full overflow-hidden flex-shrink-0 relative">
                <img
                  src="https://framerusercontent.com/images/vjfjvNnCugcFBuZemZrm4mJhs4.png?width=184&height=184"
                  alt="Aditya Pandey"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-0">
                <h6 className="text-base font-semibold" style={{ color: 'rgb(255, 102, 31)', fontFamily: 'Inter, sans-serif' }}>
                  Aditya Pandey
                </h6>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionLetter;
