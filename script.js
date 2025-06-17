let game = null;
let selected = null;

const mainMenu   = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const boardEl    = document.getElementById('chessboard');
const turnEl     = document.getElementById('player-turn');
const endModal   = document.getElementById('end-modal');
const endMsg     = document.getElementById('end-message');

document.getElementById('start-btn').onclick   = startGame;
document.getElementById('restart-btn').onclick = restartGame;
document.getElementById('menu-btn').onclick    = () => backToMenu();
document.getElementById('rematch-btn').onclick = () => { closeEnd(); restartGame(); };
document.getElementById('to-menu-btn').onclick = () => { closeEnd(); backToMenu(); };

function startGame() {
  game = new Chess();
  selected = null;
  mainMenu.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  renderBoard();
  updateTurn();
}

function backToMenu() {
  gameScreen.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  closeEnd();
}

function restartGame() {
  game.reset();
  selected = null;
  renderBoard();
  updateTurn();
  closeEnd();
}

function renderBoard() {
  boardEl.innerHTML = '';
  const moves = selected ? game.moves({ square: selected, verbose: true }) : [];
  for (let r = 8; r >= 1; r--) {
    for (let f of ['a','b','c','d','e','f','g','h']) {
      const sq = f + r;
      const cell = document.createElement('div');
      cell.className = 'cell ' + (((f.charCodeAt(0) + r) % 2) ? 'white' : 'black');
      const piece = game.get(sq);
      if (piece) {
        const symbols = { p:'♟', r:'♜', n:'♞', b:'♝', q:'♛', k:'♚' };
        const span = document.createElement('span');
        span.className = 'piece ' + (piece.color === 'w' ? 'w-piece' : 'b-piece');
        span.textContent = symbols[piece.type];
        cell.appendChild(span);
      }
      if (moves.some(m => m.to === sq)) cell.classList.add('highlight');
      cell.onclick = () => onCellClick(sq);
      boardEl.appendChild(cell);
    }
  }
}

function onCellClick(sq) {
  if (game.game_over()) return;
  const piece = game.get(sq);
  if (selected && game.move({ from: selected, to: sq, promotion: 'q' })) {
    selected = null;
    renderBoard();
    updateTurn();
    checkEnd();
  } else if (piece && piece.color === game.turn()) {
    selected = sq;
    renderBoard();
  }
}

function updateTurn() {
  turnEl.textContent = `Turno: ${game.turn() === 'w' ? 'Blancas' : 'Negras'}`;
}

function checkEnd() {
  if (game.in_checkmate()) {
    endMsg.textContent = `¡Jaque mate! Ganó ${game.turn() === 'w' ? 'Negras' : 'Blancas'}`;
    openEnd();
  } else if (
    game.in_draw() ||
    game.in_stalemate() ||
    game.insufficient_material()
  ) {
    endMsg.textContent = 'Tablas';
    openEnd();
  }
}

function openEnd()  { endModal.classList.remove('hidden-modal'); }
function closeEnd() { endModal.classList.add('hidden-modal'); }
