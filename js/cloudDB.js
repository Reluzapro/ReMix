// Cloud Database module — Supabase integration for global leaderboard and multi-device profile sync
const SUPABASE_URL = 'https://hsgrieghyfpzxuazfmvx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bborZn7bk6huf--BanH2pg___DL_98m';

let _supabaseClient = null;

export function getDB() {
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

export async function fetchServerDate() {
  const db = getDB();
  if (!db) return null;
  try {
    const { data, error } = await db.rpc('get_server_time');
    if (error) {
      console.warn("Could not fetch server time, reverting to local or aborting.", error);
      return null;
    }
    return data; // Returns 'YYYY-MM-DD'
  } catch (err) {
    console.error("Error fetching server date:", err);
    return null;
  }
}

// --- AUTHENTICATION (Supabase Auth) ---

export async function cloudSignUp(email, password, username) {
  const db = getDB();
  if (!db) throw new Error("Supabase non initialisé.");
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { username: username }
    }
  });
  if (error) throw error;
  return data;
}

export async function cloudSignIn(email, password) {
  const db = getDB();
  if (!db) throw new Error("Supabase non initialisé.");
  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function cloudResetPassword(email) {
  const db = getDB();
  if (!db) throw new Error("Supabase non initialisé.");
  const { error } = await db.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return true;
}

export async function cloudSignOut() {
  const db = getDB();
  if (!db) return;
  await db.auth.signOut();
}

export async function getCloudUser() {
  const db = getDB();
  if (!db) return null;
  const { data: { user } } = await db.auth.getUser();
  return user;
}

// --- LEADERBOARD ---

export async function pushPlayerToCloud(playerCard) {
  try {
    const db = getDB();
    if (!db) return;
    
    // Do not attempt to push if the user is a guest (no active session),
    // to avoid console 403 Forbidden errors from the RLS policies.
    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    await db.from('leaderboard').upsert({
      name: (playerCard.cloudAccount?.username || playerCard.name),
      level: playerCard.level || 1,
      xp: playerCard.xp || 0,
      coins: playerCard.coins || 0,
      wins: playerCard.wins || 0,
      total_duels: playerCard.total_duels || 0,
      streak: playerCard.streak || 0,
      badges: playerCard.badges || [],
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

export async function checkCloudUpdateTimestamp() {
  try {
    const db = getDB();
    if (!db) return 0;
    const { data: { session } } = await db.auth.getSession();
    if (!session) return 0;
    const { data } = await db.from('profiles').select('updated_at').eq('id', session.user.id).maybeSingle();
    return data ? data.updated_at : 0;
  } catch (e) {
    return 0;
  }
}

export async function pushProfileToCloud(username, hashedKey, profile, srsData, subjectsData, pausedSession = null, revisionItems = []) {
  try {
    const db = getDB();
    if (!db) return;
    
    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    let payload = {
      username: username.toLowerCase(),
      hashed_key: 'supabase_auth_v2',
      profile_data: profile,
      friend_id: profile.friendId,
      srs_data: {
        srs: srsData,
        revisionItems: revisionItems,
        pausedSession: pausedSession
      },
      updated_at: Date.now()
    };

    // Update local timestamp to prevent our own push from triggering a pull
    try { localStorage.setItem('remix_last_cloud_sync', payload.updated_at.toString()); } catch(e){}

    // Use UPDATE by default to avoid overwriting omitted columns (like subjects_data) to NULL
    const { data, error } = await db.from('profiles').update(payload).eq('id', session.user.id).select('id');

    // If row doesn't exist yet, fallback to INSERT
    if ((!error && (!data || data.length === 0)) || (error && error.code === 'PGRST116')) {
      payload.id = session.user.id;
      try {
        const subjectsStr = JSON.stringify(subjectsData || {});
        if (subjectsStr.length < 1024 * 1024 * 2) { 
          payload.subjects_data = subjectsData;
        }
      } catch (e) {}
      await db.from('profiles').insert(payload);
    }
  } catch (e) {
    console.error('Profile cloud push failed:', e.message);
  }
}

export async function fetchProfileFromCloud(username, hashedKey, includeSubjects = false) {
  try {
    const db = getDB();
    if (!db) return null;

    const { data: { session } } = await db.auth.getSession();
    if (!session) return null;

    let query = db.from('profiles');
    if (includeSubjects) {
      query = query.select('*');
    } else {
      query = query.select('id, username, hashed_key, profile_data, friend_id, srs_data, paused_session, updated_at');
    }

    const { data, error } = await query.eq('id', session.user.id).maybeSingle();
      
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

    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    await db.from('profiles')
      .update({ friend_id: friendId })
      .eq('id', session.user.id);
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
        level: pd.level || 1,
        wins: pd.stats?.duelWins || 0,
        total_duels: pd.stats?.duelsPlayed || 0,
        streak: pd.streakDays || 0,
        badges: pd.unlockedAchievements || []
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
    await db.from('friend_notifications').delete().eq('id', id);
  } catch (e) {
    console.log('markNotificationRead failed:', e.message);
  }
}

// --- COMMUNITY SUBJECTS ---

export async function submitCommunitySubject(subjectName, author, category, questionsData) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects').insert({
      subject_name: subjectName,
      author: author,
      category: category,
      questions_data: questionsData,
      status: 'pending'
    });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('submitCommunitySubject failed:', e.message);
    return false;
  }
}

export async function fetchPendingCommunitySubjects() {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db.from('community_subjects')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('fetchPendingCommunitySubjects failed:', e.message);
    return [];
  }
}

export async function fetchAcceptedCommunitySubjects() {
  try {
    const db = getDB();
    if (!db) return [];
    const { data, error } = await db.from('community_subjects')
      .select('id, subject_name, author, category, created_at, questions_data')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('fetchAcceptedCommunitySubjects failed:', e.message);
    return [];
  }
}

export async function updateCommunitySubjectStatus(subjectId, status) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects')
      .update({ status: status })
      .eq('id', subjectId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateCommunitySubjectStatus failed:', e.message);
    return false;
  }
}

export async function updateCommunitySubjectCategory(subjectId, category) {
  try {
    const db = getDB();
    if (!db) return false;
    const { error } = await db.from('community_subjects')
      .update({ category: category })
      .eq('id', subjectId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateCommunitySubjectCategory failed:', e.message);
    return false;
  }
}

// ==========================================
// SUPABASE STORAGE LOGIC
// ==========================================

const _signedUrlCache = new Map();

function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

export async function uploadRewardImage(base64Data, username) {
  try {
    const db = getDB();
    if (!db) return null;
    
    const blob = dataURLtoBlob(base64Data);
    const fileName = `${username}_${Date.now()}.webp`;
    
    const { data, error } = await db.storage
      .from('reward_images')
      .upload(fileName, blob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    return data.path;
  } catch (e) {
    console.error('uploadRewardImage failed:', e.message);
    return null;
  }
}

export async function getRewardImageUrl(path) {
  if (!path) return null;
  // Backward compatibility for old base64 images stored in JSON
  if (path.startsWith('data:image')) return path;
  
  if (_signedUrlCache.has(path)) {
    const cached = _signedUrlCache.get(path);
    // Refresh 1 hour before expiry (approx 24h validity)
    if (Date.now() < cached.expiresAt - (60 * 60 * 1000)) {
      return cached.url;
    }
  }

  try {
    const db = getDB();
    if (!db) return null;
    
    // 24 hours validity
    const { data, error } = await db.storage
      .from('reward_images')
      .createSignedUrl(path, 60 * 60 * 24);
      
    if (error) throw error;
    
    _signedUrlCache.set(path, {
      url: data.signedUrl,
      expiresAt: Date.now() + (60 * 60 * 24 * 1000)
    });
    
    return data.signedUrl;
  } catch (e) {
    console.error('getRewardImageUrl failed:', e.message);
    return null;
  }
}
