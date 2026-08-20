const SIZE = 15;
const CELL = 30;

let board = [];
let matchId = null;
let myRole = null;
let currentTurn = 'X';
let status = 'waiting';
let socket = null;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

if (!token()) location.href = '/';

function draw() {
  ctx.fillStyle = '#f5deb3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#8b7355';
  ctx.lineWidth = 1;
  for (let i = 0; i <= SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, SIZE * CELL);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(SIZE * CELL, i * CELL);
    ctx.stroke();
  }

  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r]?.[c];
      if (cell) {
        ctx.fillStyle = cell === 'X' ? '#e74c3c' : '#3498db';
        ctx.fillText(cell, c * CELL + CELL / 2, r * CELL + CELL / 2);
      }
    }
  }
}

canvas.addEventListener('click', (e) => {
  if (status !== 'playing' || !matchId || !myRole) return;
  if (currentTurn !== myRole) return alert('Chưa đến lượt bạn!');

  const rect = canvas.getBoundingClientRect();
  const c = Math.floor((e.clientX - rect.left) / CELL);
  const r = Math.floor((e.clientY - rect.top) / CELL);

  socket.emit('move', {
    matchId,
    userId: user().id,
    row: r,
    col: c,
  });
});

function updateMatch(match) {
  board = match.board;
  matchId = match.id;
  status = match.status;
  currentTurn = match.currentTurn;

  const uid = user().id;
  if (match.playerXId === uid) myRole = 'X';
  else if (match.playerOId === uid) myRole = 'O';

  const turnEl = document.getElementById('turn');
  if (match.status === 'waiting') {
    turnEl.textContent = 'Đang chờ đối thủ...';
  } else if (match.winner) {
    turnEl.textContent = match.winner === myRole ? 'Bạn thắng!' : 'Bạn thua!';
  } else if (match.status === 'finished') {
    turnEl.textContent = 'Hòa!';
  } else {
    turnEl.textContent = `Lượt: ${match.currentTurn} | Bạn: ${myRole}`;
  }
  draw();
}

function findMatch() {
  socket.emit('findMatch', { userId: user().id });
}

socket = io('/caro');
socket.on('waiting', (data) => {
  matchId = data.matchId;
  document.getElementById('turn').textContent = 'Đang chờ đối thủ...';
});
socket.on('matchFound', updateMatch);
socket.on('matchState', updateMatch);
socket.on('gameOver', (data) => {
  updateMatch(data.match);
  alert(data.winner ? `Người thắng: ${data.winner}` : 'Hòa!');
});

draw();
