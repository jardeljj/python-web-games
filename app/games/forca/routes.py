from flask import Blueprint, render_template, request, jsonify
from flask_caching import Cache
from app.games.forca.logic import JogoDaForca
from app.games.forca.words import PALAVRAS
import uuid

forca_bp = Blueprint("forca", __name__)
cache = Cache(config={"CACHE_TYPE": "SimpleCache"})

@forca_bp.record_once
def on_load(state):
    cache.init_app(state.app)

@forca_bp.route("/forca")
def forca_page():
    return render_template("forca.html")

@forca_bp.route("/forca/start", methods=["POST"])
def start_game():
    game_id = str(uuid.uuid4())
    jogo = JogoDaForca(PALAVRAS["medio"])

    cache.set(game_id, jogo, timeout=3600)

    return jsonify({
        "game_id": game_id,
        "palavra": jogo.palavra_mostrada(),
        "tentativas": jogo.tentativas_restantes(),
        "letras_erradas": []
    })

@forca_bp.route("/forca/guess", methods=["POST"])
def guess():
    data = request.json
    game_id = data["game_id"]
    letra = data["letra"]

    jogo = cache.get(game_id)
    if not jogo:
        return jsonify({"error": "Jogo não encontrado"}), 404

    jogo.tentar_letra(letra)
    cache.set(game_id, jogo)

    return jsonify({
        "palavra": jogo.palavra_mostrada(),
        "tentativas": jogo.tentativas_restantes(),
        "letras_erradas": list(jogo.letras_erradas),
        "venceu": jogo.venceu(),
        "perdeu": jogo.perdeu()
    })
