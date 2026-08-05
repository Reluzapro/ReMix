// Cloud Database module — Supabase integration for global leaderboard and multi-device profile sync
const SUPABASE_URL = 'https://hsgrieghyfpzxuazfmvx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bborZn7bk6huf--BanH2pg___DL_98m';

let _supabaseClient = null;

function getDB() {
  if (_supabaseClient) return _supabaseClient;
  try {
    if (window.supabase && window.supabase.createClient) {
      _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  } catch (e) {
    console.log('Supabase init failed:', e.message);
  }
  return _supabaseClient;
}

// --- LEADERBOARD ---

export async function pushPlayerToCloud(playerCard) {
  try {
    const db = getDB();
    if (!db) return;
    await db.from('leaderboard').upsert({
      name: playerCard.name,
      level: playerCard.level || 1,
      xp: playerCard.xp || 0,
      coins: playerCard.coins || 0,
      wins: playerCard.wins || 0,
      avatar: playerCard.avatar || '🎓',
      checksum_token: playerCard.checksumToken || '',
      last_active: Date.now()
    }, { onConflict: 'name' });
  } catch (e) {
    console.log('Leaderboard sync failed:', e.message);
  }
}

export async function fetchCloudLeaderboard() {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db
      .from('leaderboard')
      .select('*')
      .order('level', { ascending: false })
      .order('coins', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.log('Leaderboard fetch failed:', e.message);
    return [];
  }
}

// --- PROFILE SYNC (multi-device account) ---

export async function pushProfileToCloud(username, hashedKey, profile, srsData, subjectsData, pausedSession = null, revisionItems = []) {
  try {
    const db = getDB();
    if (!db) return;
    await db.from('profiles').upsert({
      username: username.toLowerCase(),
      hashed_key: hashedKey,
      profile_data: profile,
      srs_data: { srs: srsData, revisionItems: revisionItems },
      subjects_data: subjectsData,
      paused_session: pausedSession,
      updated_at: Date.now()
    }, { onConflict: 'username,hashed_key' });
  } catch (e) {
    console.log('Profile cloud push failed:', e.message);
  }
}

export async function fetchProfileFromCloud(username, hashedKey) {
  try {
    const db = getDB();
    if (!db) return null;
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('hashed_key', hashedKey)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (e) {
    console.log('Profile cloud fetch failed:', e.message);
    return null;
  }
}
