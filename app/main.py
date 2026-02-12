from flask import Flask,render_template
from app.games.forca.routes import forca_bp

app = Flask(__name__)
app.register_blueprint(forca_bp)

@app.route("/")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)
