const COLORS = ['', '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
const SIZE = 9;
const CELL = 50;

let grid = [];
let gameId = null;
let selected = null;
let socket = null;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

if (!token()) location.href = '/';

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const x = c * CELL;
      const y = r * CELL;
      ctx.strokeStyle = '#555';
      ctx.strokeRect(x, y, CELL, CELL);

      const color = grid[r]?.[c];
      if (color > 0) {
        const scale = selected?.[0] === r && selected?.[1] === c ? 1.15 : 1;
        const radius = (CELL / 2 - 4) * scale;
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[color];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const c = Math.floor((e.clientX - rect.left) / CELL);
  const r = Math.floor((e.clientY - rect.top) / CELL);
  if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return;

  if (!selected) {
    if (grid[r][c] > 0) selected = [r, c];
  } else {
    const [sr, sc] = selected;
    if (r === sr && c === sc) {
      selected = null;
    } else if (grid[r][c] === 0) {
      socket.emit('move', {
        gameId,
        userId: user().id,
        fromRow: sr,
        fromCol: sc,
        toRow: r,
        toCol: c,
      });
      selected = null;
    } else if (grid[r][c] > 0) {
      selected = [r, c];
    }
  }
  draw();
});

function updateState(game) {
  grid = game.grid;
  gameId = game.id;
  document.getElementById('score').textContent = `Score: ${game.score}`;
  document.getElementById('status').textContent =
    game.status === 'game_over' ? 'Game Over!' : '';
  draw();
}

async function newGame() {
  const game = await api('/line98', { method: 'POST' });
  updateState(game);
  socket.emit('joinGame', { gameId: game.id, userId: user().id });
}

function getHint() {
  if (gameId) socket.emit('hint', { gameId, userId: user().id });
}

socket = io('/line98');
socket.on('gameState', updateState);
socket.on('hint', (hint) => {
  if (hint) {
    selected = [hint.fromRow, hint.fromCol];
    draw();
    alert(`Gợi ý: di chuyển (${hint.fromRow},${hint.fromCol}) → (${hint.toRow},${hint.toCol})`);
  } else {
    alert('Không còn nước đi hợp lệ');
  }
});

newGame();
