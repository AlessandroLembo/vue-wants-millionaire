<script>

export default {
    name: "QuestionGame",
    props: {
        question: Object,
    },

}
</script>

<template>
    <h1 class="text-center text-white mt-5 single-question">{{ question.question }}</h1>
</template>

<style scoped lang="scss">
.single-question {
    margin-left: 7rem;
}

@media screen and (max-width: 992px) {
    .single-question {
        margin-left: 3rem;
    }
}
</style>