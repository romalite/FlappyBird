const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = 256;
canvas.height = 512;

// Загрузка изображений
const images = {
  bird: loadImage("img/bird.png"),
  back: loadImage("img/backgroundImage.png"),
  road: loadImage("img/groundImage.png"),
  pipeUp: loadImage("img/pipeUp.png"),
  pipeBottom: loadImage("img/pipeBottom.png")
};

// Загрузка аудио
const audio = {
  fly: new Audio("audio/fly.mp3"),
  score: new Audio("audio/score.mp3")
};

const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("best_score");

let xPos = 10;
let yPos = 150;
let gravity = 0.2;
let velY = 0;
const gap = 110;

let pipes = [createPipe()];
let score = 0;
let bestScore = 0;

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function createPipe() {
  return {
    x: canvas.width,
    y: Math.floor(Math.random() * images.pipeUp.height) - images.pipeUp.height,
  };
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
  context.drawImage(images.back, 0, 0);
  context.drawImage(images.bird, xPos, yPos);

  if (yPos + images.bird.height >= canvas.height - images.road.height) {
    restart();
  }

  velY += gravity;
  yPos += velY;

  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipe = pipes[i];

    // Удаляем трубу, если она полностью вышла за пределы экрана
    if (pipe.x + images.pipeUp.width < 0) {
      pipes.splice(i, 1);
      continue;
    }

    // Рисуем трубы
    context.drawImage(images.pipeUp, pipe.x, pipe.y);
    context.drawImage(images.pipeBottom, pipe.x, pipe.y + images.pipeUp.height + gap);

    pipe.x -= 2;

    // Добавляем новую трубу, если текущая достигла определенной позиции
    if (pipe.x === 80) {
      pipes.push(createPipe());
    }

    // Проверка столкновений
    if (
      xPos + images.bird.width >= pipe.x &&
      xPos <= pipe.x + images.pipeUp.width &&
      (yPos <= pipe.y + images.pipeUp.height ||
        yPos + images.bird.height >= pipe.y + images.pipeUp.height + gap)
    ) {
      restart();
    }

    // Увеличение счета, если труба пройдена
    if (pipe.x === 0) {
      score++;
      audio.score.play();
    }
  }

  // Рисуем дорогу
  context.drawImage(images.road, 0, canvas.height - images.road.height);

  // Обновляем текст счета
  scoreText.innerHTML = `SCORE: ${score}`;
  bestScoreText.innerHTML = `BEST_SCORE: ${bestScore}`;
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    moveUp();
  }
});

function moveUp() {
  velY = -4;
  audio.fly.play();
}

function restart() {
  if (score > bestScore) {
    bestScore = score;
  }
  score = 0;
  xPos = 10;
  yPos = 150;
  velY = 0;
  pipes = [createPipe()];
}

setInterval(draw, 20);