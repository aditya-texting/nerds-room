
import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

const DataSeeder = () => {
    const {
        addFlagshipEvent,
        addSuccessStory,
        addPhotoGalleryItem,
        addWhatWeDoCard,
        addChapter,
        flagshipEvents,
        successStories,
        photoGallery,
        whatWeDoCards,
        chapters
    } = useAppData();

    const [seeding, setSeeding] = useState(false);
    const [status, setStatus] = useState('');

    const seedEvents = async () => {
        if (flagshipEvents.length > 0) return;
        const events = [
            {
                title: 'InnovWar Tech Fest',
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
                description: 'The ultimate tech showdown.',
                location: 'Multiple Venues, NCR',
                stats: [{ label: 'Registrations', value: '500' }, { label: 'Attendees', value: '400' }, { label: 'Speakers', value: '25' }],
                is_public: true,
                is_featured: false
            },
            {
                title: 'Major Hackathons',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
                description: 'Pan India coding marathons.',
                location: 'Pan India',
                stats: [{ label: 'Registrations', value: '2000' }, { label: 'Attendees', value: '1500' }, { label: 'Speakers', value: '50' }],
                is_public: true,
                is_featured: false
            },
            {
                title: 'Tech Conclaves',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
                description: 'Expert-led deep dives.',
                location: 'Lucknow, Gurugram, Noida',
                stats: [{ label: 'Registrations', value: '800' }, { label: 'Attendees', value: '600' }, { label: 'Speakers', value: '30' }],
                is_public: true,
                is_featured: false
            }
        ];
        for (const e of events) await addFlagshipEvent(e);
    };

    const seedStories = async () => {
        if (successStories.length > 0) return;
        const stories = [
            {
                name: 'Rohan Sharma',
                role: 'Full Stack Developer',
                image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
                bg_color: 'bg-[#FEFCE8]',
                column_group: 1,
                display_order: 1,
                content: [
                    'In college, I faced many distractions that could have led me astray. In my second year, joining the Nerds Room community was a turning point.',
                    {
                        text: 'Their events and sessions refocused me on my software development goals. ',
                        bold: 'Thanks to Nerds Room, I found the direction and inspiration to follow my passion.',
                        after: ' I\'m truly grateful for their support and the positive impact on my career.',
                    }
                ]
            },
            {
                name: 'Simran Kaur',
                role: 'Product Designer',
                image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran',
                bg_color: 'bg-[#FFECEB]',
                column_group: 1,
                display_order: 2,
                content: [
                    {
                        text: 'Nerds Room is my happy place. When I joined this community 2 years ago, I had no experience in proper communication. The team, especially the organizers, were so helpful and always encouraged me. ',
                        bold: 'Thanks to Nerds Room, I\'ve improved my analytical thinking and task management skills and landed great opportunities.',
                    }
                ]
            },
            {
                name: 'Amit Verma',
                role: 'Android Developer',
                image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
                bg_color: 'bg-[#FFECEB]',
                column_group: 2,
                display_order: 1,
                content: [
                    {
                        text: '',
                        bold: 'Nerds Room introduced me to open-source tech communities.',
                        after: ' Their guidance helped me advance my career, and I\'m grateful for the opportunities Nerds Room provided. I\'m now excited to share my own experiences as a speaker!',
                    }
                ]
            },
            {
                name: 'Priya Singh',
                role: 'UX Designer',
                image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
                bg_color: 'bg-[#F0FFF4]',
                column_group: 2,
                display_order: 2,
                content: [
                    {
                        text: 'I had the privilege of meeting amazing designers at Nerds Room events. I learned the fundamentals of design from their workshops. As distinguished speakers at the events, they left an indelible mark on me. ',
                        bold: 'I am grateful to Nerds Room for providing me with this opportunity to connect with great designers,',
                        after: ' which has accelerated my career growth and development.',
                    }
                ]
            },
            {
                name: 'Karan Mehta',
                role: 'Project Coordinator',
                image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
                bg_color: 'bg-[#EBF8FF]',
                column_group: 3,
                display_order: 1,
                content: [
                    {
                        text: 'Being part of Nerds Room was transformative for me. It was more than a community; it was where I found my voice and my people. Nerds Room was my safe space to share ideas and learn without fear. ',
                        bold: 'I\'ll never forget speaking at the hackathon event.',
                        after: ' I was terrified, but they believed in me and gave me the courage to step into the spotlight. ',
                        bold2: 'The connections I made built a reliable support system.',
                        after2: ' The conversations, brainstorming, and sense of belonging helped me grow.',
                    }
                ]
            },
            {
                name: 'Neha Patel',
                role: 'Associate Project Manager',
                image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
                bg_color: 'bg-[#FDF1D3]',
                column_group: 3,
                display_order: 2,
                content: [
                    {
                        text: 'Their guidance helped me advance my career, and I\'m grateful for the opportunities Nerds Room provided. ',
                        bold: 'The sessions and hands-on workshops inspired me to contribute to open source,',
                        after: ' and collaborations sparked new friendships.',
                    }
                ]
            }
        ];
        for (const s of stories) await addSuccessStory(s);
    };

    const seedPhotos = async () => {
        if (photoGallery.length > 0) return;
        const col1 = [
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=600&fit=crop'
        ];
        const col2 = [
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=400&fit=crop'
        ];
        const center = [
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=600&fit=crop'
        ];
        const col3 = [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=400&fit=crop'
        ];
        const col4 = [
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=600&fit=crop',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=600&fit=crop'
        ];

        for (const img of col1) await addPhotoGalleryItem({ image_url: img, category: 'col1' });
        for (const img of col2) await addPhotoGalleryItem({ image_url: img, category: 'col2' });
        for (const img of center) await addPhotoGalleryItem({ image_url: img, category: 'center' });
        for (const img of col3) await addPhotoGalleryItem({ image_url: img, category: 'col3' });
        for (const img of col4) await addPhotoGalleryItem({ image_url: img, category: 'col4' });
    };

    const seedCards = async () => {
        if (whatWeDoCards.length > 0) return;
        const cards = [
            {
                title: 'HACKATHONS',
                icon: '🏆',
                description: 'Compete in high-energy coding battles to build solutions for real-world problems.',
                stat: '12+',
                statLabel: 'Hosted',
                iconBg: 'bg-nerdLime',
                gradient: 'from-nerdLime/10 to-transparent'
            },
            {
                title: 'WORKSHOPS',
                icon: '💡',
                description: 'Hands-on learning experiences on latest tech stacks led by industry experts.',
                stat: '50+',
                statLabel: 'Sessions',
                iconBg: 'bg-nerdBlue',
                gradient: 'from-nerdBlue/10 to-transparent'
            },
            {
                title: 'COMMUNITY',
                icon: '🤝',
                description: 'A growing network of developers across India collaborating on open source.',
                stat: '5k+',
                statLabel: 'Members',
                iconBg: 'bg-purple-500',
                gradient: 'from-purple-500/10 to-transparent'
            },
            {
                title: 'PROJECTS',
                icon: '💻',
                description: 'Building production-ready applications that make a difference.',
                stat: '100+',
                statLabel: 'Shipped',
                iconBg: 'bg-orange-500',
                gradient: 'from-orange-500/10 to-transparent'
            }
        ];
        for (const c of cards) await addWhatWeDoCard(c);
    };

    const seedChapters = async () => {
        if (chapters.length > 0) return;
        const chapterList = [
            { name: 'Lucknow', location: 'Uttar Pradesh' },
            { name: 'Noida', location: 'Uttar Pradesh' },
            { name: 'Delhi', location: 'New Delhi' },
            { name: 'Bangalore', location: 'Karnataka' }
        ];
        for (const c of chapterList) await addChapter(c);
    };

    const seedAll = async () => {
        setSeeding(true);
        setStatus('Seeding Events...');
        await seedEvents();
        setStatus('Seeding Stories...');
        await seedStories();
        setStatus('Seeding Photos...');
        await seedPhotos();
        setStatus('Seeding Cards...');
        await seedCards();
        setStatus('Seeding Chapters...');
        await seedChapters();
        setStatus('Done!');
        setTimeout(() => {
            setSeeding(false);
            setStatus('');
        }, 2000);
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            <button
                onClick={seedAll}
                disabled={seeding}
                className="bg-nerdDark text-white px-4 py-2 rounded-lg shadow-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
                {seeding ? status : 'Seed Dummy Data to DB'}
            </button>
        </div>
    );
};

export default DataSeeder;
