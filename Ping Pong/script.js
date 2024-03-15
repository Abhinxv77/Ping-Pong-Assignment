document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const restartBtn = document.getElementById("restart-btn");
  const messageModal = document.getElementById("message-modal");
  const messageModalClose = document.getElementById("message-modal-close");
  const messageText = document.getElementById("message");
  const resumeBtn = document.getElementById("resume-btn");

  let animationId;
  let gameRunning = false;

  const ballRadius = 10;
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ballSpeedX = 5;
  let ballSpeedY = 5;

  const paddleHeight = 80;
  const paddleWidth = 10;
  let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  const paddleSpeed = 5; // Adjust AI paddle speed here

  let leftPlayerScore = 0;
  let rightPlayerScore = 0;
  const maxScore = 10;

  let upPressed = false;
  let downPressed = false;
  let wPressed = false;
  let sPressed = false;

  startBtn.addEventListener("click", function() {
    if (!gameRunning) {
      gameRunning = true;
      loop();
    }
  });

  pauseBtn.addEventListener("click", function() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
  });

  restartBtn.addEventListener("click", function() {
    document.location.reload();
  });

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(e) {
    if (e.key === "ArrowUp") {
      upPressed = true;
    } else if (e.key === "ArrowDown") {
      downPressed = true;
    } else if (e.key === "w") {
      wPressed = true;
    } else if (e.key === "s") {
      sPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === "ArrowUp") {
      upPressed = false;
    } else if (e.key === "ArrowDown") {
      downPressed = false;
    } else if (e.key === "w") {
      wPressed = false;
    } else if (e.key === "s") {
      sPressed = false;
    }
  }

  function update() {
    if (upPressed && rightPaddleY > 0) {
      rightPaddleY -= paddleSpeed;
    } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
      rightPaddleY += paddleSpeed;
    }

    // AI controlled right paddle
    if (ballY > rightPaddleY + paddleHeight / 2) {
      rightPaddleY += paddleSpeed;
    } else {
      rightPaddleY -= paddleSpeed;
    }

    if (wPressed && leftPaddleY > 0) {
      leftPaddleY -= paddleSpeed;
    } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
      leftPaddleY += paddleSpeed;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    if (
      ballX - ballRadius < paddleWidth &&
      ballY > leftPaddleY &&
      ballY < leftPaddleY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (
      ballX + ballRadius > canvas.width - paddleWidth &&
      ballY > rightPaddleY &&
      ballY < rightPaddleY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (ballX < 0) {
      rightPlayerScore++;
      showMessage("AI got a point!");
      reset();
    } else if (ballX > canvas.width) {
      leftPlayerScore++;
      showMessage("User got a point!");
      reset();
    }

    if (leftPlayerScore === maxScore) {
      playerWin("Left player");
    } else if (rightPlayerScore === maxScore) {
      playerWin("Right player");
    }
  }

  function playerWin(player) {
    messageText.textContent = "Congratulations! " + player + " win!";
    messageModal.style.display = "block";
    reset();
  }

  function showMessage(message) {
    messageText.textContent = message;
    messageModal.style.display = "block";
  }

  function reset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.random() * 10 - 5;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff0000"; // Red color for ball
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "#0000ff"; // Blue color for paddles
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    ctx.fillText("Score: " + leftPlayerScore, 10, 20);
    ctx.fillText("Score: " + rightPlayerScore, canvas.width - 70, 20);
  }

  function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  resumeBtn.addEventListener("click", function() {
    messageModal.style.display = "none";
    loop(); // Resume game loop
  });

  messageModalClose.addEventListener("click", function() {
    document.location.reload();
  });
});
