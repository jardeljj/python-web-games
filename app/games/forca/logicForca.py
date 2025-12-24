import random

class JogoDaForca:
    def __init__(self, palavras, max_erros=6):
        self.palavra = random.choice(palavras).upper()
        self.max_erros = max_erros
        self.letras_corretas = set()
        self.letras_erradas = set()

    def tentar_letra(self, letra):
        letra = letra.upper()

        if letra in self.letras_corretas or letra in self.letras_erradas:
            return "repetida"

        if letra in self.palavra:
            self.letras_corretas.add(letra)
            return "correta"
        else:
            self.letras_erradas.add(letra)
            return "errada"

    def palavra_mostrada(self):
        return " ".join(
            letra if letra in self.letras_corretas else "_"
            for letra in self.palavra
        )

    def tentativas_restantes(self):
        return self.max_erros - len(self.letras_erradas)

    def venceu(self):
        return all(letra in self.letras_corretas for letra in self.palavra)

    def perdeu(self):
        return self.tentativas_restantes() <= 0
