-- Migration: Create battles table for real-time 1v1 duels
-- Date: 2026-08-06

CREATE TABLE IF NOT EXISTS battles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  wager INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  player1_id TEXT NOT NULL,
  player1_name TEXT NOT NULL,
  player1_avatar TEXT DEFAULT '🎓',
  player1_score INTEGER DEFAULT 0,
  player1_ready BOOLEAN DEFAULT FALSE,
  player2_id TEXT,
  player2_name TEXT,
  player2_avatar TEXT DEFAULT '⚔️',
  player2_score INTEGER DEFAULT 0,
  player2_ready BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'waiting',
  questions_data JSONB,
  current_question INTEGER DEFAULT 0,
  start_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour le matchmaking rapide
CREATE INDEX IF NOT EXISTS idx_battles_matchmaking
  ON battles (subject_id, status, is_public)
  WHERE player2_id IS NULL;

-- Nettoyage : supprimer les salons vieux de plus de 30 minutes
-- (à appeler périodiquement ou via Edge Function)

ALTER TABLE battles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique battles" ON battles
  FOR SELECT USING (true);

CREATE POLICY "Insertion publique battles" ON battles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Mise a jour publique battles" ON battles
  FOR UPDATE USING (true);

CREATE POLICY "Suppression publique battles" ON battles
  FOR DELETE USING (true);

GRANT ALL ON TABLE public.battles TO anon, authenticated, service_role;

-- Enable Realtime for the battles table
ALTER PUBLICATION supabase_realtime ADD TABLE battles;
