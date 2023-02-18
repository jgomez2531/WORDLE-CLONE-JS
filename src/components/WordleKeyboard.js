import KEYBOARD_INITIAL_STATE from "../assets/keyboardState.json";

class WordleKeyboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.letters = KEYBOARD_INITIAL_STATE;
  }

  static get styles() {
    return /* css */`
      :host {
      }

      .container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 8px 4px;
        width: 450px;
        margin: 1em 0;
      }

      .letter {
        background: #777;
        color: #fff;
        font-family: Arial;
        font-weight: bold;
        padding: 20px 14px;
        border-radius: 4px;
        width: 12px;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }

      .letter.special {
        width: 32px;
      }

      .letter.used {
        background: var(--used-color);
        color: #fff;
      }

      .letter.exist {
        background: var(--exist-color);
        color: #fff;
      }

      .letter.exact {
        background: var(--exact-color);
        color: #fff;
      }

      /* iPhone 12, 13, 14 */
      @media only screen 
      and (min-device-width: 375px) 
      and (max-device-width: 812px) 
      and (-webkit-min-device-pixel-ratio: 3) {

        .container {
          width: 375px;
        }

        .letter {
          width: 3px;
        }

    }
    `;
  }

  setLetter(key, state) {
    const letter = this.letters.find(letter => letter.key === key);
    if (letter.state !== "exact") {
      letter.state = state;
    }
    this.render();
  }

  listeners() {
    const keys = Array.from(this.shadowRoot.querySelectorAll(".letter"));
    keys.forEach(key => {
      key.addEventListener("click", () => {
        const detail = key.textContent.replace("SIGUI.", "enter").replace("ATRÁS", "backspace");
        const options = { detail, bubbles: true, composed: true };
        const event = new CustomEvent("keyboard", options);
        this.dispatchEvent(event);
      });
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${WordleKeyboard.styles}</style>
    <div class="container">
      ${this.letters.map(letter => `<div class="letter ${letter.state}">${letter.key}</div>`).join("")}
    </div>`;
    this.listeners();
  }
}

customElements.define("wordle-keyboard", WordleKeyboard);
