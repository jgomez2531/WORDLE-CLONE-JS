import confetti from "canvas-confetti";
import WORDS from "../assets/words.json";
import "./WordleWord.js";
import "./WordleKeyboard.js";
import "./WordleSummary.js";

const LOSE_SOUND = new Audio("sounds/lose.mp3");
const WIN_SOUND = new Audio("sounds/win.mp3");

// convert to regex
const LETTERS = [
  "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
  "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ",
  "z", "x", "c", "v", "b", "n", "m"
];

class WordleGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.startGame();
  }

  static get styles() {
    return /* css */`
      :host {
        --exact-color: #6aaa64;
        --exist-color: #c9b458;
        --used-color: #3a3a3c;

        font-family: Montserrat, sans-serif;
      }

      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
      }

      h1 {
        text-transform: uppercase;
        border-bottom: 1px solid #555;
        margin-bottom: 0;
      }

      h2 {
        font-weight: lighter;
        font-size: 1rem;
        text-align: center;
        margin: 0;
      }

      h2 a {
        color: #f4b400;
      }

      h2 a:hover {
        color: #a22;
      }

      .words {
        display: flex;
        flex-direction: column;
        font-weight: bold;
      }
    `;
  }

  startGame() {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    this.secretWord = WORDS[randomIndex].toLowerCase();
    /* COMODÍN POR CONSOLA PARA CONONOCER LA PALABRA SECRETA */
    console.log("JUANMA la palabra secreta es: " + this.secretWord);
    this.ending = false;
  }

  connectedCallback() {
    this.render();
    this.currentWord = this.shadowRoot.querySelector("wordle-word[current]");
    this.keyboard = this.shadowRoot.querySelector("wordle-keyboard");
    document.addEventListener("keyup", (ev) => this.pushLetter(ev.key));
    document.addEventListener("keyboard", (ev) => this.pushLetter(ev.detail));
    this.addEventListener("KEYBOARD_SET_LETTER", (ev) => this.keyboard.setLetter(ev.detail.letter, ev.detail.className));
  }

  pushLetter(letter) {
    if (this.ending) { return; }

    const key = letter.toLowerCase();
    const isEnter = key === "enter";
    const isBackSpace = key === "backspace";

    isEnter && this.checkRestrictions();
    isBackSpace && this.currentWord.removeLetter();

    const isLetter = LETTERS.includes(key);
    const isEmptyWord = this.currentWord.isEmpty();

    if (isLetter && isEmptyWord) {
      this.currentWord.addLetter(key);
    }
  }

  checkRestrictions() {
    const isEmpty = this.currentWord.isEmpty();
    if (isEmpty) {
      alert("La palabra debe tener 5 letras");
      return;
    }

    const word = this.currentWord.toString();
    const existentWord = WORDS.includes(word);
    if (!existentWord) {
      alert("No existe esta palabra en el diccionario");
      return;
    }

    const solved = this.currentWord.resolve(this.secretWord);
    if (!solved) {
      this.nextWord();
      return;
    }

    this.win();
  }

  nextWord() {
    this.currentWord = this.shadowRoot.querySelector("wordle-word[current]");
    const nextWord = this.currentWord.nextElementSibling;

    if (nextWord) {
      nextWord.setAttribute("current", "");
      this.currentWord.removeAttribute("current");
      this.currentWord = nextWord;
      return;
    }

    this.lose();
  }

  win() {
    WIN_SOUND.play();
    confetti();
    this.startSummary(true);
    this.ending = true;
  }

  lose() {
    LOSE_SOUND.play();
    this.startSummary(false);
    this.ending = true;
  }

  startSummary(winner) {
    const container = this.shadowRoot.querySelector(".container");
    const summary = document.createElement("wordle-summary");
    summary.setSecretWord(this.secretWord);
    summary.setWinner(winner);
    summary.setStats(this.shadowRoot.querySelectorAll("wordle-word"));
    container.insertAdjacentElement("beforeend", summary);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${WordleGame.styles}</style>
    <div class="container">
      <header>
        <h1>Wordle</h1>
      </header>
      <div class="words">
        <wordle-word current></wordle-word>
        <wordle-word></wordle-word>
        <wordle-word></wordle-word>
        <wordle-word></wordle-word>
        <wordle-word></wordle-word>
        <wordle-word></wordle-word>
      </div>
      <wordle-keyboard></wordle-keyboard>
    </div>`;
  }
}

customElements.define("wordle-game", WordleGame);
