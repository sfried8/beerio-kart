import KeyPadComponent from "./KeypadComponent.vue";
import Vue from "vue";
const ComponentClass = Vue.extend(KeyPadComponent);
export function KeypadPrompt(title: string): Promise<number> {
    const container = document.querySelector("#app");
    if (!container) {
        return Promise.reject();
    }
    container.scrollTo({ top: 0 });
    return new Promise(res => {
        const instance = new ComponentClass({ propsData: { title } });
        instance.$mount();
        instance.$on("selected", (n: number) => {
            instance.$destroy();
            instance.$el.remove();
            res(n);
        });
        container.appendChild(instance.$el);
    });
}
