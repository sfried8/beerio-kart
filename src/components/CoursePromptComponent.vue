<template>
    <div class="overlay">
        <h1 style="color:white;text-align:center" class="ma-5">
            {{ title }}
        </h1>
        <div class="choose-course-container ma-5">
            <vue-select
                ref="courseSelect"
                class="choose-course-select"
                :options="options"
                placeholder="Search"
                @input="onSelected"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Course } from "../models/Enums";
@Component
export default class CoursePromptComponent extends Vue {
    @Prop() private courseHistory!: number[];
    get options(): { label: string; id: number }[] {
        return Object.values(Course).filter(
            c => this.courseHistory && !this.courseHistory.includes(c.id)
        );
    }
    get title() {
        return `Choose course for race ${this.courseHistory.length + 1}`;
    }
    async mounted() {
        await this.$nextTick();
        (this.$refs.courseSelect as any).$refs.search.focus();
    }
    async onSelected(value: { id: number }) {
        await this.$nextTick();
        this.$emit("selected", value.id);
    }
}
</script>

<style>
.overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
}
.choose-course-container {
    max-width: 900px;
    margin: 3vh auto;
}
.choose-course-select .vs__dropdown-toggle {
    background-color: white;
}
</style>
