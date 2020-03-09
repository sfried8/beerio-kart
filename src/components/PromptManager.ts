import KeyPadComponent from "./KeypadComponent.vue";
import CoursePromptComponent from "./CoursePromptComponent.vue";
import Vue from "vue";
import * as Util from "@/Util";
const KeyPadComponentClass = Vue.extend(KeyPadComponent);
const CoursePromptComponentClass = Vue.extend(CoursePromptComponent);
export function KeypadPrompt(
    title: string,
    playerHistory: number[]
): Promise<number> {
    const container = document.querySelector(".v-content");
    if (!container) {
        return Promise.reject();
    }
    container.scrollTo({ top: 0 });
    return new Promise(res => {
        const instance = new KeyPadComponentClass({
            propsData: {
                title,
                startingScore: Util.kartScore(playerHistory)
            }
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
export function CoursePrompt(courseHistory: number[]): Promise<number> {
    const container = document.querySelector("#app");
    if (!container) {
        return Promise.reject();
    }
    container.scrollTo({ top: 0 });
    return new Promise(res => {
        const instance = new CoursePromptComponentClass({
            propsData: {
                courseHistory
            }
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
