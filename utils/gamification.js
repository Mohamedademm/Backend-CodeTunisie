/**
 * Gamification utilities shared between routes/users.js and routes/tests.js
 */

// XP per action
const XP_RULES = {
    testAttempt: 10,      // XP per test attempted
    testPassed: 50,       // Additional XP if passed
    perfectScore: 100,    // Bonus for 100%
};

// Level thresholds: level = floor(xp / XP_PER_LEVEL) + 1
const XP_PER_LEVEL = 200;

const LEVEL_TITLES = {
    1: 'Novice',
    2: 'Apprenti',
    3: 'Conducteur Prudent',
    4: 'Expert',
    5: 'Maître du Code',
    6: 'Légende de la Route',
};

// All badge definitions
const BADGE_RULES = [
    { id: 'first-test', name: 'Premier pas', icon: 'award', condition: (user, attempts) => attempts.length >= 1 },
    { id: 'passes-5', name: 'Expert débutant', icon: 'trophy', condition: (user, attempts) => attempts.filter(a => a.passed).length >= 5 },
    { id: 'passes-10', name: 'Expert signalisation', icon: 'shield-check', condition: (user, attempts) => attempts.filter(a => a.passed).length >= 10 },
    { id: 'streak-7', name: 'Série de 7', icon: 'flame', condition: (user) => (user.streak || 0) >= 7 },
    { id: 'streak-30', name: 'Série de 30', icon: 'flame', condition: (user) => (user.streak || 0) >= 30 },
    { id: 'perfect-score', name: 'Score Parfait', icon: 'star', condition: (user, attempts) => attempts.some(a => a.score === 100) },
    { id: 'xp-1000', name: 'Code Master', icon: 'crown', condition: (user) => (user.xp || 0) >= 1000 },
    { id: 'xp-5000', name: 'Légende', icon: 'crown', condition: (user) => (user.xp || 0) >= 5000 },
];

/**
 * Calculate XP earned for a single test submission.
 * @param {boolean} passed
 * @param {number} score - 0 to 100
 * @returns {number}
 */
function calcXpEarned(passed, score) {
    let xp = XP_RULES.testAttempt;
    if (passed) xp += XP_RULES.testPassed;
    if (score === 100) xp += XP_RULES.perfectScore;
    return xp;
}

/**
 * Calculate level from total XP.
 */
function calcLevel(totalXp) {
    return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

function getLevelTitle(level) {
    return LEVEL_TITLES[level] || `Niveau ${level}`;
}

/**
 * Update user streak based on lastActivityDate.
 * Mutates the user object — remember to call user.save() afterwards.
 */
function updateStreak(user) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!user.lastActivityDate) {
        user.streak = 1;
        user.lastActivityDate = now;
        return;
    }
    const last = new Date(user.lastActivityDate);
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return; // same day, no change
    user.streak = (diffDays === 1) ? (user.streak || 0) + 1 : 1;
    user.lastActivityDate = now;
}

/**
 * Check badge rules and award new badges.
 * Mutates user.badges — remember to call user.save() afterwards.
 * @returns {Array} newly awarded badges
 */
function checkAndAwardBadges(user, testAttempts) {
    const awardedIds = new Set((user.badges || []).map(b => b.id));
    const newBadges = [];

    for (const rule of BADGE_RULES) {
        if (!awardedIds.has(rule.id) && rule.condition(user, testAttempts)) {
            const badge = { id: rule.id, name: rule.name, icon: rule.icon, earnedDate: new Date() };
            newBadges.push(badge);
            user.badges.push(badge);
            awardedIds.add(rule.id);
        }
    }
    return newBadges;
}

module.exports = { calcXpEarned, calcLevel, getLevelTitle, updateStreak, checkAndAwardBadges, XP_PER_LEVEL };
