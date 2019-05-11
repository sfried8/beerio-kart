import KeyPadComponent from "./KeypadComponent";
import Vue from "vue";
const ComponentClass = Vue.extend(KeyPadComponent);
export function KeypadPrompt() {
  return new Promise((res, rej) => {
    const instance = new ComponentClass();
    instance.$mount();
    instance.$on("selected", n => {
      instance.$destroy();
      instance.$el.remove();
      res(n);
    });
    document.body.appendChild(instance.$el);
  });
}
