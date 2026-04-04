// // const Battle = require('../models/Battle');
// // const Problem = require('../models/problems');         // ← your actual filename
// // const { assignProblem } = require('../controllers/battleController');

// // module.exports = (io, socket) => {

// //   // ── Join battle room ──
// //   socket.on('battle:join', async ({ roomId, userhandle }) => {
// //     try {
// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle) {
// //         socket.emit('battle:error', { message: 'Room not found' });
// //         return;
// //       }

// //       // Store socket ID
// //       if (battle.creator.userhandle === userhandle) {
// //         battle.creator.socketId = socket.id;
// //       } else if (battle.opponent.userhandle === userhandle) {
// //         battle.opponent.socketId = socket.id;
// //       }
// //       await battle.save();

// //       socket.join(roomId);

// //       io.to(roomId).emit('battle:userJoined', {
// //         userhandle,
// //         creator: {
// //           userhandle: battle.creator.userhandle,
// //           isReady:    battle.creator.isReady,
// //         },
// //         opponent: {
// //           userhandle: battle.opponent.userhandle,
// //           isReady:    battle.opponent.isReady,
// //         },
// //       });

// //       console.log(`${userhandle} joined battle room ${roomId}`);
// //     } catch (error) {
// //       console.error('Battle join error:', error);
// //       socket.emit('battle:error', { message: 'Failed to join room' });
// //     }
// //   });

// //   // ── Player ready ──
// //   socket.on('battle:ready', async ({ roomId, userhandle }) => {
// //     try {
// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle) return;

// //       if (battle.creator.userhandle === userhandle) {
// //         battle.creator.isReady = true;
// //       } else if (battle.opponent.userhandle === userhandle) {
// //         battle.opponent.isReady = true;
// //       }
// //       await battle.save();

// //       io.to(roomId).emit('battle:playerReady', { userhandle });

// //       // Both ready → start battle
// //       if (battle.creator.isReady && battle.opponent.isReady) {
// //         const problemPID = await assignProblem(battle.difficulty);

// //         if (!problemPID) {
// //           io.to(roomId).emit('battle:error', {
// //             message: 'No problems available for this difficulty. Ask admin to add problems.',
// //           });
// //           return;
// //         }

// //         // ── FIXED: use correct model filename ──
// //         const problem = await Problem.findOne({ PID: problemPID });

// //         battle.problemPID  = problemPID;
// //         battle.status      = 'ongoing';
// //         battle.startTime   = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:start', {
// //           problemPID,
// //           problemName:  problem?.ProblemName  || 'Problem',
// //           problemLevel: problem?.ProblemLevel || 'Medium',
// //           duration:     battle.duration,
// //           startTime:    battle.startTime,
// //         });

// //         console.log(`Battle started → room=${roomId} problem=${problemPID}`);
// //       }
// //     } catch (error) {
// //       console.error('Battle ready error:', error);
// //     }
// //   });

// //   // ── Player submits solution ──
// //   socket.on('battle:submit', async ({ roomId, userhandle, status, time }) => {
// //     try {
// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle || battle.status !== 'ongoing') return;

// //       const submissionTime = Date.now() - new Date(battle.startTime).getTime();

// //       if (battle.creator.userhandle === userhandle) {
// //         battle.creator.hasSubmitted    = true;
// //         battle.creator.submissionTime  = submissionTime;
// //         battle.creator.status          = status;
// //       } else if (battle.opponent.userhandle === userhandle) {
// //         battle.opponent.hasSubmitted   = true;
// //         battle.opponent.submissionTime = submissionTime;
// //         battle.opponent.status         = status;
// //       }

// //       io.to(roomId).emit('battle:opponentSubmitted', { userhandle, status });

// //       // Accepted → winner
// //       if (status === 'Accepted') {
// //         battle.winner  = userhandle;
// //         battle.status  = 'finished';
// //         battle.endTime = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:finished', {
// //           winner:         userhandle,
// //           reason:         'solved',
// //           creatorStatus:  battle.creator.status,
// //           creatorTime:    battle.creator.submissionTime,
// //           opponentStatus: battle.opponent.status,
// //           opponentTime:   battle.opponent.submissionTime,
// //         });

// //         console.log(`Battle ${roomId} won by ${userhandle}`);
// //         return;
// //       }

// //       await battle.save();
// //     } catch (error) {
// //       console.error('Battle submit error:', error);
// //     }
// //   });

// //   // ── Time's up ──
// //   socket.on('battle:timeout', async ({ roomId }) => {
// //     try {
// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle || battle.status !== 'ongoing') return;

// //       let winner      = 'draw';
// //       const creatorAC  = battle.creator.status  === 'Accepted';
// //       const opponentAC = battle.opponent.status === 'Accepted';

// //       if (creatorAC && !opponentAC) {
// //         winner = battle.creator.userhandle;
// //       } else if (!creatorAC && opponentAC) {
// //         winner = battle.opponent.userhandle;
// //       } else if (creatorAC && opponentAC) {
// //         winner =
// //           (battle.creator.submissionTime  || Infinity) <
// //           (battle.opponent.submissionTime || Infinity)
// //             ? battle.creator.userhandle
// //             : battle.opponent.userhandle;
// //       }

// //       battle.winner  = winner;
// //       battle.status  = 'finished';
// //       battle.endTime = new Date();
// //       await battle.save();

// //       io.to(roomId).emit('battle:finished', {
// //         winner,
// //         reason:         'timeout',
// //         creatorStatus:  battle.creator.status,
// //         creatorTime:    battle.creator.submissionTime,
// //         opponentStatus: battle.opponent.status,
// //         opponentTime:   battle.opponent.submissionTime,
// //       });

// //       console.log(`Battle ${roomId} timed out. Winner: ${winner}`);
// //     } catch (error) {
// //       console.error('Battle timeout error:', error);
// //     }
// //   });

// //   // ── Player leaves ──
// //   socket.on('battle:leave', async ({ roomId, userhandle }) => {
// //     try {
// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle) return;

// //       if (battle.status === 'ongoing') {
// //         const winner = battle.creator.userhandle === userhandle
// //           ? battle.opponent.userhandle
// //           : battle.creator.userhandle;

// //         battle.winner  = winner;
// //         battle.status  = 'finished';
// //         battle.endTime = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:finished', {
// //           winner,
// //           reason: 'opponent_left',
// //         });
// //       } else if (battle.status === 'waiting' || battle.status === 'ready') {
// //         await Battle.deleteOne({ roomId });
// //         io.to(roomId).emit('battle:roomClosed', { reason: 'creator_left' });
// //       }

// //       socket.leave(roomId);
// //       console.log(`${userhandle} left battle room ${roomId}`);
// //     } catch (error) {
// //       console.error('Battle leave error:', error);
// //     }
// //   });

// //   // ── Chat ──
// //   socket.on('battle:chat', ({ roomId, userhandle, message }) => {
// //     io.to(roomId).emit('battle:chatMessage', {
// //       userhandle,
// //       message,
// //       timestamp: new Date(),
// //     });
// //   });

// //   // ── Handle disconnect ──
// //   socket.on('disconnect', async () => {
// //     try {
// //       const battle = await Battle.findOne({
// //         status: { $in: ['waiting', 'ready', 'ongoing'] },
// //         $or: [
// //           { 'creator.socketId':  socket.id },
// //           { 'opponent.socketId': socket.id },
// //         ],
// //       });

// //       if (!battle) return;

// //       const userhandle = battle.creator.socketId === socket.id
// //         ? battle.creator.userhandle
// //         : battle.opponent.userhandle;

// //       if (battle.status === 'ongoing') {
// //         const winner = battle.creator.userhandle === userhandle
// //           ? battle.opponent.userhandle
// //           : battle.creator.userhandle;

// //         battle.winner  = winner;
// //         battle.status  = 'finished';
// //         battle.endTime = new Date();
// //         await battle.save();

// //         io.to(battle.roomId).emit('battle:finished', {
// //           winner,
// //           reason: 'opponent_disconnected',
// //         });

// //         console.log(`Battle ${battle.roomId}: ${userhandle} disconnected. Winner: ${winner}`);
// //       } else if (battle.status === 'waiting') {
// // //         await Battle.deleteOne({ roomId: battle.roomId });
// // //         io.to(battle.roomId).emit('battle:roomClosed', { reason: 'creator_disconnected' });
// // //       }
// // //     } catch (error) {
// // //       console.error('Disconnect handler error:', error);
// // //     }
// // //   });
// // // };















// // const Battle = require('../models/Battle');
// // const Problem = require('../models/problems');
// // const { assignProblem } = require('../controllers/battleController');

// // module.exports = (io, socket) => {

// //   // ── Join battle room ──
// //   socket.on('battle:join', async ({ roomId, userhandle }) => {
// //     try {
// //       // ✅ FIXED: Normalize room id to uppercase
// //       roomId = roomId.toUpperCase();

// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle) {
// //         socket.emit('battle:error', { message: 'Room not found' });
// //         return;
// //       }

// //       // Store socket ID
// //       if (battle.creator.userhandle === userhandle) {
// //         battle.creator.socketId = socket.id;
// //       } else if (battle.opponent.userhandle === userhandle) {
// //         battle.opponent.socketId = socket.id;
// //       }
// //       await battle.save();

// //       // Join socket room
// //       socket.join(roomId);

// //       // Notify room
// //       io.to(roomId).emit('battle:userJoined', {
// //         userhandle,
// //         creator: {
// //           userhandle: battle.creator.userhandle,
// //           isReady: battle.creator.isReady,
// //         },
// //         opponent: {
// //           userhandle: battle.opponent.userhandle,
// //           isReady: battle.opponent.isReady,
// //         },
// //       });

// //       console.log(`${userhandle} joined battle room ${roomId}`);
// //     } catch (error) {
// //       console.error('Battle join error:', error);
// //       socket.emit('battle:error', { message: 'Failed to join room' });
// //     }
// //   });

// //   // ── Player ready ──
// //   socket.on('battle:ready', async ({ roomId, userhandle }) => {
// //     try {
// //       // ✅ FIXED: Normalize room id to uppercase
// //       roomId = roomId.toUpperCase();

// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle) return;

// //       if (battle.creator.userhandle === userhandle) {
// //         battle.creator.isReady = true;
// //       } else if (battle.opponent.userhandle === userhandle) {
// //         battle.opponent.isReady = true;
// //       }
// //       await battle.save();

// //       io.to(roomId).emit('battle:playerReady', { userhandle });

// //       // Both ready → start battle
// //       if (battle.creator.isReady && battle.opponent.isReady) {
// //         const problemPID = await assignProblem(battle.difficulty);

// //         if (!problemPID) {
// //           io.to(roomId).emit('battle:error', {
// //             message: 'No problems available for this difficulty. Ask admin to add problems.',
// //           });
// //           return;
// //         }

// //         // Get full problem details
// //         const problem = await Problem.findOne({ PID: problemPID }).lean();

// //         battle.problemPID = problemPID;
// //         battle.status = 'ongoing';
// //         battle.startTime = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:start', {
// //           problemPID,
// //           problemName: problem?.ProblemName || 'Problem',
// //           problemLevel: problem?.ProblemLevel || 'Medium',
// //           duration: battle.duration,
// //           startTime: battle.startTime,
// //         });

// //         console.log(`Battle started → room=${roomId} problem=${problemPID}`);
// //       }
// //     } catch (error) {
// //       console.error('Battle ready error:', error);
// //     }
// //   });

// //   // ── Player submits solution ──
// //   socket.on('battle:submit', async ({ roomId, userhandle, status, time }) => {
// //     try {
// //       // ✅ FIXED: Normalize room id to uppercase
// //       roomId = roomId.toUpperCase();

// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle || battle.status !== 'ongoing') return;

// //       const submissionTime = Date.now() - new Date(battle.startTime).getTime();

// //       if (battle.creator.userhandle === userhandle) {
// //         battle.creator.hasSubmitted = true;
// //         battle.creator.submissionTime = submissionTime;
// //         battle.creator.status = status;
// //       } else if (battle.opponent.userhandle === userhandle) {
// //         battle.opponent.hasSubmitted = true;
// //         battle.opponent.submissionTime = submissionTime;
// //         battle.opponent.status = status;
// //       }

// //       // Notify everyone in room
// //       io.to(roomId).emit('battle:opponentSubmitted', { userhandle, status });

// //       // If Accepted → this player wins immediately
// //       if (status === 'Accepted') {
// //         battle.winner = userhandle;
// //         battle.status = 'finished';
// //         battle.endTime = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:finished', {
// //           winner: userhandle,
// //           reason: 'solved',
// //           creatorStatus: battle.creator.status,
// //           creatorTime: battle.creator.submissionTime,
// //           opponentStatus: battle.opponent.status,
// //           opponentTime: battle.opponent.submissionTime,
// //         });

// //         console.log(`Battle ${roomId} won by ${userhandle}`);
// //         return;
// //       }

// //       await battle.save();
// //     } catch (error) {
// //       console.error('Battle submit error:', error);
// //     }
// //   });

// //   // ── Time's up ──
// //   socket.on('battle:timeout', async ({ roomId }) => {
// //     try {
// //       // ✅ FIXED: Normalize room id to uppercase
// //       roomId = roomId.toUpperCase();

// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle || battle.status !== 'ongoing') return;

// //       let winner = 'draw';
// //       const creatorAC = battle.creator.status === 'Accepted';
// //       const opponentAC = battle.opponent.status === 'Accepted';

// //       if (creatorAC && !opponentAC) {
// //         winner = battle.creator.userhandle;
// //       } else if (!creatorAC && opponentAC) {
// //         winner = battle.opponent.userhandle;
// //       } else if (creatorAC && opponentAC) {
// //         // Both solved → faster wins
// //         winner = (battle.creator.submissionTime || Infinity) < (battle.opponent.submissionTime || Infinity)
// //           ? battle.creator.userhandle
// //           : battle.opponent.userhandle;
// //       }

// //       battle.winner = winner;
// //       battle.status = 'finished';
// //       battle.endTime = new Date();
// //       await battle.save();

// //       io.to(roomId).emit('battle:finished', {
// //         winner,
// //         reason: 'timeout',
// //         creatorStatus: battle.creator.status,
// //         creatorTime: battle.creator.submissionTime,
// //         opponentStatus: battle.opponent.status,
// //         opponentTime: battle.opponent.submissionTime,
// //       });

// //       console.log(`Battle ${roomId} timed out. Winner: ${winner}`);
// //     } catch (error) {
// //       console.error('Battle timeout error:', error);
// //     }
// //   });

// //   // ── Player leaves / forfeits ──
// //   socket.on('battle:leave', async ({ roomId, userhandle }) => {
// //     try {
// //       // ✅ FIXED: Normalize room id to uppercase
// //       roomId = roomId.toUpperCase();

// //       const battle = await Battle.findOne({ roomId });
// //       if (!battle) return;

// //       if (battle.status === 'ongoing') {
// //         // Other player wins
// //         const winner = battle.creator.userhandle === userhandle
// //           ? battle.opponent.userhandle
// //           : battle.creator.userhandle;

// //         battle.winner = winner;
// //         battle.status = 'finished';
// //         battle.endTime = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:finished', {
// //           winner,
// //           reason: 'opponent_left',
// //         });

// //       } else if (battle.status === 'waiting' || battle.status === 'ready') {
// //         await Battle.deleteOne({ roomId });
// //         io.to(roomId).emit('battle:roomClosed', { reason: 'creator_left' });
// //       }

// //       socket.leave(roomId);
// //       console.log(`${userhandle} left battle room ${roomId}`);
// //     } catch (error) {
// //       console.error('Battle leave error:', error);
// //     }
// //   });

// //   // ── Chat ──
// //   socket.on('battle:chat', ({ roomId, userhandle, message }) => {
// //     io.to(roomId).emit('battle:chatMessage', {
// //       userhandle,
// //       message,
// //       timestamp: new Date(),
// //     });
// //   });

// //   // ── Handle disconnect ──
// //   socket.on('disconnect', async () => {
// //     try {
// //       const battle = await Battle.findOne({
// //         status: { $in: ['waiting', 'ready', 'ongoing'] },
// //         $or: [
// //           { 'creator.socketId': socket.id },
// //           { 'opponent.socketId': socket.id },
// //         ],
// //       });

// //       if (!battle) return;
// //       const roomId = battle.roomId;

// //       const userhandle = battle.creator.socketId === socket.id
// //         ? battle.creator.userhandle
// //         : battle.opponent.userhandle;

// //       if (battle.status === 'ongoing') {
// //         const winner = battle.creator.userhandle === userhandle
// //           ? battle.opponent.userhandle
// //           : battle.creator.userhandle;

// //         battle.winner = winner;
// //         battle.status = 'finished';
// //         battle.endTime = new Date();
// //         await battle.save();

// //         io.to(roomId).emit('battle:finished', {
// //           winner,
// //           reason: 'opponent_disconnected',
// //         });

// //         console.log(`Battle ${roomId}: ${userhandle} disconnected. Winner: ${winner}`);
// //       } else if (battle.status === 'waiting') {
// //         await Battle.deleteOne({ roomId });
// //         io.to(roomId).emit('battle:roomClosed', { reason: 'creator_disconnected' });
// //       }

// //       socket.leave(roomId);

// //     } catch (error) {
// //       console.error('Disconnect handler error:', error);
// //     }
// //   });
// // };











// // backend/socket/battleSocket.js
// const Battle = require('../models/Battle');
// const Problem = require('../models/problems');
// const User = require('../models/User');
// const { assignProblem } = require('../controllers/battleController');
// const { calculateNewRatings, getBadge } = require('../utils/ratingCalculator');

// // ══════════════════════════════════════════
// // ── Central rating updater ──
// // ══════════════════════════════════════════
// async function updateRatings(battle, winner) {
//   try {
//     const creatorHandle  = battle.creator.userhandle;
//     const opponentHandle = battle.opponent.userhandle;

//     if (!creatorHandle || !opponentHandle) return null;

//     // Fetch both users
//     const [creatorUser, opponentUser] = await Promise.all([
//       User.findOne({ userhandle: creatorHandle }),
//       User.findOne({ userhandle: opponentHandle }),
//     ]);

//     if (!creatorUser || !opponentUser) {
//       console.warn('Rating update skipped: user(s) not found');
//       return null;
//     }

//     // Determine result from creator's perspective
//     let result;
//     if (winner === 'draw')             result = 'draw';
//     else if (winner === creatorHandle) result = 'A';
//     else                               result = 'B';

//     const creatorBattles  = creatorUser.battleStats?.totalBattles  || 0;
//     const opponentBattles = opponentUser.battleStats?.totalBattles || 0;

//     // Calculate Elo
//     const ratings = calculateNewRatings(
//       creatorUser.rating  ?? 1200,
//       opponentUser.rating ?? 1200,
//       result,
//       creatorBattles,
//       opponentBattles,
//     );

//     const now = new Date();

//     // ── Creator update ──
//     const creatorResult =
//       result === 'A'    ? 'win'  :
//       result === 'draw' ? 'draw' : 'loss';

//     creatorUser.rating = ratings.A.newRating;
//     creatorUser.badge  = {
//       name:  ratings.A.badge.name,
//       emoji: ratings.A.badge.emoji,
//       color: ratings.A.badge.color,
//     };
//     creatorUser.battleStats = creatorUser.battleStats || {};
//     creatorUser.battleStats.totalBattles = creatorBattles + 1;
//     if (creatorResult === 'win')       creatorUser.battleStats.wins   = (creatorUser.battleStats.wins   || 0) + 1;
//     else if (creatorResult === 'loss') creatorUser.battleStats.losses = (creatorUser.battleStats.losses || 0) + 1;
//     else                               creatorUser.battleStats.draws  = (creatorUser.battleStats.draws  || 0) + 1;

//     creatorUser.ratingHistory = creatorUser.ratingHistory || [];
//     creatorUser.ratingHistory.push({
//       rating:   ratings.A.newRating,
//       delta:    ratings.A.delta,
//       opponent: opponentHandle,
//       result:   creatorResult,
//       roomId:   battle.roomId,
//       date:     now,
//     });
//     // Keep last 50
//     if (creatorUser.ratingHistory.length > 50) {
//       creatorUser.ratingHistory = creatorUser.ratingHistory.slice(-50);
//     }

//     // ── Opponent update ──
//     const opponentResult =
//       result === 'B'    ? 'win'  :
//       result === 'draw' ? 'draw' : 'loss';

//     opponentUser.rating = ratings.B.newRating;
//     opponentUser.badge  = {
//       name:  ratings.B.badge.name,
//       emoji: ratings.B.badge.emoji,
//       color: ratings.B.badge.color,
//     };
//     opponentUser.battleStats = opponentUser.battleStats || {};
//     opponentUser.battleStats.totalBattles = opponentBattles + 1;
//     if (opponentResult === 'win')       opponentUser.battleStats.wins   = (opponentUser.battleStats.wins   || 0) + 1;
//     else if (opponentResult === 'loss') opponentUser.battleStats.losses = (opponentUser.battleStats.losses || 0) + 1;
//     else                                opponentUser.battleStats.draws  = (opponentUser.battleStats.draws  || 0) + 1;

//     opponentUser.ratingHistory = opponentUser.ratingHistory || [];
//     opponentUser.ratingHistory.push({
//       rating:   ratings.B.newRating,
//       delta:    ratings.B.delta,
//       opponent: creatorHandle,
//       result:   opponentResult,
//       roomId:   battle.roomId,
//       date:     now,
//     });
//     if (opponentUser.ratingHistory.length > 50) {
//       opponentUser.ratingHistory = opponentUser.ratingHistory.slice(-50);
//     }

//     // Save both users in parallel
//     await Promise.all([creatorUser.save(), opponentUser.save()]);

//     // Store rating snapshot on Battle document
//     battle.ratingChanges = {
//       creator: {
//         oldRating: ratings.A.oldRating,
//         newRating: ratings.A.newRating,
//         delta:     ratings.A.delta,
//         badge:     ratings.A.badge.name,
//       },
//       opponent: {
//         oldRating: ratings.B.oldRating,
//         newRating: ratings.B.newRating,
//         delta:     ratings.B.delta,
//         badge:     ratings.B.badge.name,
//       },
//     };
//     await battle.save();

//     console.log(
//       `[Rating] ${creatorHandle}: ${ratings.A.oldRating} → ${ratings.A.newRating} ` +
//       `(${ratings.A.delta >= 0 ? '+' : ''}${ratings.A.delta}) [${ratings.A.badge.name}] | ` +
//       `${opponentHandle}: ${ratings.B.oldRating} → ${ratings.B.newRating} ` +
//       `(${ratings.B.delta >= 0 ? '+' : ''}${ratings.B.delta}) [${ratings.B.badge.name}]`
//     );

//     // Return keyed by userhandle for easy frontend lookup
//     return {
//       [creatorHandle]: {
//         oldRating: ratings.A.oldRating,
//         newRating: ratings.A.newRating,
//         delta:     ratings.A.delta,
//         badge:     ratings.A.badge.name,
//       },
//       [opponentHandle]: {
//         oldRating: ratings.B.oldRating,
//         newRating: ratings.B.newRating,
//         delta:     ratings.B.delta,
//         badge:     ratings.B.badge.name,
//       },
//     };
//   } catch (err) {
//     console.error('[Rating] Update failed:', err);
//     return null;
//   }
// }

// // ══════════════════════════════════════════
// // ── Socket handlers ──
// // ══════════════════════════════════════════
// module.exports = (io, socket) => {

//   // ── Join battle room ──
//   socket.on('battle:join', async ({ roomId, userhandle }) => {
//     try {
//       roomId = roomId.toUpperCase();

//       const battle = await Battle.findOne({ roomId });
//       if (!battle) {
//         socket.emit('battle:error', { message: 'Room not found' });
//         return;
//       }

//       // Store socket ID
//       if (battle.creator.userhandle === userhandle) {
//         battle.creator.socketId = socket.id;
//       } else if (battle.opponent.userhandle === userhandle) {
//         battle.opponent.socketId = socket.id;
//       }
//       await battle.save();

//       socket.join(roomId);

//       // Fetch ratings to send on join
//       const [creatorUser, opponentUser] = await Promise.all([
//         User.findOne({ userhandle: battle.creator.userhandle }, 'rating badge battleStats'),
//         User.findOne({ userhandle: battle.opponent.userhandle }, 'rating badge battleStats'),
//       ]);

//       io.to(roomId).emit('battle:userJoined', {
//         userhandle,
//         creator: {
//           userhandle: battle.creator.userhandle,
//           isReady:    battle.creator.isReady,
//           rating:     creatorUser?.rating  ?? 1200,
//           badge:      creatorUser?.badge   ?? { name: 'Pupil', emoji: '🥈', color: '#4ade80' },
//         },
//         opponent: {
//           userhandle: battle.opponent.userhandle,
//           isReady:    battle.opponent.isReady,
//           rating:     opponentUser?.rating ?? 1200,
//           badge:      opponentUser?.badge  ?? { name: 'Pupil', emoji: '🥈', color: '#4ade80' },
//         },
//       });

//       console.log(`${userhandle} joined battle room ${roomId}`);
//     } catch (error) {
//       console.error('Battle join error:', error);
//       socket.emit('battle:error', { message: 'Failed to join room' });
//     }
//   });

//   // ── Player ready ──
//   socket.on('battle:ready', async ({ roomId, userhandle }) => {
//     try {
//       roomId = roomId.toUpperCase();

//       const battle = await Battle.findOne({ roomId });
//       if (!battle) return;

//       if (battle.creator.userhandle === userhandle) {
//         battle.creator.isReady = true;
//       } else if (battle.opponent.userhandle === userhandle) {
//         battle.opponent.isReady = true;
//       }
//       await battle.save();

//       io.to(roomId).emit('battle:playerReady', { userhandle });

//       // Both ready → assign problem & start
//       if (battle.creator.isReady && battle.opponent.isReady) {
//         const problemPID = await assignProblem(battle.difficulty);

//         if (!problemPID) {
//           io.to(roomId).emit('battle:error', {
//             message: 'No problems available for this difficulty. Ask admin to add problems.',
//           });
//           return;
//         }

//         const problem = await Problem.findOne({ PID: problemPID }).lean();

//         battle.problemPID = problemPID;
//         battle.status     = 'ongoing';
//         battle.startTime  = new Date();
//         await battle.save();

//         io.to(roomId).emit('battle:start', {
//           problemPID,
//           problemName:  problem?.ProblemName  || 'Problem',
//           problemLevel: problem?.ProblemLevel || 'Medium',
//           duration:     battle.duration,
//           startTime:    battle.startTime,
//         });

//         console.log(`Battle started → room=${roomId} problem=${problemPID}`);
//       }
//     } catch (error) {
//       console.error('Battle ready error:', error);
//     }
//   });

//   // ── Player submits solution ──
//   socket.on('battle:submit', async ({ roomId, userhandle, status, time }) => {
//     try {
//       roomId = roomId.toUpperCase();

//       const battle = await Battle.findOne({ roomId });
//       if (!battle || battle.status !== 'ongoing') return;

//       const submissionTime = Date.now() - new Date(battle.startTime).getTime();

//       if (battle.creator.userhandle === userhandle) {
//         battle.creator.hasSubmitted   = true;
//         battle.creator.submissionTime = submissionTime;
//         battle.creator.status         = status;
//       } else if (battle.opponent.userhandle === userhandle) {
//         battle.opponent.hasSubmitted   = true;
//         battle.opponent.submissionTime = submissionTime;
//         battle.opponent.status         = status;
//       }

//       // Notify room of submission
//       io.to(roomId).emit('battle:opponentSubmitted', { userhandle, status });

//       // Accepted → instant win
//       if (status === 'Accepted') {
//         battle.winner  = userhandle;
//         battle.status  = 'finished';
//         battle.endTime = new Date();
//         await battle.save();

//         // ── Update ratings ──
//         const ratingChanges = await updateRatings(battle, userhandle);

//         io.to(roomId).emit('battle:finished', {
//           winner:         userhandle,
//           reason:         'solved',
//           creatorStatus:  battle.creator.status,
//           creatorTime:    battle.creator.submissionTime,
//           opponentStatus: battle.opponent.status,
//           opponentTime:   battle.opponent.submissionTime,
//           ratingChanges,
//         });

//         console.log(`Battle ${roomId} won by ${userhandle}`);
//         return;
//       }

//       await battle.save();
//     } catch (error) {
//       console.error('Battle submit error:', error);
//     }
//   });

//   // ── Time's up ──
//   socket.on('battle:timeout', async ({ roomId }) => {
//     try {
//       roomId = roomId.toUpperCase();

//       const battle = await Battle.findOne({ roomId });
//       if (!battle || battle.status !== 'ongoing') return;

//       // Determine winner by submission status
//       let winner = 'draw';
//       const creatorAC  = battle.creator.status  === 'Accepted';
//       const opponentAC = battle.opponent.status === 'Accepted';

//       if (creatorAC && !opponentAC) {
//         winner = battle.creator.userhandle;
//       } else if (!creatorAC && opponentAC) {
//         winner = battle.opponent.userhandle;
//       } else if (creatorAC && opponentAC) {
//         // Both solved → faster wins
//         winner =
//           (battle.creator.submissionTime  || Infinity) <
//           (battle.opponent.submissionTime || Infinity)
//             ? battle.creator.userhandle
//             : battle.opponent.userhandle;
//       }

//       battle.winner  = winner;
//       battle.status  = 'finished';
//       battle.endTime = new Date();
//       await battle.save();

//       // ── Update ratings ──
//       const ratingChanges = await updateRatings(battle, winner);

//       io.to(roomId).emit('battle:finished', {
//         winner,
//         reason:         'timeout',
//         creatorStatus:  battle.creator.status,
//         creatorTime:    battle.creator.submissionTime,
//         opponentStatus: battle.opponent.status,
//         opponentTime:   battle.opponent.submissionTime,
//         ratingChanges,
//       });

//       console.log(`Battle ${roomId} timed out. Winner: ${winner}`);
//     } catch (error) {
//       console.error('Battle timeout error:', error);
//     }
//   });

//   // ── Player leaves / forfeits ──
//   socket.on('battle:leave', async ({ roomId, userhandle }) => {
//     try {
//       roomId = roomId.toUpperCase();

//       const battle = await Battle.findOne({ roomId });
//       if (!battle) return;

//       if (battle.status === 'ongoing') {
//         const winner = battle.creator.userhandle === userhandle
//           ? battle.opponent.userhandle
//           : battle.creator.userhandle;

//         battle.winner  = winner;
//         battle.status  = 'finished';
//         battle.endTime = new Date();
//         await battle.save();

//         // ── Update ratings ──
//         const ratingChanges = await updateRatings(battle, winner);

//         io.to(roomId).emit('battle:finished', {
//           winner,
//           reason: 'opponent_left',
//           ratingChanges,
//         });

//       } else if (battle.status === 'waiting' || battle.status === 'ready') {
//         await Battle.deleteOne({ roomId });
//         io.to(roomId).emit('battle:roomClosed', { reason: 'creator_left' });
//       }

//       socket.leave(roomId);
//       console.log(`${userhandle} left battle room ${roomId}`);
//     } catch (error) {
//       console.error('Battle leave error:', error);
//     }
//   });

//   // ── Chat ──
//   socket.on('battle:chat', ({ roomId, userhandle, message }) => {
//     io.to(roomId).emit('battle:chatMessage', {
//       userhandle,
//       message,
//       timestamp: new Date(),
//     });
//   });

//   // ── Handle disconnect ──
//   socket.on('disconnect', async () => {
//     try {
//       const battle = await Battle.findOne({
//         status: { $in: ['waiting', 'ready', 'ongoing'] },
//         $or: [
//           { 'creator.socketId':  socket.id },
//           { 'opponent.socketId': socket.id },
//         ],
//       });

//       if (!battle) return;

//       const roomId = battle.roomId;
//       const userhandle = battle.creator.socketId === socket.id
//         ? battle.creator.userhandle
//         : battle.opponent.userhandle;

//       if (battle.status === 'ongoing') {
//         const winner = battle.creator.userhandle === userhandle
//           ? battle.opponent.userhandle
//           : battle.creator.userhandle;

//         battle.winner  = winner;
//         battle.status  = 'finished';
//         battle.endTime = new Date();
//         await battle.save();

//         // ── Update ratings ──
//         const ratingChanges = await updateRatings(battle, winner);

//         io.to(roomId).emit('battle:finished', {
//           winner,
//           reason: 'opponent_disconnected',
//           ratingChanges,
//         });

//         console.log(`Battle ${roomId}: ${userhandle} disconnected. Winner: ${winner}`);

//       } else if (battle.status === 'waiting') {
//         await Battle.deleteOne({ roomId });
//         io.to(roomId).emit('battle:roomClosed', { reason: 'creator_disconnected' });
//       }

//       socket.leave(roomId);
//     } catch (error) {
//       console.error('Disconnect handler error:', error);
//     }
//   });
// };













const Battle  = require('../models/Battle');
const Problem = require('../models/problems');
const User    = require('../models/User');
const { assignProblem }       = require('../controllers/battleController');
const { calculateNewRatings } = require('../utils/ratingCalculator');

// ══════════════════════════════════════════
// ── Guard: prevent double rating update ──
// ══════════════════════════════════════════
const processedRooms = new Set();

// ══════════════════════════════════════════
// ── Central rating updater ──
// ══════════════════════════════════════════
async function updateRatings(battle, winner) {
  // ── Guard against double-execution ──
  if (processedRooms.has(battle.roomId)) {
    console.log(`[Rating] Already processed room ${battle.roomId}, skipping`);
    return battle.ratingChanges
      ? (() => {
          const rc = battle.ratingChanges;
          return {
            [battle.creator.userhandle]:  rc.creator,
            [battle.opponent.userhandle]: rc.opponent,
          };
        })()
      : null;
  }
  processedRooms.add(battle.roomId);

  // Clean up after 10 minutes
  setTimeout(() => processedRooms.delete(battle.roomId), 10 * 60 * 1000);

  try {
    const cHandle = battle.creator.userhandle;
    const oHandle = battle.opponent.userhandle;

    if (!cHandle || !oHandle) {
      console.warn('[Rating] Missing userhandle(s):', cHandle, oHandle);
      return null;
    }

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

    const cBattles = cUser.battleStats?.totalBattles || 0;
    const oBattles = oUser.battleStats?.totalBattles || 0;

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

    // ✅ FIX: Initialize battleStats properly
    if (!cUser.battleStats) {
      cUser.battleStats = { wins: 0, losses: 0, draws: 0, totalBattles: 0 };
    }
    cUser.battleStats.totalBattles += 1;
    if      (cResult === 'win')  cUser.battleStats.wins   += 1;
    else if (cResult === 'loss') cUser.battleStats.losses += 1;
    else                         cUser.battleStats.draws  += 1;

    // ✅ FIX: Tell Mongoose nested object changed
    cUser.markModified('battleStats');
    cUser.markModified('badge');

    if (!Array.isArray(cUser.ratingHistory)) cUser.ratingHistory = [];
    cUser.ratingHistory.push({
      rating:   ratings.A.newRating,
      delta:    ratings.A.delta,
      opponent: oHandle,
      result:   cResult,
      roomId:   battle.roomId,
      date:     now,
    });
    if (cUser.ratingHistory.length > 50) {
      cUser.ratingHistory = cUser.ratingHistory.slice(-50);
    }
    cUser.markModified('ratingHistory');

    // ── Update opponent ──
    const oResult = result === 'B' ? 'win' : result === 'draw' ? 'draw' : 'loss';
    oUser.rating = ratings.B.newRating;
    oUser.badge  = {
      name:  ratings.B.badge.name,
      emoji: ratings.B.badge.emoji,
      color: ratings.B.badge.color,
    };

    if (!oUser.battleStats) {
      oUser.battleStats = { wins: 0, losses: 0, draws: 0, totalBattles: 0 };
    }
    oUser.battleStats.totalBattles += 1;
    if      (oResult === 'win')  oUser.battleStats.wins   += 1;
    else if (oResult === 'loss') oUser.battleStats.losses += 1;
    else                         oUser.battleStats.draws  += 1;

    oUser.markModified('battleStats');
    oUser.markModified('badge');

    if (!Array.isArray(oUser.ratingHistory)) oUser.ratingHistory = [];
    oUser.ratingHistory.push({
      rating:   ratings.B.newRating,
      delta:    ratings.B.delta,
      opponent: cHandle,
      result:   oResult,
      roomId:   battle.roomId,
      date:     now,
    });
    if (oUser.ratingHistory.length > 50) {
      oUser.ratingHistory = oUser.ratingHistory.slice(-50);
    }
    oUser.markModified('ratingHistory');

    // ✅ Save both users
    await Promise.all([cUser.save(), oUser.save()]);

    // ✅ Store snapshot on Battle document
    battle.ratingChanges = {
      creator: {
        oldRating: ratings.A.oldRating,
        newRating: ratings.A.newRating,
        delta:     ratings.A.delta,
        badge:     ratings.A.badge.name,
      },
      opponent: {
        oldRating: ratings.B.oldRating,
        newRating: ratings.B.newRating,
        delta:     ratings.B.delta,
        badge:     ratings.B.badge.name,
      },
    };
    battle.markModified('ratingChanges');
    await battle.save();

    console.log(
      `[Rating] ✅ ${cHandle}: ${ratings.A.oldRating}→${ratings.A.newRating}` +
      ` (${ratings.A.delta >= 0 ? '+' : ''}${ratings.A.delta}) [${ratings.A.badge.name}] | ` +
      `${oHandle}: ${ratings.B.oldRating}→${ratings.B.newRating}` +
      ` (${ratings.B.delta >= 0 ? '+' : ''}${ratings.B.delta}) [${ratings.B.badge.name}]`
    );

    // Return keyed by userhandle for frontend
    return {
      [cHandle]: {
        oldRating: ratings.A.oldRating,
        newRating: ratings.A.newRating,
        delta:     ratings.A.delta,
        badge:     ratings.A.badge.name,
      },
      [oHandle]: {
        oldRating: ratings.B.oldRating,
        newRating: ratings.B.newRating,
        delta:     ratings.B.delta,
        badge:     ratings.B.badge.name,
      },
    };
  } catch (err) {
    console.error('[Rating] updateRatings failed:', err);
    // Remove from guard so it can retry
    processedRooms.delete(battle.roomId);
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

      if (battle.creator.userhandle === userhandle) {
        battle.creator.socketId = socket.id;
      } else if (battle.opponent.userhandle === userhandle) {
        battle.opponent.socketId = socket.id;
      }
      await battle.save();
      socket.join(roomId);

      // ✅ Fetch fresh ratings for both users
      const [cUser, oUser] = await Promise.all([
        User.findOne(
          { userhandle: battle.creator.userhandle },
          'rating badge battleStats ratingHistory'
        ).lean(),
        User.findOne(
          { userhandle: battle.opponent.userhandle },
          'rating badge battleStats ratingHistory'
        ).lean(),
      ]);

      const defaultBadge = { name: 'Bronze', emoji: '🥉', color: '#cd7f32' };

      io.to(roomId).emit('battle:userJoined', {
        userhandle,
        creator: {
          userhandle:    battle.creator.userhandle,
          isReady:       battle.creator.isReady,
          rating:        cUser?.rating         ?? 0,
          badge:         cUser?.badge          ?? defaultBadge,
          battleStats:   cUser?.battleStats    ?? {},
          ratingHistory: cUser?.ratingHistory  ?? [],
        },
        opponent: {
          userhandle:    battle.opponent.userhandle,
          isReady:       battle.opponent.isReady,
          rating:        oUser?.rating         ?? 0,
          badge:         oUser?.badge          ?? defaultBadge,
          battleStats:   oUser?.battleStats    ?? {},
          ratingHistory: oUser?.ratingHistory  ?? [],
        },
      });

      console.log(`[Socket] ${userhandle} joined room ${roomId}`);
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

      if (battle.creator.userhandle === userhandle) {
        battle.creator.isReady = true;
      } else if (battle.opponent.userhandle === userhandle) {
        battle.opponent.isReady = true;
      }
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
        console.log(`[Socket] Battle started → room=${roomId} problem=${problemPID}`);
      }
    } catch (err) {
      console.error('Battle ready error:', err);
    }
  });

  // ── Player submits ──
  socket.on('battle:submit', async ({ roomId, userhandle, status }) => {
    try {
      roomId = roomId.toUpperCase();

      // ✅ FIX: Always fetch fresh battle from DB
      const battle = await Battle.findOne({ roomId });
      if (!battle || battle.status !== 'ongoing') return;

      const submissionTime = Date.now() - new Date(battle.startTime).getTime();
      const isCreator = battle.creator.userhandle === userhandle;

      if (isCreator) {
        battle.creator.hasSubmitted   = true;
        battle.creator.submissionTime = submissionTime;
        battle.creator.status         = status;
      } else if (battle.opponent.userhandle === userhandle) {
        battle.opponent.hasSubmitted   = true;
        battle.opponent.submissionTime = submissionTime;
        battle.opponent.status         = status;
      } else {
        return; // Unknown user
      }

      // Notify room that someone submitted
      io.to(roomId).emit('battle:opponentSubmitted', { userhandle, status });

      // ✅ FIX: If Accepted → end battle immediately
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
        console.log(`[Socket] Battle ${roomId} won by ${userhandle}`);
        return;
      }

      // ✅ FIX: Check if BOTH submitted (both wrong) → draw
      const bothSubmitted =
        battle.creator.hasSubmitted && battle.opponent.hasSubmitted;

      if (bothSubmitted) {
        const cAC = battle.creator.status  === 'Accepted';
        const oAC = battle.opponent.status === 'Accepted';

        let winner = 'draw';
        if      (cAC && !oAC) winner = battle.creator.userhandle;
        else if (!cAC && oAC) winner = battle.opponent.userhandle;
        // both wrong → draw, both AC → faster wins
        else if (cAC && oAC) {
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
          reason:         'both_submitted',
          creatorStatus:  battle.creator.status,
          opponentStatus: battle.opponent.status,
          ratingChanges,
        });
        console.log(`[Socket] Battle ${roomId} ended: both submitted. Winner: ${winner}`);
        return;
      }

      // Only one has submitted so far — just save
      await battle.save();
    } catch (err) {
      console.error('Battle submit error:', err);
    }
  });

  // ── Timeout ──
  socket.on('battle:timeout', async ({ roomId }) => {
    try {
      roomId = roomId.toUpperCase();

      // ✅ FIX: Fresh fetch
      const battle = await Battle.findOne({ roomId });
      if (!battle || battle.status !== 'ongoing') return;

      const cAC = battle.creator.status  === 'Accepted';
      const oAC = battle.opponent.status === 'Accepted';

      let winner = 'draw';
      if      (cAC && !oAC) winner = battle.creator.userhandle;
      else if (!cAC && oAC) winner = battle.opponent.userhandle;
      else if (cAC && oAC) {
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
      console.log(`[Socket] Battle ${roomId} timed out. Winner: ${winner}`);
    } catch (err) {
      console.error('Battle timeout error:', err);
    }
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
        console.log(`[Socket] Battle ${roomId}: ${userhandle} left. Winner: ${winner}`);

      } else if (battle.status === 'waiting' || battle.status === 'ready') {
        await Battle.deleteOne({ roomId });
        io.to(roomId).emit('battle:roomClosed', { reason: 'creator_left' });
      }

      socket.leave(roomId);
    } catch (err) {
      console.error('Battle leave error:', err);
    }
  });

  // ── Chat ──
  socket.on('battle:chat', ({ roomId, userhandle, message }) => {
    io.to(roomId?.toUpperCase()).emit('battle:chatMessage', {
      userhandle,
      message,
      timestamp: new Date(),
    });
  });

  // ── Disconnect ──
  socket.on('disconnect', async () => {
    try {
      const battle = await Battle.findOne({
        status: { $in: ['waiting', 'ready', 'ongoing'] },
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
        console.log(`[Socket] Battle ${roomId}: ${userhandle} disconnected. Winner: ${winner}`);

      } else if (battle.status === 'waiting') {
        await Battle.deleteOne({ roomId });
        io.to(roomId).emit('battle:roomClosed', { reason: 'creator_disconnected' });
      }

      socket.leave(roomId);
    } catch (err) {
      console.error('Disconnect handler error:', err);
    }
  });
};