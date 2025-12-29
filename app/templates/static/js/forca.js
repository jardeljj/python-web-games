let gameId = null;

async function iniciarJogo() {
    const res = await fetch("/forca/start", { method: "POST" });
    const data = await res.json();

    gameId = data.game_id;
    atualizarTela(data);
}

async function enviarLetra() {
    const input = document.getElementById("letra");
    const letra = input.value;
    input.value = "";

    const res = await fetch("/forca/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameId, letra })
    });

    const data = await res.json();
    atualizarTela(data);
}

function atualizarTela(data) {
    document.getElementById("palavra").innerText = data.palavra;
    document.getElementById("tentativas").innerText = data.tentativas;
    document.getElementById("erradas").innerText = data.letras_erradas.join(" ");
}
// ===============================
// Estado do jogo (temporário)
// ===============================
let jogo = {
    palavra: "PYTHON",
    palavraMostrada: ["_", "_", "_", "_", "_", "_"],
    tentativas: 6,
    letrasErradas: [],
    letrasCorretas: []
};

// ===============================
// Inicialização
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    atualizarTela();

    document
        .getElementById("btn-enviar")
        .addEventListener("click", enviarLetra);

    document
        .getElementById("btn-reiniciar")
        .addEventListener("click", iniciarJogo);
});

// ===============================
// Funções principais
// ===============================
function iniciarJogo() {
    jogo = {
        palavra: "PYTHON", // depois vem do backend
        palavraMostrada: ["_", "_", "_", "_", "_", "_"],
        tentativas: 6,
        letrasErradas: [],
        letrasCorretas: []
    };

    setMensagem("");
    atualizarTela();
}

function enviarLetra() {
    const input = document.getElementById("letra");
    let letra = input.value.toUpperCase();
    input.value = "";

    if (!letra || jogo.tentativas <= 0) return;
    if (jogo.letrasCorretas.includes(letra) || jogo.letrasErradas.includes(letra)) {
        setMensagem("Letra já utilizada", "text-warning");
        return;
    }

    if (jogo.palavra.includes(letra)) {
        jogo.letrasCorretas.push(letra);
        revelarLetra(letra);
    } else {
        jogo.letrasErradas.push(letra);
        jogo.tentativas--;
    }

    verificarEstado();
    atualizarTela();
}

// ===============================
// Funções auxiliares
// ===============================
function revelarLetra(letra) {
    jogo.palavra.split("").forEach((l, i) => {
        if (l === letra) {
            jogo.palavraMostrada[i] = letra;
        }
    });
}

function verificarEstado() {
    if (!jogo.palavraMostrada.includes("_")) {
        setMensagem("🎉 Você venceu!", "text-success");
        desativarEntrada();
    } else if (jogo.tentativas <= 0) {
        setMensagem(`💀 Você perdeu! Palavra: ${jogo.palavra}`, "text-danger");
        desativarEntrada();
    }
}

function atualizarTela() {
    document.getElementById("palavra").innerText =
        jogo.palavraMostrada.join(" ");

    document.getElementById("tentativas").innerText =
        jogo.tentativas;

    document.getElementById("erradas").innerText =
        jogo.letrasErradas.length > 0
            ? jogo.letrasErradas.join(" • ")
            : "—";
}

function setMensagem(texto, classe = "") {
    const el = document.getElementById("mensagem");
    el.className = classe;
    el.innerText = texto;
}

function desativarEntrada() {
    document.getElementById("btn-enviar").disabled = true;
    document.getElementById("letra").disabled = true;
}
