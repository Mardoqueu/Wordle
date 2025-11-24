import { Component, OnInit } from '@angular/core';
import { NgForOf, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Letra {
  char: string;
  status: 'correta' | 'presente' | 'ausente' | 'vazio';
}

interface Tecla {
  char: string;
  status: 'correta' | 'presente' | 'ausente' | 'nao-usada';
}

interface Estatisticas {
  jogadas: number;
  vitorias: number;
  sequenciaAtual: number;
  melhorSequencia: number;
  distribuicao: number[];
}

@Component({
  selector: 'app-meu-componente',
  imports: [NgForOf, NgClass, NgIf, FormsModule],
  templateUrl: './meu-componente.component.html',
  styleUrl: './meu-componente.component.css'
})
export class MeuComponenteComponent implements OnInit {
  tentativas: Letra[][] = [];
  palavraSecreta: string = '';
  linhaAtual: number = 0;
  palavraDigitada: string = '';
  jogoFinalizado: boolean = false;
  mensagem: string = '';
  venceu: boolean = false;
  modoEscuro: boolean = false;
  mostrarEstatisticas: boolean = false;
  tentativaInvalida: boolean = false;

  bancoPalavras: string[] = [
    'CASAS', 'MUNDO', 'PAPEL', 'LIVRO', 'TEMPO',
    'GENTE', 'FALAR', 'SABER', 'FAZER', 'TERRA',
    'OLHAR', 'VIVER', 'NOMES', 'AGORA', 'PODER',
    'MENOR', 'MAIOR', 'QUERO', 'PARTIR', 'CHEGAR'
  ];

  teclado: Tecla[][] = [
    [
      { char: 'Q', status: 'nao-usada' },
      { char: 'W', status: 'nao-usada' },
      { char: 'E', status: 'nao-usada' },
      { char: 'R', status: 'nao-usada' },
      { char: 'T', status: 'nao-usada' },
      { char: 'Y', status: 'nao-usada' },
      { char: 'U', status: 'nao-usada' },
      { char: 'I', status: 'nao-usada' },
      { char: 'O', status: 'nao-usada' },
      { char: 'P', status: 'nao-usada' }
    ],
    [
      { char: 'A', status: 'nao-usada' },
      { char: 'S', status: 'nao-usada' },
      { char: 'D', status: 'nao-usada' },
      { char: 'F', status: 'nao-usada' },
      { char: 'G', status: 'nao-usada' },
      { char: 'H', status: 'nao-usada' },
      { char: 'J', status: 'nao-usada' },
      { char: 'K', status: 'nao-usada' },
      { char: 'L', status: 'nao-usada' }
    ],
    [
      { char: 'Z', status: 'nao-usada' },
      { char: 'X', status: 'nao-usada' },
      { char: 'C', status: 'nao-usada' },
      { char: 'V', status: 'nao-usada' },
      { char: 'B', status: 'nao-usada' },
      { char: 'N', status: 'nao-usada' },
      { char: 'M', status: 'nao-usada' }
    ]
  ];

  estatisticas: Estatisticas = {
    jogadas: 0,
    vitorias: 0,
    sequenciaAtual: 0,
    melhorSequencia: 0,
    distribuicao: [0, 0, 0, 0, 0, 0]
  };

  ngOnInit() {
    this.carregarEstatisticas();
    this.carregarModoEscuro();
    this.sortearPalavra();
    this.inicializarTentativas();
  }

  constructor() {}

  inicializarTentativas() {
    this.tentativas = [];
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

  sortearPalavra() {
    const indice = Math.floor(Math.random() * this.bancoPalavras.length);
    this.palavraSecreta = this.bancoPalavras[indice];
  }

  clicarTecla(char: string) {
    if (this.jogoFinalizado || this.palavraDigitada.length >= 5) {
      return;
    }
    this.palavraDigitada += char;
  }

  apagarLetra() {
    this.palavraDigitada = this.palavraDigitada.slice(0, -1);
    this.tentativaInvalida = false;
  }

  enviarTentativa() {
    if (this.jogoFinalizado) {
      return;
    }

    if (this.palavraDigitada.length !== 5) {
      this.tentativaInvalida = true;
      this.mensagem = 'A palavra deve ter 5 letras!';
      setTimeout(() => {
        this.tentativaInvalida = false;
        this.mensagem = '';
      }, 1000);
      return;
    }

    if (this.linhaAtual >= 6) {
      return;
    }

    const palavraUpper = this.palavraDigitada.toUpperCase();

    if (!this.bancoPalavras.includes(palavraUpper)) {
      this.tentativaInvalida = true;
      this.mensagem = 'Palavra não está na lista!';
      setTimeout(() => {
        this.tentativaInvalida = false;
        this.mensagem = '';
      }, 1000);
      return;
    }

    const letrasSecretas = this.palavraSecreta.split('');
    const letrasDigitadas = palavraUpper.split('');

    for (let i = 0; i < 5; i++) {
      const letra = letrasDigitadas[i];

      if (letra === letrasSecretas[i]) {
        this.tentativas[this.linhaAtual][i] = { char: letra, status: 'correta' };
        this.atualizarTeclado(letra, 'correta');
      } else if (letrasSecretas.includes(letra)) {
        this.tentativas[this.linhaAtual][i] = { char: letra, status: 'presente' };
        this.atualizarTeclado(letra, 'presente');
      } else {
        this.tentativas[this.linhaAtual][i] = { char: letra, status: 'ausente' };
        this.atualizarTeclado(letra, 'ausente');
      }
    }

    if (palavraUpper === this.palavraSecreta) {
      this.jogoFinalizado = true;
      this.venceu = true;
      this.mensagem = '🎉 Parabéns! Você acertou!';
      this.atualizarEstatisticas(true);
    } else if (this.linhaAtual === 5) {
      this.jogoFinalizado = true;
      this.venceu = false;
      this.mensagem = `😢 Fim de jogo! A palavra era: ${this.palavraSecreta}`;
      this.atualizarEstatisticas(false);
    }

    this.linhaAtual++;
    this.palavraDigitada = '';
  }

  atualizarTeclado(letra: string, novoStatus: 'correta' | 'presente' | 'ausente') {
    for (const linha of this.teclado) {
      for (const tecla of linha) {
        if (tecla.char === letra) {
          if (novoStatus === 'correta') {
            tecla.status = novoStatus;
          } else if (novoStatus === 'presente' && tecla.status !== 'correta') {
            tecla.status = novoStatus;
          } else if (novoStatus === 'ausente' && tecla.status === 'nao-usada') {
            tecla.status = novoStatus;
          }
        }
      }
    }
  }

  reiniciarTeclado() {
    for (const linha of this.teclado) {
      for (const tecla of linha) {
        tecla.status = 'nao-usada';
      }
    }
  }

  reiniciar() {
    this.linhaAtual = 0;
    this.palavraDigitada = '';
    this.jogoFinalizado = false;
    this.venceu = false;
    this.mensagem = '';
    this.sortearPalavra();
    this.inicializarTentativas();
    this.reiniciarTeclado();
  }

  toggleModoEscuro() {
    this.modoEscuro = !this.modoEscuro;
    localStorage.setItem('modoEscuro', JSON.stringify(this.modoEscuro));
  }

  carregarModoEscuro() {
    const modo = localStorage.getItem('modoEscuro');
    if (modo) {
      this.modoEscuro = JSON.parse(modo);
    }
  }

  toggleEstatisticas() {
    this.mostrarEstatisticas = !this.mostrarEstatisticas;
  }

  carregarEstatisticas() {
    const stats = localStorage.getItem('estatisticas');
    if (stats) {
      this.estatisticas = JSON.parse(stats);
    }
  }

  salvarEstatisticas() {
    localStorage.setItem('estatisticas', JSON.stringify(this.estatisticas));
  }

  atualizarEstatisticas(venceu: boolean) {
    this.estatisticas.jogadas++;

    if (venceu) {
      this.estatisticas.vitorias++;
      this.estatisticas.sequenciaAtual++;
      this.estatisticas.distribuicao[this.linhaAtual]++;

      if (this.estatisticas.sequenciaAtual > this.estatisticas.melhorSequencia) {
        this.estatisticas.melhorSequencia = this.estatisticas.sequenciaAtual;
      }
    } else {
      this.estatisticas.sequenciaAtual = 0;
    }

    this.salvarEstatisticas();
  }

  get percentualVitorias(): number {
    if (this.estatisticas.jogadas === 0) return 0;
    return Math.round((this.estatisticas.vitorias / this.estatisticas.jogadas) * 100);
  }

  compartilhar() {
    let texto = `Wordle ${this.linhaAtual}/6\n\n`;

    for (let i = 0; i < this.linhaAtual; i++) {
      for (let j = 0; j < 5; j++) {
        const status = this.tentativas[i][j].status;
        if (status === 'correta') {
          texto += '🟩';
        } else if (status === 'presente') {
          texto += '🟨';
        } else {
          texto += '⬛';
        }
      }
      texto += '\n';
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        alert('Resultado copiado para área de transferência!');
      });
    } else {
      alert(texto);
    }
  }
}
