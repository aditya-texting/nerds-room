-- Populate details for major hackathons
-- This updates existing hackathons with professional 'about', 'prizes', 'rules', and 'resources' data.

-- 1. DeveloperWeek 2026 Hackathon
UPDATE public.hackathons 
SET 
    description = 'The world''s largest developer conference & expo hackathon. Join 500+ developers building the future.',
    about = 'DeveloperWeek is the world’s largest developer conference & event series. The DeveloperWeek Hackathon is North America’s largest challenge-driven hackathon! Join 500+ participants as you build new apps using some of the newest and most advanced technologies.',
    prizes = '[
        {"title": "Grand Prize", "amount": "$5,000", "description": "Best overall project using DeveloperWeek APIs"},
        {"title": "Best Web App", "amount": "$2,500", "description": "Most innovative web-based solution"},
        {"title": "Best AI Integration", "amount": "$2,500", "description": "Best use of LLMs and generative AI"}
    ]'::jsonb,
    rules = '[
        "Teams can have up to 4 members.",
        "Must use at least one sponsor technology mentioned in the brief.",
        "All code must be written during the 48-hour period.",
        "Final presentation is mandatory for prize eligibility."
    ]'::jsonb,
    resources = '[
        {"name": "API Documentation", "link": "https://developerweek.com/docs"},
        {"name": "DeveloperWeek Discord", "link": "https://discord.gg/developerweek"},
        {"name": "Project Template", "link": "https://github.com/developerweek/template"}
    ]'::jsonb
WHERE slug = 'developerweek-2026' OR title ILIKE '%DeveloperWeek%';

-- 2. DigitalOcean Gradient AI Hackathon
UPDATE public.hackathons 
SET 
    description = 'Leverage DigitalOcean''s Gradient™ platform to build and deploy high-performance AI models.',
    about = 'DigitalOcean Gradient brings the power of AI to every developer. In this hackathon, we challenge you to build scalable, AI-driven applications using Gradient''s infrastructure. Whether it''s a chatbot, a recommendation engine, or a computer vision tool, we want to see what you can create.',
    prizes = '[
        {"title": "1st Place", "amount": "$10,000", "description": "Best overall AI application deployed on Gradient"},
        {"title": "Infrastructure Choice", "amount": "$5,000", "description": "Best use of DigitalOcean Droplets + Gradient"},
        {"title": "Community Choice", "amount": "DigitalOcean Credits", "description": "Voted by participants"}
    ]'::jsonb,
    rules = '[
        "Application must be deployed on DigitalOcean Gradient.",
        "Open-source projects only.",
        "Must include a detailed README and technical documentation.",
        "Teams can be global (Online)."
    ]'::jsonb,
    resources = '[
        {"name": "Gradient Getting Started", "link": "https://www.digitalocean.com/products/gradient"},
        {"name": "Sample AI Projects", "link": "https://github.com/digitalocean/gradient-samples"},
        {"name": "DO Community Tutorials", "link": "https://www.digitalocean.com/community"}
    ]'::jsonb
WHERE slug = 'digitalocean-gradient' OR title ILIKE '%DigitalOcean%';

-- 3. Nerds Room Winter Hackathon 2026
UPDATE public.hackathons 
SET 
    description = 'The flagship internal hackathon for the Nerds Room community. Build, innovate, and lead.',
    about = 'Nerds Room Winter Hackathon is our annual premier event where the brightest minds in our community come together to solve local and global challenges. It''s a 48-hour sprint of pure innovation, networking, and learning from senior mentors.',
    prizes = '[
        {"title": "Winner", "amount": "₹50,000", "description": "Best overall community project"},
        {"title": "Runner Up", "amount": "₹30,000", "description": "Outstanding engineering and UX"},
        {"title": "Best Campus Hook", "amount": "₹20,000", "description": "Best solution for university life"}
    ]'::jsonb,
    rules = '[
        "Exclusive to verified Nerds Room members.",
        "Physical presence at the host chapter is required.",
        "Maximum 3 nerds per team.",
        "Zero tolerance for plagiarism."
    ]'::jsonb,
    resources = '[
        {"name": "Nerds Room Portal", "link": "https://nerdsroom.in"},
        {"name": "Team Formation Guide", "link": "/docs/teams"},
        {"name": "Mentorship Request", "link": "/support"}
    ]'::jsonb
WHERE slug = 'nerds-room-winter' OR title ILIKE '%Winter Hackathon%';
