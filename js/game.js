const svg = document.getElementById("game-canvas");
const path = document.getElementById("heartPath");
const timerEl = document.getElementById("timer");
const successScreen = document.getElementById("success-screen");
const failScreen = document.getElementById("fail-screen");
const rewardCodeEl = document.getElementById("reward-code");

let drawing = false;
let points = [];
let timer = 30;
let countdown;

function getSVGPoint(event) {
  const pt = svg.createSVGPoint();
  if (event.touches) {
    pt.x = event.touches[0].clientX;
    pt.y = event.touches[0].clientY;
  } else {
    pt.x = event.clientX;
    pt.y = event.clientY;
  }
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function startDraw(e) {
  if (!countdown) startTimer();
  drawing = true;
  points = [];
  e.preventDefault();
}

function draw(e) {
  if (!drawing) return;
  const p = getSVGPoint(e);
  points.push(p);
  drawDot(p.x, p.y);
}

function endDraw() {
    drawing = false;
    clearInterval(countdown);  // Zatrzymaj timer
    checkAccuracy();           // Sprawdź wynik od razu
  }

function drawDot(x, y) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 0.7);
    circle.setAttribute("fill", "#000000"); // Zmieniono na czarny
    svg.appendChild(circle);
  }
  

function checkAccuracy() {
  let pathLength = path.getTotalLength();
  let passed = 0;

  for (let i = 0; i < points.length; i += 5) {
    const userX = points[i].x;
    const userY = points[i].y;

    for (let d = 0; d < pathLength; d += 2) {
      const pos = path.getPointAtLength(d);
      const dx = userX - pos.x;
      const dy = userY - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2) {
        passed++;
        break;
      }
    }
  }

  const score = (passed / (points.length / 5)) * 100;

  
    showSuccess();
  
}

function startTimer() {
  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = `⏱️ ${timer}`;
    if (timer <= 0) {
      clearInterval(countdown);
      endDraw();
      checkAccuracy();
    }
  }, 1000);
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function showSuccess() {
  successScreen.classList.remove("hidden");

}



function restartGame() {
  location.reload();
}

// Obsługa zdarzeń
svg.addEventListener("touchstart", startDraw);
svg.addEventListener("touchmove", draw);
svg.addEventListener("touchend", endDraw);

svg.addEventListener("mousedown", startDraw);
svg.addEventListener("mousemove", draw);
svg.addEventListener("mouseup", endDraw);
