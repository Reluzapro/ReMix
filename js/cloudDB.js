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

  // Track total coins earned and spent so buying an item or earning coins on one device
  // is mathematically exact without double-spending or resetting coins.
  const lEarned = localProfile.totalCoinsEarned ?? localProfile.coins ?? 50;
  const cEarned = cloudProfile.totalCoinsEarned ?? cloudProfile.coins ?? 50;
  const lSpent = localProfile.totalCoinsSpent ?? 0;
  const cSpent = cloudProfile.totalCoinsSpent ?? 0;

  merged.totalCoinsEarned = Math.max(lEarned, cEarned);
  merged.totalCoinsSpent = Math.max(lSpent, cSpent);
  merged.coins = Math.max(0, merged.totalCoinsEarned - merged.totalCoinsSpent);

  // Maximize XP, Level, and Streaks
  merged.xp = Math.max(localProfile.xp || 0, cloudProfile.xp || 0);
  merged.level = Math.max(localProfile.level || 1, cloudProfile.level || 1);
  merged.streak = Math.max(localProfile.streak || 0, cloudProfile.streak || 0);
  merged.maxStreak = Math.max(localProfile.maxStreak || 0, cloudProfile.maxStreak || 0);

  // Merge Purchased Items (Themes & Avatars)
  const lPurchased = localProfile.purchasedItems || [];
  const cPurchased = cloudProfile.purchasedItems || [];
  merged.purchasedItems = Array.from(new Set([...cPurchased, ...lPurchased]));

  // Merge Inventory (Power-ups: take max of each powerup count)
  const lInv = localProfile.inventory || {};
  const cInv = cloudProfile.inventory || {};
  merged.inventory = {
    powerup_fifty: Math.max(lInv.powerup_fifty || 0, cInv.powerup_fifty || 0),

    powerup_skip: Math.max(lInv.powerup_skip || 0, cInv.powerup_skip || 0)
  };

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

  // Union of Custom Rewards, minus deleted ones (CRDT tombstones)
  const lRewards = localProfile.customRewards || [];
  const cRewards = cloudProfile.customRewards || [];
  const lDeleted = localProfile.deletedCustomRewards || [];
  const cDeleted = cloudProfile.deletedCustomRewards || [];
  
  merged.deletedCustomRewards = Array.from(new Set([...lDeleted, ...cDeleted]));
  
  const rewardMap = new Map();
  [...cRewards, ...lRewards].forEach(r => {
    if (!merged.deletedCustomRewards.includes(r.id)) {
      rewardMap.set(r.id, r);
    }
  });
  merged.customRewards = Array.from(rewardMap.values());

  // Union of Unlocked Achievements
  const lAch = localProfile.unlockedAchievements || [];
  const cAch = cloudProfile.unlockedAchievements || [];
  merged.unlockedAchievements = Array.from(new Set([...cAch, ...lAch]));

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

      const cloudSession = cloudRecord.srs_data?.pausedSession || cloudRecord.paused_session;
      const localSavedAt = pausedSession?.savedAt || 0;
      const cloudSavedAt = cloudSession?.savedAt || 0;
      const localClearedAt = profile.pausedSessionClearedAt || 0;

      if (pausedSession && localSavedAt >= cloudSavedAt) {
        finalPausedSession = pausedSession;
      } else if (cloudSession && cloudSavedAt > localSavedAt && cloudSavedAt > localClearedAt) {
        finalPausedSession = cloudSession;
      } else {
        finalPausedSession = null;
      }
    }

    // Embed pausedSession inside srs_data JSONB so it works 100% with standard Supabase profiles table without needing DDL migrations
    await db.from('profiles').upsert({
      username: username.toLowerCase(),
      hashed_key: hashedKey,
      profile_data: finalProfile,
      srs_data: {
        srs: srsData,
        revisionItems: revisionItems,
        pausedSession: finalPausedSession
      },
      subjects_data: finalSubjects,
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
    if (data) {
      if (!data.paused_session && data.srs_data?.pausedSession) {
        data.paused_session = data.srs_data.pausedSession;
      }
    }
    return data;
  } catch (e) {
    console.log('Profile cloud fetch failed:', e.message);
    return null;
  }
}

// --- FRIEND SYSTEM ---

export async function lookupByFriendId(friendId) {
  try {
    const db = getDB();
    if (!db) return null;
    const { data, error } = await db
      .from('profiles')
      .select('username, friend_id, profile_data')
      .eq('friend_id', friendId.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (e) {
    console.log('Friend lookup failed:', e.message);
    return null;
  }
}

export async function saveFriendId(username, hashedKey, friendId) {
  try {
    const db = getDB();
    if (!db) return;
    await db.from('profiles')
      .update({ friend_id: friendId })
      .eq('username', username.toLowerCase())
      .eq('hashed_key', hashedKey);
  } catch (e) {
    console.log('saveFriendId failed:', e.message);
  }
}

export async function addFriend(myUsername, friendUsername) {
  try {
    const db = getDB();
    if (!db) return { success: false };
    const { error } = await db.from('friendships').insert({
      requester_username: myUsername.toLowerCase(),
      addressee_username: friendUsername.toLowerCase()
    });
    if (error && error.code !== '23505') throw error; // ignore duplicate
    return { success: true };
  } catch (e) {
    console.log('addFriend failed:', e.message);
    return { success: false, error: e.message };
  }
}

export async function getFriends(myUsername) {
  try {
    const db = getDB();
    if (!db) return [];
    const me = myUsername.toLowerCase();
    // Get all friendships where I am requester or addressee
    const { data, error } = await db.from('friendships')
      .select('requester_username, addressee_username')
      .or(`requester_username.eq.${me},addressee_username.eq.${me}`);
    if (error) throw error;
    if (!data || data.length === 0) return [];

    const friendUsernames = data.map(f =>
      f.requester_username === me ? f.addressee_username : f.requester_username
    );

    // Fetch their profile info
    const { data: profiles, error: pErr } = await db.from('profiles')
      .select('username, friend_id, profile_data')
      .in('username', friendUsernames);
    if (pErr) throw pErr;

    return (profiles || []).map(p => {
      const pd = p.profile_data || {};
      return {
        username: p.username,
        friendId: p.friend_id || '???',
        name: pd.name || p.username,
        avatar: pd.avatar || '🎓',
        level: pd.level || 1
      };
    });
  } catch (e) {
    console.log('getFriends failed:', e.message);
    return [];
  }
}

export async function removeFriend(myUsername, friendUsername) {
  try {
    const db = getDB();
    if (!db) return;
    const me = myUsername.toLowerCase();
    const friend = friendUsername.toLowerCase();
    await db.from('friendships').delete()
      .or(`and(requester_username.eq.${me},addressee_username.eq.${friend}),and(requester_username.eq.${friend},addressee_username.eq.${me})`);
  } catch (e) {
    console.log('removeFriend failed:', e.message);
  }
}

export async function sendFriendNotification(toUsername, fromUsername, fromAvatar, type, payload) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('friend_notifications').insert({
      to_username: toUsername.toLowerCase(),
      from_username: fromUsername.toLowerCase(),
      from_avatar: fromAvatar || '🎓',
      type,
      payload
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.log('sendFriendNotification failed:', e.message);
    return false;
  }
}

export async function getMyNotifications(myUsername) {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db.from('friend_notifications')
      .select('*')
      .eq('to_username', myUsername.toLowerCase())
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.log('getMyNotifications failed:', e.message);
    return [];
  }
}

export async function markNotificationRead(id) {
  try {
    const db = getDB();
    if (!db) return;
    await db.from('friend_notifications').update({ is_read: true }).eq('id', id);
  } catch (e) {
    console.log('markNotificationRead failed:', e.message);
  }
}

