-- The connected Supabase project already has the portfolio schema and RLS policies.
-- Its existing schema uses:
--   projects.user_id (owner), projects.cover_url (image), projects.published (public visibility)
--   Storage bucket: project-covers
-- The application code maps cover_url to the UI's thumbnail_url field and uses auth.uid()
-- through Supabase RLS. Do not run the older setup script that added a separate
-- portfolio_admins allowlist or is_published column; it does not match this project's schema.
--
-- Read-only verification query:
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'projects'
order by ordinal_position;
