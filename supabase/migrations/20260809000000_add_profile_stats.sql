-- Migration: Add profile stats and daily quest tracking
-- Date: 2026-08-09

ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS total_duels INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
