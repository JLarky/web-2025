import { liftHtml } from "@lift-html/core";
import { html, render, signal, effect } from "uhtml";

liftHtml("my-copy-to-clipboard", {
  init() {
    const el = this.shadowRoot.querySelector("code");
    const outlet = this.shadowRoot.querySelector("copy-button-outlet");
    console.log(el);
    const btn = document.createElement("span"),
      buttonClasses = btn.classList,
      preEl = el.parentNode;
    function addClass(e) {
      buttonClasses.add(e), setTimeout(() => buttonClasses.remove(e), 1000);
    }
    btn.className = "copy-button";
    btn.onclick = () =>
      navigator.clipboard.writeText(el.innerText).then(
        () => addClass("copy-success"),
        () => addClass("copy-fail")
      );
    // preEl.append(btn);
    preEl.tabIndex = "0";
    preEl.style.position = "relative";
    const App = () => {
      const buttonClass = signal("init");
      effect(() => {
        console.log("xxxx", buttonClass.value);
      });
      return html`<button
        class=${buttonClass.value}
        onClick=${() => {
          buttonClass.value = "testing";
          Promise.try(() => navigator.clipboard.writeText(el.innerText)).then(
            () => (buttonClass.value = "copy-success"),
            () => (buttonClass.value = "copy-fail")
          );
        }}
      >
        ${buttonClass.value}
      </button>`;
    };
    render(outlet, App);
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

function Counter() {
  const count = signal(0);

  return html`
    <button onClick=${() => count.value++}>Clicked ${count.value} times</button>
  `;
}
render(document.getElementById("counter"), Counter);
