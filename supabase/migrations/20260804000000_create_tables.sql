-- Migration: Create global leaderboard and profiles tables for ReMix
-- Date: 2026-08-04

-- Table classement mondial partagé
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  avatar TEXT DEFAULT '🎓',
  checksum_token TEXT,
  last_active BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique" ON leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Insertion publique" ON leaderboard
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Mise a jour publique" ON leaderboard
  FOR UPDATE USING (true);

-- Table profils complets (sync multi-appareils)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  hashed_key TEXT NOT NULL,
  profile_data JSONB,
  srs_data JSONB,
  subjects_data JSONB,
  updated_at BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, hashed_key)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique profils" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Insertion publique profils" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Mise a jour publique profils" ON profiles
  FOR UPDATE USING (true);
