<script>
// import { questions } from '@/data';

export default {
    name: "QuestionGame",
    props: {
        pippo: Object,
        ciccio: Array
    },
    computed: {
        getQ() {
            return this.pippo;
        },

        getA() {
            return this.ciccio;
        }
    }
}
</script>

<template></template>

<style scoped lang="scss"></style>