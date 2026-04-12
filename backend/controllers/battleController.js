// const Battle = require('../models/Battle');
// const Problem = require('../models/problems');  // ← your actual filename
// const crypto = require('crypto');

// // Generate 6-char room ID
// const generateRoomId = () => {
//   return crypto.randomBytes(3).toString('hex').toUpperCase();
// };

// // Assign random problem by difficulty
// const assignProblem = async (difficulty) => {
//   try {
//     let query = {};
//     if (difficulty && difficulty !== 'Random') {
//       query.ProblemLevel = difficulty;
//     }

//     const count = await Problem.countDocuments(query);
//     if (count === 0) {
//       // Fallback: try any problem
//       const fallbackCount = await Problem.countDocuments({});
//       if (fallbackCount === 0) return null;
//       const random = Math.floor(Math.random() * fallbackCount);
//       const problem = await Problem.findOne({}).skip(random);
//       return problem?.PID || null;
//     }

//     const random = Math.floor(Math.random() * count);
//     const problem = await Problem.findOne(query).skip(random);
//     return problem?.PID || null;
//   } catch (error) {
//     console.error('Assign problem error:', error);
//     return null;
//   }
// };

// // Create Room
// const createRoom = async (req, res) => {
//   try {
//     const { password, difficulty, duration } = req.body;
//     const userhandle = req.signedCookies?.token?.userhandle;

//     if (!userhandle) {
//       return res.status(401).json({ error: 'Please login first' });
//     }

//     // Delete any old waiting room by this user
//     const existingRoom = await Battle.findOne({
//       'creator.userhandle': userhandle,
//       status: { $in: ['waiting', 'ready'] },
//     });
//     if (existingRoom) {
//       await Battle.deleteOne({ roomId: existingRoom.roomId });
//     }

//     // Generate unique room ID
//     let roomId;
//     let exists = true;
//     let attempts = 0;
//     while (exists && attempts < 10) {
//       roomId = generateRoomId();
//       exists = await Battle.findOne({ roomId });
//       attempts++;
//     }

//     if (exists) {
//       return res.status(500).json({ error: 'Failed to generate room ID, try again' });
//     }

//     const battle = new Battle({
//       roomId,
//       password: password || null,
//       difficulty: difficulty || 'Random',
//       duration: duration || 30,
//       creator: {
//         userhandle,
//         isReady: false,
//       },
//       status: 'waiting',
//     });

//     await battle.save();

//     res.status(201).json({
//       message: 'Room created successfully',
//       roomId,
//       hasPassword: !!password,
//     });
//   } catch (error) {
//     console.error('Create room error:', error);
//     res.status(500).json({ error: 'Failed to create room' });
//   }
// };

// // Join Room
// const joinRoom = async (req, res) => {
//   try {
//     const { roomId, password } = req.body;
//     const userhandle = req.signedCookies?.token?.userhandle;

//     if (!userhandle) {
//       return res.status(401).json({ error: 'Please login first' });
//     }

//     if (!roomId) {
//       return res.status(400).json({ error: 'Room ID is required' });
//     }

//     const battle = await Battle.findOne({ roomId: roomId.toUpperCase() });

//     if (!battle) {
//       return res.status(404).json({ error: 'Room not found' });
//     }

//     if (battle.status !== 'waiting') {
//       return res.status(400).json({ error: 'Room is not available' });
//     }

//     if (battle.creator.userhandle === userhandle) {
//       return res.status(400).json({ error: 'Cannot join your own room' });
//     }

//     if (battle.opponent.userhandle) {
//       return res.status(400).json({ error: 'Room is full' });
//     }

//     // Check password
//     if (battle.password && battle.password !== password) {
//       return res.status(403).json({ error: 'Incorrect password' });
//     }

//     battle.opponent.userhandle = userhandle;
//     battle.status = 'ready';
//     await battle.save();

//     res.status(200).json({
//       message: 'Joined successfully',
//       roomId: battle.roomId,
//       creator: battle.creator.userhandle,
//       difficulty: battle.difficulty,
//       duration: battle.duration,
//     });
//   } catch (error) {
//     console.error('Join room error:', error);
//     res.status(500).json({ error: 'Failed to join room' });
//   }
// };

// // Get Room Details
// const getRoomDetails = async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const battle = await Battle.findOne({ roomId: roomId.toUpperCase() });

//     if (!battle) {
//       return res.status(404).json({ error: 'Room not found' });
//     }

//     res.json({
//       roomId: battle.roomId,
//       difficulty: battle.difficulty,
//       duration: battle.duration,
//       status: battle.status,
//       password: battle.password ? true : false,
//       problemPID: (battle.status === 'ongoing' || battle.status === 'finished')
//         ? battle.problemPID
//         : null,
//       creator: {
//         userhandle: battle.creator.userhandle,
//         isReady: battle.creator.isReady,
//         hasSubmitted: battle.creator.hasSubmitted,
//         status: battle.creator.status,
//       },
//       opponent: {
//         userhandle: battle.opponent.userhandle,
//         isReady: battle.opponent.isReady,
//         hasSubmitted: battle.opponent.hasSubmitted,
//         status: battle.opponent.status,
//       },
//       winner: battle.winner,
//       startTime: battle.startTime,
//       endTime: battle.endTime,
//     });
//   } catch (error) {
//     console.error('Get room error:', error);
//     res.status(500).json({ error: 'Failed to get room details' });
//   }
// };

// // Get Active Public Rooms
// const getActiveRooms = async (req, res) => {
//   try {
//     const rooms = await Battle.find({
//       status: 'waiting',
//       password: null,
//     })
//       .select('roomId difficulty duration creator createdAt')
//       .sort({ createdAt: -1 })
//       .limit(20);

//     res.json(rooms);
//   } catch (error) {
//     console.error('Get active rooms error:', error);
//     res.status(500).json({ error: 'Failed to get rooms' });
//   }
// };

// // Get Battle History
// const getBattleHistory = async (req, res) => {
//   try {
//     const { userhandle } = req.params;

//     const battles = await Battle.find({
//       status: 'finished',
//       $or: [
//         { 'creator.userhandle': userhandle },
//         { 'opponent.userhandle': userhandle },
//       ],
//     })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     const history = battles.map(b => ({
//       roomId: b.roomId,
//       difficulty: b.difficulty,
//       opponent: b.creator.userhandle === userhandle
//         ? b.opponent.userhandle
//         : b.creator.userhandle,
//       result: b.winner === userhandle
//         ? 'Won'
//         : b.winner === 'draw'
//         ? 'Draw'
//         : 'Lost',
//       problemPID: b.problemPID,
//       date: b.createdAt,
//       duration: b.duration,
//     }));

//     res.json(history);
//   } catch (error) {
//     console.error('Get history error:', error);
//     res.status(500).json({ error: 'Failed to get history' });
//   }
// };

// module.exports = {
//   createRoom,
//   joinRoom,
//   getRoomDetails,
//   getActiveRooms,
//   getBattleHistory,
//   assignProblem,
// };













// backend/controllers/battleController.js

const Battle  = require('../models/Battle');
const Problem = require('../models/problems');
const User    = require('../models/User');

// ══════════════════════════════════════════
// ── Helper: Generate Room ID ──
// ══════════════════════════════════════════
const generateRoomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let roomId  = '';
  for (let i = 0; i < 6; i++) {
    roomId += chars[Math.floor(Math.random() * chars.length)];
  }
  return roomId;
};

// ══════════════════════════════════════════
// ── Helper: Assign Problem (used by battleSocket too) ──
// ══════════════════════════════════════════
const assignProblem = async (difficulty) => {
  try {
    const levelMap = {
      easy:   'Easy',
      medium: 'Medium',
      hard:   'Hard',
    };

    const level    = levelMap[difficulty?.toLowerCase()] || 'Medium';
    const problems = await Problem.find({ ProblemLevel: level }).lean();

    if (!problems || problems.length === 0) {
      console.warn(`[Battle] No problems found for difficulty: ${level}`);
      return null;
    }

    const random  = Math.floor(Math.random() * problems.length);
    const problem = problems[random];

    console.log(`[Battle] Assigned problem: ${problem.PID} (${level})`);
    return problem.PID;

  } catch (err) {
    console.error('[Battle] assignProblem error:', err);
    return null;
  }
};

// ══════════════════════════════════════════
// ── Create Room ──
// ══════════════════════════════════════════
const createRoom = async (req, res) => {
  try {
    const { difficulty, duration, password } = req.body;
    const userhandle = req.user?.userhandle;

    if (!userhandle) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Generate unique Room ID
    let roomId;
    let exists = true;
    while (exists) {
      roomId = generateRoomId();
      exists = await Battle.findOne({ roomId });
    }

    const battle = new Battle({
      roomId,
      difficulty: difficulty || 'medium',
      duration:   duration   || 30,
      password:   password   || null,
      status:     'waiting',
      creator: {
        userhandle,
        isReady:      false,
        hasSubmitted: false,
        status:       null,
      },
      opponent: {
        userhandle:   null,
        isReady:      false,
        hasSubmitted: false,
        status:       null,
      },
    });

    await battle.save();

    console.log(`[Battle] Room ${roomId} created by ${userhandle}`);
    res.status(201).json({
      roomId,
      difficulty: battle.difficulty,
      duration:   battle.duration,
    });

  } catch (err) {
    console.error('[Battle] createRoom error:', err);
    res.status(500).json({ message: 'Server error creating room' });
  }
};

// ══════════════════════════════════════════
// ── Join Room ──
// ══════════════════════════════════════════
const joinRoom = async (req, res) => {
  try {
    const { roomId, password } = req.body;
    const userhandle           = req.user?.userhandle;

    if (!userhandle) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const battle = await Battle.findOne({ roomId: roomId?.toUpperCase() });

    if (!battle) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (battle.status !== 'waiting') {
      return res.status(400).json({ 
        message: 'Battle already started or finished' 
      });
    }

    if (battle.creator.userhandle === userhandle) {
      return res.status(400).json({ 
        message: 'You are the creator of this room' 
      });
    }

    // ✅ Password check
    if (battle.password && battle.password !== password) {
      return res.status(403).json({ message: 'Incorrect room password' });
    }

    // ✅ Set opponent
    battle.opponent.userhandle   = userhandle;
    battle.opponent.isReady      = false;
    battle.opponent.hasSubmitted = false;
    battle.status                = 'ready';
    await battle.save();

    console.log(`[Battle] ${userhandle} joined room ${roomId}`);
    res.json({
      roomId:     battle.roomId,
      difficulty: battle.difficulty,
      duration:   battle.duration,
    });

  } catch (err) {
    console.error('[Battle] joinRoom error:', err);
    res.status(500).json({ message: 'Server error joining room' });
  }
};

// ══════════════════════════════════════════
// ── Get Room Details ──
// ══════════════════════════════════════════
const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const battle = await Battle.findOne({ 
      roomId: roomId?.toUpperCase() 
    }).lean();

    if (!battle) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // ✅ Fetch user stats for both players
    const [cUser, oUser] = await Promise.all([
      battle.creator.userhandle
        ? User.findOne(
            { userhandle: battle.creator.userhandle },
            'rating badge battleStats'
          ).lean()
        : null,
      battle.opponent.userhandle
        ? User.findOne(
            { userhandle: battle.opponent.userhandle },
            'rating badge battleStats'
          ).lean()
        : null,
    ]);

    const defaultBadge = { name: 'Bronze', emoji: '🥉', color: '#cd7f32' };

    res.json({
      ...battle,
      creator: {
        ...battle.creator,
        rating:      cUser?.rating      ?? 0,
        badge:       cUser?.badge       ?? defaultBadge,
        battleStats: cUser?.battleStats ?? {
          wins: 0, losses: 0, draws: 0, totalBattles: 0,
        },
      },
      opponent: {
        ...battle.opponent,
        rating:      oUser?.rating      ?? 0,
        badge:       oUser?.badge       ?? defaultBadge,
        battleStats: oUser?.battleStats ?? {
          wins: 0, losses: 0, draws: 0, totalBattles: 0,
        },
      },
    });

  } catch (err) {
    console.error('[Battle] getRoomDetails error:', err);
    res.status(500).json({ message: 'Server error getting room details' });
  }
};

// ══════════════════════════════════════════
// ── Get Active Rooms ──
// ══════════════════════════════════════════
const getActiveRooms = async (req, res) => {
  try {
    const rooms = await Battle.find({
      status: { $in: ['waiting', 'ready', 'ongoing'] },
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    res.json(rooms);

  } catch (err) {
    console.error('[Battle] getActiveRooms error:', err);
    res.status(500).json({ message: 'Server error getting active rooms' });
  }
};

// ══════════════════════════════════════════
// ── Get Battle History ──
// ══════════════════════════════════════════
const getBattleHistory = async (req, res) => {
  try {
    const { userhandle } = req.params;

    const battles = await Battle.find({
      $or: [
        { 'creator.userhandle':  userhandle },
        { 'opponent.userhandle': userhandle },
      ],
      status: 'finished',
    })
    .sort({ endTime: -1 })
    .limit(20)
    .lean();

    // ✅ Format for frontend display
    const formatted = battles.map(b => {
      const isCreator = b.creator.userhandle === userhandle;
      const me        = isCreator ? b.creator  : b.opponent;
      const opponent  = isCreator ? b.opponent : b.creator;
      const myChanges = b.ratingChanges
        ? (isCreator ? b.ratingChanges.creator : b.ratingChanges.opponent)
        : null;

      return {
        roomId:       b.roomId,
        difficulty:   b.difficulty,
        duration:     b.duration,
        problemPID:   b.problemPID,
        result:       b.winner === userhandle
                        ? 'win'
                        : b.winner === 'draw'
                        ? 'draw'
                        : 'loss',
        winner:       b.winner,
        opponent:     opponent.userhandle,
        myStatus:     me.status,
        ratingChange: myChanges || null,
        endTime:      b.endTime,
        startTime:    b.startTime,
      };
    });

    res.json(formatted);

  } catch (err) {
    console.error('[Battle] getBattleHistory error:', err);
    res.status(500).json({ message: 'Server error getting battle history' });
  }
};

// ══════════════════════════════════════════
// ── Exports ──
// ══════════════════════════════════════════
module.exports = {
  createRoom,       // ✅ used by battleRoutes.js
  joinRoom,         // ✅ used by battleRoutes.js
  getRoomDetails,   // ✅ used by battleRoutes.js
  getActiveRooms,   // ✅ used by battleRoutes.js
  getBattleHistory, // ✅ used by battleRoutes.js
  assignProblem,    // ✅ used by battleSocket.js
};