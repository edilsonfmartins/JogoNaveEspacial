const botaoIniciar = document.getElementById("iniciar");
const cenario = document.getElementById("cenario");
const nave = document.getElementById("nave");
const vida = document.getElementById("vida");
const pontos = document.getElementById("pontos");
const audioJogo = new Audio("audios/missaoespaco.mp3");

const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

const larguraNave = nave.offsetWidth;
const alturaNave = nave.offsetHeight;

const velocidadeNave = 10;
const velocidadeTiro = 5; // Aumenta a velocidade do tiro
const velocidadeNaveInimigas = 10;

let estaAtirando = false;
let tiroAtual = 0;
let vidaAtual = 100;
let pontosAtual = 0;

let posicaoHorizontal = larguraCenario / 2 - larguraNave / 2;
let posicaoVertical = alturaCenario - alturaNave;
let direcaoHorizontal = 0;

const teclaPressionada = (tecla) => {
  if (tecla.key === "ArrowRight") {
    direcaoHorizontal = 1;
  } else if (tecla.key === "ArrowLeft") {
    direcaoHorizontal = -1;
  }
}

const teclaSolta = (tecla) => {
  if (tecla.key === "ArrowRight" || tecla.key === "ArrowLeft") {
    direcaoHorizontal = 0;
  }
}

const moveNave = () => {
  posicaoHorizontal += direcaoHorizontal * velocidadeNave;
  if (posicaoHorizontal < 0) {
    posicaoHorizontal = 0;
  } else if (posicaoHorizontal + larguraNave > larguraCenario) {
    posicaoHorizontal = larguraCenario - larguraNave;
  }
  nave.style.left = posicaoHorizontal + "px";
  nave.style.top = posicaoVertical + "px";
}

const atirar = () => {
  const delayTiro = Date.now();
  const atrasoTiro = delayTiro - tiroAtual;

  if (estaAtirando && atrasoTiro >= 500) {
    tiroAtual = Date.now();
    criaTiros(posicaoHorizontal + larguraNave / 2 - 5, posicaoVertical - 10);
  }
}

document.addEventListener("keydown", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = true;
  } else {
    teclaPressionada(tecla);
  }
});

document.addEventListener("keyup", (tecla) => {
  if (tecla.key === " ") {
    estaAtirando = false;
  } else {
    teclaSolta(tecla);
  }
})

const criaTiros = (posicaoLeftTiro, posicaoTopTiro) => {
  const tiro = document.createElement("div");
  tiro.className = "tiro";
  tiro.style.position = "absolute";
  tiro.style.width = "10px";
  tiro.style.height = "20px";
  tiro.style.backgroundColor = "red";
  tiro.style.left = posicaoLeftTiro + "px";
  tiro.style.top = posicaoTopTiro + "px";
  cenario.appendChild(tiro);
}

const moveTiros = () => {
  const tiros = document.querySelectorAll(".tiro");
  tiros.forEach((tiro) => {
    let posicaoTopTiro = tiro.offsetTop;
    posicaoTopTiro -= velocidadeTiro;
    tiro.style.top = posicaoTopTiro + "px";
    if (posicaoTopTiro < -10) {
      tiro.remove();
    }
  });
}

const naveInimigas = () => {
  const inimigo = document.createElement("div");
  inimigo.className = "inimigo";
  inimigo.style.position = "absolute";
  inimigo.setAttribute("data-vida", 1);
  inimigo.style.width = "100px";
  inimigo.style.height = "100px";
  inimigo.style.backgroundImage = "url('imagens/inimigo.gif')";
  inimigo.style.backgroundPosition = "center";
  inimigo.style.backgroundRepeat = "no-repeat";
  inimigo.style.backgroundSize = "contain";
  inimigo.style.left = Math.floor(Math.random() * (larguraCenario - 100)) + "px";
  inimigo.style.top = "-100px";
  cenario.appendChild(inimigo);
}

const moveNaveInimigas = () => {
  const navesInimigas = document.querySelectorAll(".inimigo");
  navesInimigas.forEach((inimigo) => {
    let posicaoTopNaveInimiga = inimigo.offsetTop;
    posicaoTopNaveInimiga += velocidadeNaveInimigas;
    inimigo.style.top = posicaoTopNaveInimiga + "px";
    if (posicaoTopNaveInimiga > alturaCenario) {
      inimigo.remove();
    }
  });
}

const colisao = () => {
  const todasNavesInimigas = document.querySelectorAll(".inimigo");
  const todosTiros = document.querySelectorAll(".tiro");
  todasNavesInimigas.forEach((naveInimiga) => {
    todosTiros.forEach((tiro) => {
      const colisaoNaveInimiga = naveInimiga.getBoundingClientRect();
      const colisaoTiro = tiro.getBoundingClientRect();
      const posicaoNaveInimigaLeft = naveInimiga.offsetLeft;
      const posicaoNaveInimigaTop = naveInimiga.offsetTop;
      let vidaAtualNaveInimiga = parseInt(naveInimiga.getAttribute("data-vida"));
      if (
        colisaoNaveInimiga.left < colisaoTiro.right &&
        colisaoNaveInimiga.right > colisaoTiro.left &&
        colisaoNaveInimiga.top < colisaoTiro.bottom &&
        colisaoNaveInimiga.bottom > colisaoTiro.top
      ) {
        vidaAtualNaveInimiga--;
        tiro.remove();
        if (vidaAtualNaveInimiga === 0) {
          pontosAtual += 10;
          pontos.textContent = `Pontos: ${pontosAtual}`;
          naveInimiga.remove();
          naveInimigaDestruida(posicaoNaveInimigaLeft, posicaoNaveInimigaTop);
        } else {
          naveInimiga.setAttribute("data-vida", vidaAtualNaveInimiga);
        }
      }
    });
  });
  verificarColisaoNave();
}

const verificarColisaoNave = () => {
  const navesInimigas = document.querySelectorAll(".inimigo");
  navesInimigas.forEach((inimigo) => {
    const colisaoNaveInimiga = inimigo.getBoundingClientRect();
    const colisaoNave = nave.getBoundingClientRect();
    if (
      colisaoNaveInimiga.left < colisaoNave.right &&
      colisaoNaveInimiga.right > colisaoNave.left &&
      colisaoNaveInimiga.top < colisaoNave.bottom &&
      colisaoNaveInimiga.bottom > colisaoNave.top
    ) {
      vidaAtual -= 10; // Dano que a nave recebe ao colidir com um inimigo
      vida.textContent = `Vida: ${vidaAtual}`;
      inimigo.remove();
      if (vidaAtual <= 0) {
        gameOver();
      }
    }
  });
}

const naveInimigaDestruida = (posicaoLeft, posicaoTop) => {
  const explosao = document.createElement("div");
  explosao.className = "explosao";
  explosao.style.position = "absolute";
  explosao.style.width = "100px";
  explosao.style.height = "100px";
  explosao.style.backgroundImage = "url('imagens/explosao.gif')";
  explosao.style.backgroundPosition = "center";
  explosao.style.backgroundRepeat = "no-repeat";
  explosao.style.backgroundSize = "contain";
  explosao.style.left = posicaoLeft + "px";
  explosao.style.top = posicaoTop + "px";
  cenario.appendChild(explosao);
  setTimeout(() => explosao.remove(), 500);
}

const gameOver = () => {
  audioJogo.pause();
  audioJogo.currentTime = 0; // Reinicia o áudio
  alert("Game Over");
  window.location.reload();
}

const iniciarJogo = () => {
  audioJogo.play().catch(error => {
    console.error("Erro ao reproduzir o áudio: ", error);
    alert("Não foi possível reproduzir o áudio. Verifique suas configurações de som.");
  });
  botaoIniciar.style.display = "none";
  setInterval(moveNave, 20);
  setInterval(atirar, 15);
  setInterval(moveTiros, 15);
  setInterval(moveNaveInimigas, 100);
  setInterval(naveInimigas, 3000);
  setInterval(colisao, 10);
}

botaoIniciar.addEventListener("click", iniciarJogo);
