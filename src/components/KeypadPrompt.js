import KeyPadComponent from "./KeypadComponent";
import Vue from "vue";
const ComponentClass = Vue.extend(KeyPadComponent);
export function KeypadPrompt(title) {
    document.querySelector("#app").scrollTo({ top: 0 });
    return new Promise(res => {
        const instance = new ComponentClass({ propsData: { title } });
        instance.$mount();
        instance.$on("selected", n => {
            instance.$destroy();
            instance.$el.remove();
            res(n);
        });
        document.querySelector("#app").appendChild(instance.$el);
    });
}
