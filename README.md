Oil for the Journey 📖

Oil for the Journey is a small teaching notes site with a calm reading experience, an old paper aesthetic, and an admin editor for publishing weekly notes.

What it does ✍️
1. Public Weekly Notes page that lists published notes
2. Individual note pages rendered from rich text content
3. Admin area to create, edit, delete, and manage drafts
4. Drafts stay hidden from the public until they are published
5. Smooth, calm loading states and an aged paper style across pages

Tech stack ⚙️
1. Next.js (App Router) and React
2. TypeScript
3. Supabase (Auth and Postgres)
4. TipTap editor for note content
5. Tailwind CSS for styling

Run locally
1. Install dependencies
```bash
npm install
```

2. Add environment variables in `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL="https://yourprojectref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="youranonkey"
```

3. Start the dev server
```bash
npm run dev
```

4. Open the site
Visit `http://localhost:3000`

Admin access 🔐
1. Visit `/admin`
2. If you are signed out, you will be redirected to `/login`
3. After signing in, you can create and manage notes

Admin workflow
1. Create a new note at `/admin/new`
2. Use Save Draft to keep it private
3. Use Publish to make it visible on the public Notes pages
4. Edit an existing note at `/admin/edit/[slug]`
5. Delete from the admin list (or the note page while logged in)

Quality checks
```bash
npm run lint
npm run build
```

Deployment
This project deploys cleanly on Vercel. Set the same environment variables in your Vercel project settings.
