const PhotoGallery = () => {
  // Column 1 images (tall)
  const column1Images = [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=600&fit=crop',
  ];

  // Column 2 images (medium)
  const column2Images = [
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=400&fit=crop',
  ];

  // Center column images (tall)
  const centerImages = [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=600&fit=crop',
  ];

  // Column 3 images (medium)
  const column3Images = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=400&fit=crop',
  ];

  // Column 4 images (tall)
  const column4Images = [
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=600&fit=crop',
  ];

  return (
    <section id="gallery" className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 lg:py-0">
      <div className="relative mx-auto max-w-[1920px]">
        {/* Mobile View */}
        <div className="lg:hidden px-2 sm:px-4">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl text-zinc-900">Photo Gallery</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-600">A glimpse into our most memorable moments</p>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8 max-w-full">
            {/* Left Column */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
              {column1Images.map((img, index) => (
                <div
                  key={`mobile-col1-${index}`}
                  className="group relative h-[120px] w-[85px] sm:h-[150px] sm:w-[105px] md:h-[182px] md:w-[134px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden h-full w-full">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="object-cover w-full h-full transition-opacity duration-1000 ease-in-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                </div>
              ))}
            </div>
            {/* Center Column */}
            <div className="flex items-center justify-center flex-shrink-0">
              <div className="group relative h-[200px] w-[140px] sm:h-[250px] sm:w-[175px] md:h-[300px] md:w-[220px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative overflow-hidden h-full w-full">
                  <img
                    src={centerImages[0]}
                    alt="Center Gallery"
                    className="object-cover w-full h-full transition-opacity duration-1000 ease-in-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
              {column4Images.map((img, index) => (
                <div
                  key={`mobile-col4-${index}`}
                  className="group relative h-[120px] w-[85px] sm:h-[150px] sm:w-[105px] md:h-[182px] md:w-[134px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden h-full w-full">
                    <img
                      src={img}
                      alt={`Gallery ${index + 3}`}
                      className="object-cover w-full h-full transition-opacity duration-1000 ease-in-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block relative">
          <div className="relative flex items-start justify-center gap-[30px]">
            {/* Left Columns */}
            <div className="flex gap-[30px]">
              {/* Column 1 */}
              <div className="flex flex-col items-center justify-start gap-[30px] pt-[70px]">
                {column1Images.map((img, index) => (
                  <div
                    key={`desktop-col1-${index}`}
                    className="group relative h-[182px] w-[134px] overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden h-full w-full">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                  </div>
                ))}
              </div>
              {/* Column 2 */}
              <div className="flex flex-col items-center justify-start gap-[19px]">
                {column2Images.map((img, index) => (
                  <div
                    key={`desktop-col2-${index}`}
                    className="group relative h-[146px] w-[134px] overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden h-full w-full">
                      <img
                        src={img}
                        alt={`Gallery ${index + 3}`}
                        className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Section with Title */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative flex items-start justify-center gap-[30px] mt-2 mb-[113px]">
                  {centerImages.map((img, index) => (
                    <div
                      key={`desktop-center-${index}`}
                      className="group relative h-[250px] w-[135px] overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                      style={{ marginTop: index === 0 ? '63px' : index === 1 ? '27px' : index === 2 ? '0px' : '63px' }}
                    >
                      <div className="relative overflow-hidden h-full w-full">
                        <img
                          src={img}
                          alt={`Center Gallery ${index + 1}`}
                          className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                    </div>
                  ))}
                </div>
                <div className="relative text-center">
                  <h2 className="whitespace-nowrap font-semibold text-5xl text-zinc-900 sm:text-6xl md:text-7xl lg:text-[64px]">
                    Photo Gallery
                  </h2>
                  <p className="mt-4 text-lg text-zinc-600 sm:text-xl md:text-2xl">A glimpse into our most memorable moments</p>
                </div>
              </div>
            </div>

            {/* Right Columns */}
            <div className="flex gap-[30px]">
              {/* Column 3 */}
              <div className="flex flex-col items-center justify-start gap-[19px]">
                {column3Images.map((img, index) => (
                  <div
                    key={`desktop-col3-${index}`}
                    className="group relative h-[146px] w-[134px] overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden h-full w-full">
                      <img
                        src={img}
                        alt={`Gallery ${index + 6}`}
                        className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                  </div>
                ))}
              </div>
              {/* Column 4 */}
              <div className="flex flex-col items-center justify-start gap-[30px] pt-[70px]">
                {column4Images.map((img, index) => (
                  <div
                    key={`desktop-col4-${index}`}
                    className="group relative h-[182px] w-[134px] overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden h-full w-full">
                      <img
                        src={img}
                        alt={`Gallery ${index + 9}`}
                        className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
