<script>

export default {
    name: "QuestionGame",
    props: {
        question: Object,
    },

}
</script>

<template>
    <h2 class="text-center text-white my-5">{{ question.question }}</h2>
</template>

<style scoped lang="scss"></style>