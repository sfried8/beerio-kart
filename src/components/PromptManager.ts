import KeyPadComponent from "./KeypadComponent.vue";
import CoursePromptComponent from "./CoursePromptComponent.vue";
import Vue from "vue";
const KeyPadComponentClass = Vue.extend(KeyPadComponent);
const CoursePromptComponentClass = Vue.extend(CoursePromptComponent);
export function KeypadPrompt(title: string): Promise<number> {
    const container = document.querySelector("#app");
    if (!container) {
        return Promise.reject();
    }
    container.scrollTo({ top: 0 });
    return new Promise(res => {
        const instance = new KeyPadComponentClass({ propsData: { title } });
        instance.$mount();
        instance.$on("selected", (n: number) => {
            instance.$destroy();
            instance.$el.remove();
            res(n);
        });
        container.appendChild(instance.$el);
    });
}
export function CoursePrompt(roundNumber: number): Promise<number> {
    const container = document.querySelector("#app");
    if (!container) {
        return Promise.reject();
    }
    container.scrollTo({ top: 0 });
    return new Promise(res => {
        const instance = new CoursePromptComponentClass({
            propsData: { title: `Choose course for race ${roundNumber}` }
        });
        instance.$mount();
        instance.$on("selected", (n: number) => {
            instance.$destroy();
            instance.$el.remove();
            res(n);
        });
        container.appendChild(instance.$el);
    });
}
