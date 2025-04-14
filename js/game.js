const svg = document.getElementById("game-canvas");
const path = document.getElementById("heartPath");
const result = document.getElementById("result");

let drawing = false;
let points = [];

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
  checkAccuracy();
}

function drawDot(x, y) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 0.7);
  circle.setAttribute("fill", "#d94f30");
  svg.appendChild(circle);
}

function checkAccuracy() {
  let pathLength = path.getTotalLength();
  let passed = 0;

  for (let i = 0; i < points.length; i += 5) {
    const userX = points[i].x;
    const userY = points[i].y;

    // Najbliższy punkt na ścieżce
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

  if (score > 70) {
    result.textContent = `🎉 Sukces! Trafiłeś w ${score.toFixed(0)}% kształtu!`;
  } else {
    result.textContent = `😢 Nie udało się. Trafiłeś tylko w ${score.toFixed(0)}%.`;
  }
}

// Obsługa zdarzeń
svg.addEventListener("touchstart", startDraw);
svg.addEventListener("touchmove", draw);
svg.addEventListener("touchend", endDraw);

svg.addEventListener("mousedown", startDraw);
svg.addEventListener("mousemove", draw);
svg.addEventListener("mouseup", endDraw);
