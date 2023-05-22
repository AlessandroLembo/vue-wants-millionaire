<script>
import { questions } from "../data";
import AnswersGame from "./AnswersGame.vue";

export default {
    name: "AnswersGame",
    components: { AnswersGame },
    data() {
        return {
            questions,
        }
    },
    computed: {
        getQ() {
            return questions;
        }
    }
}
</script>

<template>
    <answers-game></answers-game>
</template>

<style></style>