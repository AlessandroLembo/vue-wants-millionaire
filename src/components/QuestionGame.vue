<script>
// import { questions } from '@/data';

export default {
    name: "QuestionGame",
    props: {
        question: Object,
        answers: Array
    },
    computed: {
        getQ() {
            return this.question;
        },

        getA() {
            return this.answers;
        }
    }
}
</script>

<template></template>

<style scoped lang="scss"></style>