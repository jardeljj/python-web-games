import random
from flask import Blueprint, jsonify, request,render_template

forca_bp = Blueprint("forca", __name__, url_prefix="/forca")

@forca_bp.route("/")
def forca_page():
    return render_template("forca.html")

# Cache simples em memória (por usuário depois)
jogo_cache = {}

PALAVRAS = [
    "PYTHON",
    "JAVASCRIPT",
    "FORCA",
    "DESENVOLVIMENTO",
    "PROGRAMACAO"
]

@forca_bp.route("/start", methods=["GET"])
def start_game():
    palavra = random.choice(PALAVRAS)

    jogo_cache["jogo"] = {
        "palavra": palavra,
        "palavra_mostrada": ["_"] * len(palavra),
        "tentativas": 6,
        "letras_erradas": [],
        "letras_corretas": []
    }

    return jsonify(jogo_cache["jogo"])


@forca_bp.route("/guess", methods=["POST"])
def guess_letter():
    data = request.get_json()
    letra = data.get("letra", "").upper()

    jogo = jogo_cache.get("jogo")
    if not jogo or not letra:
        return jsonify(jogo), 400

    if letra in jogo["letras_corretas"] or letra in jogo["letras_erradas"]:
        return jsonify(jogo)

    if letra in jogo["palavra"]:
        jogo["letras_corretas"].append(letra)
        for i, l in enumerate(jogo["palavra"]):
            if l == letra:
                jogo["palavra_mostrada"][i] = letra
    else:
        jogo["letras_erradas"].append(letra)
        jogo["tentativas"] -= 1

    return jsonify(jogo)
