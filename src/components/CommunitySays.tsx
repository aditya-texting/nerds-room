const CommunitySays = () => {
  const testimonials = [
    // Column 1
    [
      {
        name: 'Rohan Sharma',
        role: 'Full Stack Developer',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
        paragraphs: [
          'In college, I faced many distractions that could have led me astray. In my second year, joining the Nerds Room community was a turning point.',
          {
            text: 'Their events and sessions refocused me on my software development goals. ',
            bold: 'Thanks to Nerds Room, I found the direction and inspiration to follow my passion.',
            after: ' I\'m truly grateful for their support and the positive impact on my career.',
          },
        ],
        bgColor: 'bg-[#FEFCE8]', // Yellow
      },
      {
        name: 'Simran Kaur',
        role: 'Product Designer',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran',
        paragraphs: [
          {
            text: 'Nerds Room is my happy place. When I joined this community 2 years ago, I had no experience in proper communication. The team, especially the organizers, were so helpful and always encouraged me. ',
            bold: 'Thanks to Nerds Room, I\'ve improved my analytical thinking and task management skills and landed great opportunities.',
          },
        ],
        bgColor: 'bg-[#FFECEB]', // Red/Pink
      },
    ],
    // Column 2
    [
      {
        name: 'Amit Verma',
        role: 'Android Developer',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
        paragraphs: [
          {
            text: '',
            bold: 'Nerds Room introduced me to open-source tech communities.',
            after: ' Their guidance helped me advance my career, and I\'m grateful for the opportunities Nerds Room provided. I\'m now excited to share my own experiences as a speaker!',
          },
        ],
        bgColor: 'bg-[#FFECEB]', // Red/Pink
      },
      {
        name: 'Priya Singh',
        role: 'UX Designer',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        paragraphs: [
          {
            text: 'I had the privilege of meeting amazing designers at Nerds Room events. I learned the fundamentals of design from their workshops. As distinguished speakers at the events, they left an indelible mark on me. ',
            bold: 'I am grateful to Nerds Room for providing me with this opportunity to connect with great designers,',
            after: ' which has accelerated my career growth and development.',
          },
        ],
        bgColor: 'bg-[#F0FFF4]', // Green
      },
    ],
    // Column 3
    [
      {
        name: 'Karan Mehta',
        role: 'Project Coordinator',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
        paragraphs: [
          {
            text: 'Being part of Nerds Room was transformative for me. It was more than a community; it was where I found my voice and my people. Nerds Room was my safe space to share ideas and learn without fear. ',
            bold: 'I\'ll never forget speaking at the hackathon event.',
            after: ' I was terrified, but they believed in me and gave me the courage to step into the spotlight. ',
            bold2: 'The connections I made built a reliable support system.',
            after2: ' The conversations, brainstorming, and sense of belonging helped me grow.',
          },
        ],
        bgColor: 'bg-[#EBF8FF]', // Blue
      },
      {
        name: 'Neha Patel',
        role: 'Associate Project Manager',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
        paragraphs: [
          {
            text: 'Their guidance helped me advance my career, and I\'m grateful for the opportunities Nerds Room provided. ',
            bold: 'The sessions and hands-on workshops inspired me to contribute to open source,',
            after: ' and collaborations sparked new friendships.',
          },
        ],
        bgColor: 'bg-[#FDF1D3]', // Orange/Peach
      },
    ],
  ];

  return (
    <section id="testimonials" className="relative w-full overflow-hidden py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 text-center md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-zinc-900 mb-2 sm:mb-4">
            <span className="font-bold">Success Stories</span> that Define Our Community
          </h2>
        </div>
        <div className="max-w-[1400px] mx-auto">
          <div className="hide-scrollbar flex flex-nowrap items-stretch overflow-x-auto space-x-4 sm:space-x-6 md:space-x-8 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-x-visible lg:space-x-0 lg:items-stretch">
            {testimonials.map((column, colIndex) => (
              <div
                key={colIndex}
                className="flex-none w-[calc(100vw-2rem)] sm:w-96 flex flex-col gap-4 sm:gap-6 md:gap-5 lg:w-auto h-full"
              >
                {column.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`${testimonial.bgColor} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm w-full flex flex-col justify-between flex-grow transition-transform hover:scale-[1.02] duration-300`}
                  >
                    <div className="text-sm sm:text-base md:text-base lg:text-base leading-relaxed text-zinc-600">
                      {testimonial.paragraphs.map((para, pIndex) => {
                        if (typeof para === 'string') {
                          return (
                            <p key={pIndex} className="mb-3 sm:mb-4">
                              {para}
                            </p>
                          );
                        }
                        return (
                          <p key={pIndex} className="mb-3 sm:mb-4">
                            {para.text}
                            {'bold' in para && para.bold && (
                              <strong className="font-semibold text-zinc-900">{para.bold}</strong>
                            )}
                            {'after' in para && para.after}
                            {'bold2' in para && para.bold2 && (
                              <strong className="font-semibold text-zinc-900">{para.bold2}</strong>
                            )}
                            {'after2' in para && para.after2}
                          </p>
                        );
                      })}
                    </div>
                    <div className="flex items-center mt-4 sm:mt-6">
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm md:text-base font-semibold text-zinc-900 truncate">{testimonial.name}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-zinc-600 truncate">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySays;
