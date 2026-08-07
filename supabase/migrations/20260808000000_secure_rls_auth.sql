-- Migration: Secure RLS with Supabase Auth
-- Date: 2026-08-08

-- 1. Modify profiles table to use auth.users UUID as Primary Key
-- We need to drop the default UUID generation and make it link to auth.users.
-- Since we are okay with losing old accounts, we will truncate the table and alter the ID column.

TRUNCATE TABLE profiles;

ALTER TABLE profiles DROP CONSTRAINT profiles_pkey;
-- In Supabase, auth.users has an id of type UUID.
-- But the current profiles.id is UUID. So we just add a foreign key constraint.
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE profiles ADD PRIMARY KEY (id);

-- We no longer need hashed_key to be mandatory or unique with username. We can drop it or make it nullable.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_hashed_key_key;
ALTER TABLE profiles ALTER COLUMN hashed_key DROP NOT NULL;
-- Now username is unique by itself
ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);

-- 2. Lock down profiles RLS
DROP POLICY IF EXISTS "Lecture publique profils" ON profiles;
DROP POLICY IF EXISTS "Insertion publique profils" ON profiles;
DROP POLICY IF EXISTS "Mise a jour publique profils" ON profiles;

CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- 3. Lock down friendships RLS
-- A user can only see and modify friendships where they are the requester or addressee.
DROP POLICY IF EXISTS "Public friendships" ON friendships;

-- To lookup friendships, we need to join on profiles. But wait, we can just allow users to see all friendships, 
-- or only their own. Actually, to add a friend, you need to be authenticated.
CREATE POLICY "Users can see their own friendships" ON friendships
  FOR SELECT USING (
    requester_username = (SELECT username FROM profiles WHERE id = auth.uid()) OR 
    addressee_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own friendships" ON friendships
  FOR INSERT WITH CHECK (
    requester_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete their own friendships" ON friendships
  FOR DELETE USING (
    requester_username = (SELECT username FROM profiles WHERE id = auth.uid()) OR 
    addressee_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

-- 4. Lock down friend_notifications RLS
DROP POLICY IF EXISTS "Public notifications" ON friend_notifications;

CREATE POLICY "Users can read their own notifications" ON friend_notifications
  FOR SELECT USING (
    to_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can send notifications" ON friend_notifications
  FOR INSERT WITH CHECK (
    from_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own notifications (mark as read)" ON friend_notifications
  FOR UPDATE USING (
    to_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete their own notifications" ON friend_notifications
  FOR DELETE USING (
    to_username = (SELECT username FROM profiles WHERE id = auth.uid())
  );

-- 5. Battles RLS
DROP POLICY IF EXISTS "Lecture publique battles" ON battles;
DROP POLICY IF EXISTS "Insertion publique battles" ON battles;
DROP POLICY IF EXISTS "Mise a jour publique battles" ON battles;
DROP POLICY IF EXISTS "Suppression publique battles" ON battles;

-- Public can see waiting public battles (for matchmaking)
CREATE POLICY "Anyone can read waiting public battles" ON battles
  FOR SELECT USING (status = 'waiting' AND is_public = true);

-- Participants can read their battles
CREATE POLICY "Participants can read battles" ON battles
  FOR SELECT USING (
    player1_id = (SELECT username FROM profiles WHERE id = auth.uid()) OR 
    player2_id = (SELECT username FROM profiles WHERE id = auth.uid()) OR
    (status = 'waiting' AND is_public = false) -- allow reading to join private
  );

-- Only authenticated users can create battles
CREATE POLICY "Authenticated users can create battles" ON battles
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    player1_id = (SELECT username FROM profiles WHERE id = auth.uid())
  );

-- Only participants can update battles, OR someone joining an empty slot
CREATE POLICY "Participants can update battles" ON battles
  FOR UPDATE USING (
    player1_id = (SELECT username FROM profiles WHERE id = auth.uid()) OR 
    player2_id = (SELECT username FROM profiles WHERE id = auth.uid()) OR
    (status = 'waiting' AND player2_id IS NULL)
  );

-- Only player1 can delete their own battle
CREATE POLICY "Creator can delete battle" ON battles
  FOR DELETE USING (
    player1_id = (SELECT username FROM profiles WHERE id = auth.uid())
  );

-- 6. Leaderboard RLS
-- Anyone can read the leaderboard
DROP POLICY IF EXISTS "Insertion publique" ON leaderboard;
DROP POLICY IF EXISTS "Mise a jour publique" ON leaderboard;
DROP POLICY IF EXISTS "Anyone can read the leaderboard" ON leaderboard;

CREATE POLICY "Anyone can read the leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- To allow users to insert/update their own score on the leaderboard, they must be the owner.
-- We can match by name = profile.username
CREATE POLICY "Users can insert their own score" ON leaderboard
  FOR INSERT WITH CHECK (
    name = (SELECT username FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own score" ON leaderboard
  FOR UPDATE USING (
    name = (SELECT username FROM profiles WHERE id = auth.uid())
  );

-- Allow another public select policy on profiles for friend lookups
CREATE POLICY "Public profile lookup for friends" ON profiles
  FOR SELECT USING (true);
