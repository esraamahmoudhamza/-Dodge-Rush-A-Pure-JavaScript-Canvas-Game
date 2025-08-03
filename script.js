const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 70,
  radius: 20,
  speed: 6,
  dx: 0,
};

let obstacles = [];
let frameCount = 0;
let score = 0;
let gameOver = false;

function drawPlayer() {
  // Purple glow effect
  const gradient = ctx.createRadialGradient(player.x, player.y, player.radius / 2, player.x, player.y, player.radius * 2);
  gradient.addColorStop(0, 'rgba(106, 13, 173, 0.9)');
  gradient.addColorStop(1, 'rgba(106, 13, 173, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius * 2, 0, Math.PI * 2);
  ctx.fill();

  // Player circle
  ctx.fillStyle = '#6a0dad';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner glow
  ctx.strokeStyle = '#cdb4db';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius - 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawObstacle(obs) {
  ctx.fillStyle = '#4b0082';
  ctx.shadowColor = '#7f00ff';
  ctx.shadowBlur = 8;
  ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  ctx.shadowBlur = 0; // reset shadow
}

function updateObstacles() {
  for(let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += obstacles[i].speed;
    if(obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score += 10;
      updateScore();
    } else if (collisionCircleRect(player, obstacles[i])) {
      gameOver = true;
    }
  }

  if(frameCount % 60 === 0) {
    const width = Math.random() * 100 + 30;
    const x = Math.random() * (canvas.width - width);
    obstacles.push({
      x,
      y: -30,
      width,
      height: 20,
      speed: 3 + score/100
    });
  }
}

// Circle-Rectangle collision detection
function collisionCircleRect(circle, rect) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > (rect.width / 2 + circle.radius)) { return false; }
  if (distY > (rect.height / 2 + circle.radius)) { return false; }

  if (distX <= (rect.width / 2)) { return true; } 
  if (distY <= (rect.height / 2)) { return true; }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateScore() {
  document.getElementById('score').textContent = 'Distance: ' + score;
}

function movePlayer() {
  player.x += player.dx;
  if(player.x - player.radius < 0) player.x = player.radius;
  if(player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
}

function gameLoop() {
  if(gameOver) {
    ctx.fillStyle = '#cdb4db';
    ctx.font = '48px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
    ctx.font = '20px Segoe UI';
    ctx.fillText('Refresh to play again', canvas.width/2, canvas.height/2 + 40);
    return;
  }

  clear();
  drawPlayer();
  updateObstacles();
  obstacles.forEach(drawObstacle);
  movePlayer();

  frameCount++;
  requestAnimationFrame(gameLoop);
}

// Keyboard controls
function keyDown(e) {
  if(e.key === 'ArrowLeft' || e.key === 'a') {
    player.dx = -player.speed;
  } else if(e.key === 'ArrowRight' || e.key === 'd') {
    player.dx = player.speed;
  }
}

function keyUp(e) {
  if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
    player.dx = 0;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start game
updateScore();
gameLoop();
