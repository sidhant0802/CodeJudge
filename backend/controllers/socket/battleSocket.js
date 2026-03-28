// backend/socket/battleSocket.js
const Battle  = require('../models/Battle');
const Problem = require('../models/problems');
const User    = require('../models/User');
const { assignProblem }       = require('../controllers/battleController');
const { calculateNewRatings } = require('../utils/ratingCalculator');

// ══════════════════════════════════════════
// ── Central rating updater ──
// ══════════════════════════════════════════
async function updateRatings(battle, winner) {
  try {
    const cHandle = battle.creator.userhandle;
    const oHandle = battle.opponent.userhandle;
    if (!cHandle || !oHandle) return null;

    const [cUser, oUser] = await Promise.all([
      User.findOne({ userhandle: cHandle }),
      User.findOne({ userhandle: oHandle }),
    ]);
    if (!cUser || !oUser) {
      console.warn('[Rating] User(s) not found:', cHandle, oHandle);
      return null;
    }

    // result from creator's perspective
    const result =
      winner === 'draw'  ? 'draw' :
      winner === cHandle ? 'A'    : 'B';

    const cBattles = cUser.battleStats?.totalBattles  || 0;
    const oBattles = oUser.battleStats?.totalBattles  || 0;

    const ratings = calculateNewRatings(
      cUser.rating ?? 0,
      oUser.rating ?? 0,
      result,
      cBattles,
      oBattles,
    );

    const now = new Date();

    // ── Update creator ──
    const cResult = result === 'A' ? 'win' : result === 'draw' ? 'draw' : 'loss';
    cUser.rating = ratings.A.newRating;
    cUser.badge  = {
      name:  ratings.A.badge.name,
      emoji: ratings.A.badge.emoji,
      color: ratings.A.badge.color,
    };
    if (!cUser.battleStats) cUser.battleStats = { wins: 0, losses: 0, draws: 0, totalBattles: 0 };
    cUser.battleStats.totalBattles += 1;
    if      (cResult === 'win')  cUser.battleStats.wins   += 1;
    else if (cResult === 'loss') cUser.battleStats.losses += 1;
    else                         cUser.battleStats.draws  += 1;

    if (!cUser.ratingHistory) cUser.ratingHistory = [];
    cUser.ratingHistory.push({
      rating: ratings.A.newRating, delta: ratings.A.delta,
      opponent: oHandle, result: cResult,
      roomId: battle.roomId, date: now,
    });
    if (cUser.ratingHistory.length > 50) cUser.ratingHistory = cUser.ratingHistory.slice(-50);

    // ── Update opponent ──
    const oResult = result === 'B' ? 'win' : result === 'draw' ? 'draw' : 'loss';
    oUser.rating = ratings.B.newRating;
    oUser.badge  = {
      name:  ratings.B.badge.name,
      emoji: ratings.B.badge.emoji,
      color: ratings.B.badge.color,
    };
    if (!oUser.battleStats) oUser.battleStats = { wins: 0, losses: 0, draws: 0, totalBattles: 0 };
    oUser.battleStats.totalBattles += 1;
    if      (oResult === 'win')  oUser.battleStats.wins   += 1;
    else if (oResult === 'loss') oUser.battleStats.losses += 1;
    else                         oUser.battleStats.draws  += 1;

    if (!oUser.ratingHistory) oUser.ratingHistory = [];
    oUser.ratingHistory.push({
      rating: ratings.B.newRating, delta: ratings.B.delta,
      opponent: cHandle, result: oResult,
      roomId: battle.roomId, date: now,
    });
    if (oUser.ratingHistory.length > 50) oUser.ratingHistory = oUser.ratingHistory.slice(-50);

    // Save both
    await Promise.all([cUser.save(), oUser.save()]);

    // Store snapshot on Battle
    battle.ratingChanges = {
      creator:  {
        oldRating: ratings.A.oldRating, newRating: ratings.A.newRating,
        delta: ratings.A.delta, badge: ratings.A.badge.name,
      },
      opponent: {
        oldRating: ratings.B.oldRating, newRating: ratings.B.newRating,
        delta: ratings.B.delta, badge: ratings.B.badge.name,
      },
    };
    await battle.save();

    console.log(
      `[Rating] ${cHandle}: ${ratings.A.oldRating}→${ratings.A.newRating}` +
      ` (${ratings.A.delta >= 0 ? '+' : ''}${ratings.A.delta}) [${ratings.A.badge.name}] | ` +
      `${oHandle}: ${ratings.B.oldRating}→${ratings.B.newRating}` +
      ` (${ratings.B.delta >= 0 ? '+' : ''}${ratings.B.delta}) [${ratings.B.badge.name}]`
    );

    // Return keyed by userhandle for frontend
    return {
      [cHandle]: {
        oldRating: ratings.A.oldRating, newRating: ratings.A.newRating,
        delta: ratings.A.delta, badge: ratings.A.badge.name,
      },
      [oHandle]: {
        oldRating: ratings.B.oldRating, newRating: ratings.B.newRating,
        delta: ratings.B.delta, badge: ratings.B.badge.name,
      },
    };
  } catch (err) {
    console.error('[Rating] updateRatings failed:', err);
    return null;
  }
}

// ══════════════════════════════════════════
// ── Socket handlers ──
// ══════════════════════════════════════════
module.exports = (io, socket) => {

  // ── Join room ──
  socket.on('battle:join', async ({ roomId, userhandle }) => {
    try {
      roomId = roomId.toUpperCase();
      const battle = await Battle.findOne({ roomId });
      if (!battle) {
        socket.emit('battle:error', { message: 'Room not found' });
        return;
      }

      if (battle.creator.userhandle === userhandle)
        battle.creator.socketId = socket.id;
      else if (battle.opponent.userhandle === userhandle)
        battle.opponent.socketId = socket.id;
      await battle.save();
      socket.join(roomId);

      // Fetch both users' ratings
      const [cUser, oUser] = await Promise.all([
        User.findOne({ userhandle: battle.creator.userhandle },
          'rating badge battleStats').lean(),
        User.findOne({ userhandle: battle.opponent.userhandle },
          'rating badge battleStats').lean(),
      ]);

      const defaultBadge = { name: 'Bronze', emoji: '🥉', color: '#cd7f32' };

      io.to(roomId).emit('battle:userJoined', {
        userhandle,
        creator: {
          userhandle:  battle.creator.userhandle,
          isReady:     battle.creator.isReady,
          rating:      cUser?.rating      ?? 0,
          badge:       cUser?.badge       ?? defaultBadge,
          battleStats: cUser?.battleStats ?? {},
        },
        opponent: {
          userhandle:  battle.opponent.userhandle,
          isReady:     battle.opponent.isReady,
          rating:      oUser?.rating      ?? 0,
          badge:       oUser?.badge       ?? defaultBadge,
          battleStats: oUser?.battleStats ?? {},
        },
      });

      console.log(`${userhandle} joined battle room ${roomId}`);
    } catch (err) {
      console.error('Battle join error:', err);
      socket.emit('battle:error', { message: 'Failed to join room' });
    }
  });

  // ── Player ready ──
  socket.on('battle:ready', async ({ roomId, userhandle }) => {
    try {
      roomId = roomId.toUpperCase();
      const battle = await Battle.findOne({ roomId });
      if (!battle) return;

      if (battle.creator.userhandle === userhandle)
        battle.creator.isReady = true;
      else if (battle.opponent.userhandle === userhandle)
        battle.opponent.isReady = true;
      await battle.save();

      io.to(roomId).emit('battle:playerReady', { userhandle });

      if (battle.creator.isReady && battle.opponent.isReady) {
        const problemPID = await assignProblem(battle.difficulty);
        if (!problemPID) {
          io.to(roomId).emit('battle:error', {
            message: 'No problems available for this difficulty.',
          });
          return;
        }
        const problem = await Problem.findOne({ PID: problemPID }).lean();
        battle.problemPID = problemPID;
        battle.status     = 'ongoing';
        battle.startTime  = new Date();
        await battle.save();

        io.to(roomId).emit('battle:start', {
          problemPID,
          problemName:  problem?.ProblemName  || 'Problem',
          problemLevel: problem?.ProblemLevel || 'Medium',
          duration:     battle.duration,
          startTime:    battle.startTime,
        });
        console.log(`Battle started → room=${roomId} problem=${problemPID}`);
      }
    } catch (err) { console.error('Battle ready error:', err); }
  });

  // ── Player submits ──
  socket.on('battle:submit', async ({ roomId, userhandle, status }) => {
    try {
      roomId = roomId.toUpperCase();
      const battle = await Battle.findOne({ roomId });
      if (!battle || battle.status !== 'ongoing') return;

      const submissionTime = Date.now() - new Date(battle.startTime).getTime();

      if (battle.creator.userhandle === userhandle) {
        battle.creator.hasSubmitted   = true;
        battle.creator.submissionTime = submissionTime;
        battle.creator.status         = status;
      } else if (battle.opponent.userhandle === userhandle) {
        battle.opponent.hasSubmitted   = true;
        battle.opponent.submissionTime = submissionTime;
        battle.opponent.status         = status;
      }

      io.to(roomId).emit('battle:opponentSubmitted', { userhandle, status });

      if (status === 'Accepted') {
        battle.winner  = userhandle;
        battle.status  = 'finished';
        battle.endTime = new Date();
        await battle.save();

        const ratingChanges = await updateRatings(battle, userhandle);

        io.to(roomId).emit('battle:finished', {
          winner:         userhandle,
          reason:         'solved',
          creatorStatus:  battle.creator.status,
          opponentStatus: battle.opponent.status,
          ratingChanges,
        });
        console.log(`Battle ${roomId} won by ${userhandle}`);
        return;
      }

      await battle.save();
    } catch (err) { console.error('Battle submit error:', err); }
  });

  // ── Timeout ──
  socket.on('battle:timeout', async ({ roomId }) => {
    try {
      roomId = roomId.toUpperCase();
      const battle = await Battle.findOne({ roomId });
      if (!battle || battle.status !== 'ongoing') return;

      let winner = 'draw';
      const cAC = battle.creator.status  === 'Accepted';
      const oAC = battle.opponent.status === 'Accepted';

      if      (cAC && !oAC) winner = battle.creator.userhandle;
      else if (!cAC && oAC) winner = battle.opponent.userhandle;
      else if (cAC && oAC)  {
        winner = (battle.creator.submissionTime || Infinity) <
                 (battle.opponent.submissionTime || Infinity)
          ? battle.creator.userhandle
          : battle.opponent.userhandle;
      }

      battle.winner  = winner;
      battle.status  = 'finished';
      battle.endTime = new Date();
      await battle.save();

      const ratingChanges = await updateRatings(battle, winner);

      io.to(roomId).emit('battle:finished', {
        winner,
        reason:         'timeout',
        creatorStatus:  battle.creator.status,
        opponentStatus: battle.opponent.status,
        ratingChanges,
      });
      console.log(`Battle ${roomId} timed out. Winner: ${winner}`);
    } catch (err) { console.error('Battle timeout error:', err); }
  });

  // ── Leave / forfeit ──
  socket.on('battle:leave', async ({ roomId, userhandle }) => {
    try {
      roomId = roomId.toUpperCase();
      const battle = await Battle.findOne({ roomId });
      if (!battle) return;

      if (battle.status === 'ongoing') {
        const winner = battle.creator.userhandle === userhandle
          ? battle.opponent.userhandle
          : battle.creator.userhandle;

        battle.winner  = winner;
        battle.status  = 'finished';
        battle.endTime = new Date();
        await battle.save();

        const ratingChanges = await updateRatings(battle, winner);

        io.to(roomId).emit('battle:finished', {
          winner,
          reason: 'opponent_left',
          ratingChanges,
        });
      } else if (battle.status === 'waiting' || battle.status === 'ready') {
        await Battle.deleteOne({ roomId });
        io.to(roomId).emit('battle:roomClosed', { reason: 'creator_left' });
      }

      socket.leave(roomId);
      console.log(`${userhandle} left battle room ${roomId}`);
    } catch (err) { console.error('Battle leave error:', err); }
  });

  // ── Chat ──
  socket.on('battle:chat', ({ roomId, userhandle, message }) => {
    io.to(roomId).emit('battle:chatMessage', {
      userhandle, message, timestamp: new Date(),
    });
  });

  // ── Disconnect ──
  socket.on('disconnect', async () => {
    try {
      const battle = await Battle.findOne({
        status: { $in: ['waiting','ready','ongoing'] },
        $or: [
          { 'creator.socketId':  socket.id },
          { 'opponent.socketId': socket.id },
        ],
      });
      if (!battle) return;

      const roomId     = battle.roomId;
      const userhandle = battle.creator.socketId === socket.id
        ? battle.creator.userhandle
        : battle.opponent.userhandle;

      if (battle.status === 'ongoing') {
        const winner = battle.creator.userhandle === userhandle
          ? battle.opponent.userhandle
          : battle.creator.userhandle;

        battle.winner  = winner;
        battle.status  = 'finished';
        battle.endTime = new Date();
        await battle.save();

        const ratingChanges = await updateRatings(battle, winner);

        io.to(roomId).emit('battle:finished', {
          winner,
          reason: 'opponent_disconnected',
          ratingChanges,
        });
        console.log(`Battle ${roomId}: ${userhandle} disconnected. Winner: ${winner}`);
      } else if (battle.status === 'waiting') {
        await Battle.deleteOne({ roomId });
        io.to(roomId).emit('battle:roomClosed', { reason: 'creator_disconnected' });
      }

      socket.leave(roomId);
    } catch (err) { console.error('Disconnect handler error:', err); }
  });
};