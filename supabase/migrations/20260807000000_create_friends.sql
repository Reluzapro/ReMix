-- =============================================
-- MIGRATION : Système d'amis ReMix
-- =============================================

-- 1. Ajouter la colonne friend_id à profiles (ID court unique ex: RMX-A3F9)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS friend_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_friend_id ON profiles (friend_id);

-- 2. Table des liens d'amitié
CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_username TEXT NOT NULL,
  addressee_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_username, addressee_username)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public friendships" ON friendships FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.friendships TO anon, authenticated, service_role;

-- 3. Table des notifications entre amis (duel invite, reward share)
CREATE TABLE IF NOT EXISTS friend_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_username   TEXT NOT NULL,
  from_username TEXT NOT NULL,
  from_avatar   TEXT DEFAULT '🎓',
  type          TEXT NOT NULL,   -- 'duel_invite' | 'reward_share'
  payload       JSONB,           -- { battleCode, subjectName } ou { reward: {...} }
  is_read       BOOLEAN DEFAULT false,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE friend_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public notifications" ON friend_notifications FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.friend_notifications TO anon, authenticated, service_role;

-- Index pour lecture rapide des notifications non lues
CREATE INDEX IF NOT EXISTS idx_notifs_to_user ON friend_notifications (to_username, is_read);
