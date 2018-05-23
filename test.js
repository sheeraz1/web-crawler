const Chess = require('chess.js').Chess;

const fen = '8/3k4/p2b1Bp1/2p3P1/1pP3P1/1P2K3/P3R3/3r3q b - - 9 49';

const chess = new Chess(fen);
console.log(chess.ascii());