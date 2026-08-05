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

// --- PROFILE SYNC (multi-device account with Smart Merge Conflict Protection) ---

export function mergeProfileData(localProfile, cloudProfile) {
  if (!cloudProfile) return localProfile;
  if (!localProfile) return cloudProfile;

  const merged = { ...cloudProfile, ...localProfile };

  // Maximize XP, Level, Coins so no hard-earned progress is lost across devices
  merged.xp = Math.max(localProfile.xp || 0, cloudProfile.xp || 0);
  merged.level = Math.max(localProfile.level || 1, cloudProfile.level || 1);
  merged.coins = Math.max(localProfile.coins || 0, cloudProfile.coins || 0);

  // Merge Stats
  const lStats = localProfile.stats || {};
  const cStats = cloudProfile.stats || {};
  merged.stats = {
    gamesPlayed: Math.max(lStats.gamesPlayed || 0, cStats.gamesPlayed || 0),
    correctAnswers: Math.max(lStats.correctAnswers || 0, cStats.correctAnswers || 0),
    wrongAnswers: Math.max(lStats.wrongAnswers || 0, cStats.wrongAnswers || 0),
    skippedAnswers: Math.max(lStats.skippedAnswers || 0, cStats.skippedAnswers || 0),
    perfectGames: Math.max(lStats.perfectGames || 0, cStats.perfectGames || 0),
    duelWins: Math.max(lStats.duelWins || 0, cStats.duelWins || 0)
  };

  // Union of Custom Rewards (keep rewards added on both PC and Phone)
  const lRewards = localProfile.customRewards || [];
  const cRewards = cloudProfile.customRewards || [];
  const rewardMap = new Map();
  [...cRewards, ...lRewards].forEach(r => rewardMap.set(r.id, r));
  merged.customRewards = Array.from(rewardMap.values());

  return merged;
}

export function mergeSubjectsData(localSubjects = {}, cloudSubjects = {}) {
  return { ...cloudSubjects, ...localSubjects };
}

export async function pushProfileToCloud(username, hashedKey, profile, srsData, subjectsData, pausedSession = null, revisionItems = []) {
  try {
    const db = getDB();
    if (!db) return;

    // Fetch cloud state first to safely merge before overwriting
    const { data: cloudRecord } = await db
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('hashed_key', hashedKey)
      .maybeSingle();

    let finalProfile = profile;
    let finalSubjects = subjectsData;
    let finalPausedSession = pausedSession;

    if (cloudRecord) {
      finalProfile = mergeProfileData(profile, cloudRecord.profile_data);
      finalSubjects = mergeSubjectsData(subjectsData, cloudRecord.subjects_data);
      // Keep cloud paused session if local doesn't have one and cloud has one updated recently
      if (!finalPausedSession && cloudRecord.paused_session) {
        finalPausedSession = cloudRecord.paused_session;
      }
    }

    await db.from('profiles').upsert({
      username: username.toLowerCase(),
      hashed_key: hashedKey,
      profile_data: finalProfile,
      srs_data: { srs: srsData, revisionItems: revisionItems },
      subjects_data: finalSubjects,
      paused_session: finalPausedSession,
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
