/* Establezco variables */
let Partida = 1;
let Jugada = 1;
let ganador = "";
let Jugador = "X";

let jugadores = [
  { nombre: "X", victorias: 0, jugadas: [] },
  { nombre: "O", victorias: 0, jugadas: [] },
];

/* Objetos HTML */
const estado = document.getElementById("estado");
const partida = document.getElementById("partida");
const ganadasX = document.getElementById("ganadasX");
const ganadasO = document.getElementById("ganadasO");

/* Togle de jugador */
cambiarJugador = () => (Jugador == "X" ? (Jugador = "O") : (Jugador = "X"));

/* Declarao un ganador */
const declararGanador = (ganador) => {
  estado.innerHTML = `GANÓ ${ganador}`;
  estado.classList.add("ganador");
  setTimeout(function () {
    estado.classList.remove("ganador");
  }, 2500);

  if (ganador == jugadores[0].nombre) {
    jugadores[0].victorias = jugadores[0].victorias + 1;
  } else if (ganador == jugadores[1].nombre) {
    jugadores[1].victorias = jugadores[1].victorias + 1;
  }
  // Actualizo puntajes
  ganadasX.innerHTML = jugadores[0].victorias;
  ganadasO.innerHTML = jugadores[1].victorias;
  // Bloqueo botones
  for (let i = 1; i <= 9; i++) {
    document.getElementById(`boton${i}`).disabled = true;
  }
};

/* Declaro un empate */
const declararEmpate = () => {
  document.getElementById("botonSugerir").disabled = true;
  estado.innerHTML = `¡ESTO ES UN EMPATE!`;
};

/* Verifico jugadas ganadoras y empate*/
const verificaGanador = () => {
  for (jugador of jugadores) {
    /* Horizontales */
    if (
      jugador.jugadas.includes(1) &&
      jugador.jugadas.includes(2) &&
      jugador.jugadas.includes(3)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
    if (
      jugador.jugadas.includes(4) &&
      jugador.jugadas.includes(5) &&
      jugador.jugadas.includes(6)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
    if (
      jugador.jugadas.includes(7) &&
      jugador.jugadas.includes(8) &&
      jugador.jugadas.includes(9)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
    /* Verticales */
    if (
      jugador.jugadas.includes(1) &&
      jugador.jugadas.includes(4) &&
      jugador.jugadas.includes(7)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
    if (
      jugador.jugadas.includes(2) &&
      jugador.jugadas.includes(5) &&
      jugador.jugadas.includes(8)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
    if (
      jugador.jugadas.includes(3) &&
      jugador.jugadas.includes(6) &&
      jugador.jugadas.includes(9)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }

    /* Diagonales */
    if (
      jugador.jugadas.includes(1) &&
      jugador.jugadas.includes(5) &&
      jugador.jugadas.includes(9)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
    if (
      jugador.jugadas.includes(3) &&
      jugador.jugadas.includes(5) &&
      jugador.jugadas.includes(7)
    ) {
      ganador = jugador.nombre;
      declararGanador(ganador);
    }
  }

  /* Empate */
  if (Jugada == 9 && ganador === "") {
    declararEmpate();
  }
};

/* Logica principal del juego */
const juega = (id) => {
  document.getElementById(
    "jugadas"
  ).innerHTML = `Jugó ${Jugador} en boton ${id} `;
  const botonJugado = document.getElementById(`boton${id}`);
  botonJugado.disabled = true;
  botonJugado.innerHTML = `${Jugador}`;
  if (Jugador == "X") {
    jugadores[0].jugadas.push(id);
    armarJugada("X", id);
  } else if (Jugador == "O") {
    jugadores[1].jugadas.push(id);
    armarJugada("O", id);
  }
  cambiarJugador();
  estado.innerHTML = `Ahora juega ${Jugador}`;
  verificaGanador();
  Jugada++;
  //console.log(Jugada);
  fetchRespuestas();
};

/* Reseteo la partida */
const resetear = () => {
  Partida++;
  jugadores[0].jugadas = [];
  jugadores[1].jugadas = [];
  Jugador = "X";
  ganador = "";
  jugadaAPI = "---------";
  document.getElementById("botonSugerir").disabled = false;
  Jugada = 1;
  for (let i = 1; i <= 9; i++) {
    document.getElementById(`boton${i}`).innerHTML = "";
    document.getElementById(`boton${i}`).disabled = false;
  }
  estado.innerHTML = `Ahora juega ${Jugador}`;
  partida.innerHTML = `${Partida}`;
  document.getElementById("jugadas").innerHTML = ``;
  fetchRespuestas();
};

/* Cargo los botones y los listener*/
function cargarBotones() {
  for (let i = 1; i <= 9; i++) {
    document
      .getElementById(`boton${i}`)
      .addEventListener("click", () => juega(i));
  }
  document
    .getElementById("botonReset")
    .addEventListener("click", () => resetear());
  document
    .getElementById("botonSugerir")
    .addEventListener("click", () => sugerirJugada());
}

/* API */
var jugadaAPI = "---------";
function armarJugada(jugador, jugada) {
  console.log(`Jugador: ${jugador}`);
  console.log(`Jugada: ${jugada}`);
  String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) {
      return this.valueOf();
    }
    return this.substring(0, index) + replacement + this.substring(index + 1);
  };

  jugadaAPI = jugadaAPI.replaceAt(jugada - 1, jugador);
  console.log(jugadaAPI);
}
async function fetchRespuestas() {
  fetch(
    `https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/${jugadaAPI}/${Jugador}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "0c640c5766msh80fa95c617e616ep103901jsn05c8e3139f6d",
        "x-rapidapi-host": "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com",
      },
    }
  )
    .then((response) => {
      console.log(response);
      const traeRespuesta = async () => {
        const respuesta = await response.json();
        console.log(respuesta);
        console.log(respuesta.game);
        jugadaSugerida = respuesta.recommendation;
      };
      traeRespuesta();
    })
    .catch((err) => {
      console.error(err);
    });
}
function sugerirJugada() {
  document.getElementById(`boton${jugadaSugerida + 1}`).click();
}
/* */
const start = async () => {
  cargarBotones();
  partida.innerHTML = `${Partida}`;
  respuestas = await fetchRespuestas();
};

window.onload = start;
