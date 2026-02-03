Oil for the Journey 📖

Oil for the Journey is a reflective writing platform built to document faith based thoughts, teachings, and weekly notes in a calm, readable environment.

The project combines a reverent visual style with a modern web stack, allowing content to be written privately, saved as drafts, and published intentionally.

This is not a social platform.
It is a place for reflection, growth, and continuity.

Purpose ✍️
This project exists to

• Capture spiritual reflections and teachings  
• Publish long form notes in a readable, distraction free format  
• Support private drafting and controlled publishing  
• Create a digital journal that grows over time  

Features 🔐
• Public notes and weekly reflections  
• Admin only access for writing, editing, and deleting  
• Draft and published content separation  
• Supabase powered authentication and database storage  
• Responsive layout optimised for reading  
• Calm old paper styling and Bible themed loading states  

Tech Stack ⚙️
• Next.js App Router  
• TypeScript  
• Supabase Auth and Database  
• Tailwind CSS  
• Vercel hosting  

Content Structure
• Home page for orientation and navigation  
• Notes index for browsing published notes  
• Individual note pages for reading and sharing  
• Admin area for drafting, editing, and publishing  

Environment Variables
The following variables are used by this project

• NEXT_PUBLIC_SUPABASE_URL  
• NEXT_PUBLIC_SUPABASE_ANON_KEY  
• SUPABASE_SERVICE_ROLE_KEY  

These should be set locally in `.env.local` and in Vercel project settings for production.

Running Locally 🚀
Install dependencies
```bash
npm install
```

Start the development server
```bash
npm run dev
```

Build for production
```bash
npm run build
```

Deployment
The project is deployed using Vercel.

Production builds are triggered via the Vercel CLI or GitHub integration once environment variables are configured.

Status
This project is actively evolving. Features and content will continue to be refined over time.

Author
Joshua Hilarion

Built as part of a long term journey combining faith, clarity, and software craftsmanship.
