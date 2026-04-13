// backend/utils/ratingCalculator.js

const BADGE_TIERS = [
  {
    name: 'Bronze',
    min: 0, max: 399,
    emoji: '🪨',
    color: '#cd7f32',
    bg: 'rgba(205,127,50,0.12)',
    border: 'rgba(205,127,50,0.3)',
    imgPath: '/badges/bronze.jpg',
  },
  {
    name: 'Silver',
    min: 400, max: 799,
    emoji: '⚔️',
    color: '#c0c0c0',
    bg: 'rgba(192,192,192,0.12)',
    border: 'rgba(192,192,192,0.3)',
    imgPath: '/badges/silver.jpg',
  },
  {
    name: 'Gold',
    min: 800, max: 1199,
    emoji: '🌟',
    color: '#ffd700',
    bg: 'rgba(255,215,0,0.12)',
    border: 'rgba(255,215,0,0.3)',
    imgPath: '/badges/gold.jpg',
  },
  {
    name: 'Platinum',
    min: 1200, max: 1599,
    emoji: '💠',
    color: '#00d4ff',
    bg: 'rgba(0,212,255,0.12)',
    border: 'rgba(0,212,255,0.3)',
    imgPath: '/badges/platinum.jpg',
  },
  {
    name: 'Master',
    min: 1600, max: 1999,
    emoji: '👑',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    imgPath: '/badges/master.jpg',
  },
  {
    name: 'Champion',
    min: 2000, max: Infinity,
    emoji: '⚡',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    imgPath: '/badges/champion.jpg',
  },
];

function getBadge(rating) {
  return (
    BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0]
  );
}

/**
 * Rating System Design:
 * - Everyone starts at 0 (Bronze)
 * - First 4 games: HIGH K-factor (placement matches) → rapid movement to deserved level
 * - After 4 games: Normal Elo → stable
 * - Gold region (800-1199) = average player zone (designed by expected score math)
 * - Min rating floor = 0
 */
function calculateNewRatings(ratingA, ratingB, result, battlesA = 0, battlesB = 0) {

  // ── K-factor ──
  // First 4 games: 80 (fast placement)
  // Games 5-20:   40 (settling)
  // Games 20+:    20 (stable)
  const kA = battlesA < 4  ? 80
           : battlesA < 20 ? 40
           : 20;

  const kB = battlesB < 4  ? 80
           : battlesB < 20 ? 40
           : 20;

  // ── Expected scores (Elo formula) ──
  // Using 400 as the scale factor
  // Two players of equal rating → 50% expected each
  // Gold midpoint = 1000, so average player converges near 1000
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  // ── Actual scores ──
  const scoreA = result === 'A'    ? 1
               : result === 'draw' ? 0.5
               : 0;
  const scoreB = 1 - scoreA;

  // ── Deltas ──
  const rawDeltaA = Math.round(kA * (scoreA - expectedA));
  const rawDeltaB = Math.round(kB * (scoreB - expectedB));

  // ── New ratings (floor at 0) ──
  const newRatingA = Math.max(0, ratingA + rawDeltaA);
  const newRatingB = Math.max(0, ratingB + rawDeltaB);

  // Actual delta after floor
  const deltaA = newRatingA - ratingA;
  const deltaB = newRatingB - ratingB;

  return {
    A: {
      oldRating: ratingA,
      newRating: newRatingA,
      delta:     deltaA,
      badge:     getBadge(newRatingA),
    },
    B: {
      oldRating: ratingB,
      newRating: newRatingB,
      delta:     deltaB,
      badge:     getBadge(newRatingB),
    },
  };
}

module.exports = { calculateNewRatings, getBadge, BADGE_TIERS };