import { liftHtml } from "@lift-html/core";
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import html from "solid-js/html";

liftHtml("my-copy-to-clipboard", {
  init(dispose) {
    const el = this.querySelector("code");
    const preEl = el.parentNode;
    preEl.tabIndex = "0";
    preEl.style.position = "relative";
    const App = () => {
      const [buttonClass, setButtonClass] = createSignal("init");
      return html`<button
        class=${() => "copy-button " + buttonClass()}
        onClick=${() => {
          Promise.try(() => navigator.clipboard.writeText(el.innerText)).then(
            () => setButtonClass("copy-success"),
            () => setButtonClass("copy-fail")
          );
        }}
      ></button>`;
    };
    const supportsDeclarative =
      HTMLElement.prototype.hasOwnProperty("attachInternals");
    const internals = supportsDeclarative ? this.attachInternals() : undefined;
    let shadow =
      internals?.shadowRoot ||
      this.attachShadow({
        mode: "open",
      });
    dispose(render(App, shadow));
  },
});

liftHtml("my-copy-to-clipboard-2", {
  init() {
    const button = this.querySelector("button");
    const text = this.getAttribute("text");
    button.textContent = this.getAttribute("button-text");
    button.onclick = async () => {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    };
  },
});

const el = document.createElement("my-copy-to-clipboard");
el.setAttribute("show-by-default", "true");
