import { Component } from '@angular/core';
import { NgForOf, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Letra {
  char: string;
  status: 'correta' | 'presente' | 'ausente' | 'vazio';
}

@Component({
  selector: 'app-meu-componente',
  imports: [NgForOf, NgClass, NgIf, FormsModule],
  templateUrl: './meu-componente.component.html',
  styleUrl: './meu-componente.component.css'
})
export class MeuComponenteComponent {
  tentativas: Letra[][] = [];
  palavraSecreta: string = 'CASAS';
  linhaAtual: number = 0;
  palavraDigitada: string = '';
  jogoFinalizado: boolean = false;
  mensagem: string = '';

  constructor() {
    for (let i = 0; i < 6; i++) {
      this.tentativas.push([
        { char: '', status: 'vazio' },
        { char: '', status: 'vazio' },
        { char: '', status: 'vazio' },
        { char: '', status: 'vazio' },
        { char: '', status: 'vazio' }
      ]);
    }
  }

  enviarTentativa() {
    if (this.jogoFinalizado) {
      return;
    }

    if (this.palavraDigitada.length !== 5) {
      this.mensagem = 'A palavra deve ter 5 letras!';
      return;
    }

    if (this.linhaAtual >= 6) {
      return;
    }

    const palavraUpper = this.palavraDigitada.toUpperCase();
    const letrasSecretas = this.palavraSecreta.split('');
    const letrasDigitadas = palavraUpper.split('');

    for (let i = 0; i < 5; i++) {
      const letra = letrasDigitadas[i];

      if (letra === letrasSecretas[i]) {
        this.tentativas[this.linhaAtual][i] = { char: letra, status: 'correta' };
      } else if (letrasSecretas.includes(letra)) {
        this.tentativas[this.linhaAtual][i] = { char: letra, status: 'presente' };
      } else {
        this.tentativas[this.linhaAtual][i] = { char: letra, status: 'ausente' };
      }
    }

    if (palavraUpper === this.palavraSecreta) {
      this.jogoFinalizado = true;
      this.mensagem = '🎉 Parabéns! Você acertou!';
    } else if (this.linhaAtual === 5) {
      this.jogoFinalizado = true;
      this.mensagem = `😢 Fim de jogo! A palavra era: ${this.palavraSecreta}`;
    } else {
      this.mensagem = '';
    }

    this.linhaAtual++;
    this.palavraDigitada = '';
  }

  reiniciar() {
    this.linhaAtual = 0;
    this.palavraDigitada = '';
    this.jogoFinalizado = false;
    this.mensagem = '';

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        this.tentativas[i][j] = { char: '', status: 'vazio' };
      }
    }
  }
}
