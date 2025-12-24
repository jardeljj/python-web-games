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
