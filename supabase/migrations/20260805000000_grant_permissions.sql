-- Migration: Grant API roles access to leaderboard and profiles tables
GRANT ALL ON TABLE public.leaderboard TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
