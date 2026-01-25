-- Storage for images used in notes

-- Create bucket in UI first:
-- Storage -> Buckets -> New bucket
-- Name: note-images
-- Public: ON

-- Then run these policies in SQL Editor

-- Allow anyone to read images (public bucket read)
drop policy if exists "public can read note images" on storage.objects;
create policy "public can read note images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'note-images');

-- Only signed in users can upload
drop policy if exists "authenticated can upload note images" on storage.objects;
create policy "authenticated can upload note images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'note-images');

-- Only signed in users can update and delete
drop policy if exists "authenticated can update note images" on storage.objects;
create policy "authenticated can update note images"
on storage.objects
for update
to authenticated
using (bucket_id = 'note-images')
with check (bucket_id = 'note-images');

drop policy if exists "authenticated can delete note images" on storage.objects;
create policy "authenticated can delete note images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'note-images');
