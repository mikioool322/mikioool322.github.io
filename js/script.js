import {loadGLTF} from 'https://cdn.jsdelivr.net/npm/mindar-image-three@0.1.3/examples/loader.js';

const quiz = [
  {
    question: "Które zwierzę ryczy?",
    answers: ["Kot", "Lew", "Mysz"],
    correct: 1
  },
  {
    question: "Ile nóg ma pająk?",
    answers: ["6", "8", "10"],
    correct: 1
  }
];

let currentQuestion = 0;

const startQuiz = () => {
  const q = quiz[currentQuestion];
  document.getElementById("question").textContent = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => {
      if (i === q.correct) {
        alert("Dobrze!");
      } else {
        alert("Spróbuj ponownie!");
      }
      currentQuestion = (currentQuestion + 1) % quiz.length;
      startQuiz();
    };
    answersDiv.appendChild(btn);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/target.mind"
  });

  const {renderer, scene, camera} = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  const model = await loadGLTF("assets/postac.glb");
  model.scene.scale.set(0.5, 0.5, 0.5);
  anchor.group.add(model.scene);

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  startQuiz();
});
