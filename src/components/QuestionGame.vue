<script>
import { questions } from "../data";

export default {
    name: "QuestionGame",
    data() {
        return {
            questions,
        }
    },
    computed: {
        getItemRandom() {
            const item = questions[Math.floor(Math.random() * questions.length)];
            return item;
        },

        getAnswers() {
            return this.getItemRandom.answers;
        }
    }
};
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-12 content-quiz">
            <h2 class="text-center my-5">{{ getItemRandom.question }}</h2>
            <ul class="row">
                <li v-for="answer in getAnswers" :key="answer.answer" class="col-12 col-sm-6 list-group-item text-center">
                    <div class="d-flex justify-content-start align-items-center box-answer m-2 px-5">
                        <input type="radio" class="me-4">
                        <div class="d-flex align-items-center">
                            <p class="m-0">{{ answer.answer }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content-quiz {
    width: 1200px;
    height: 700px;
    border: 2px solid darkgrey;
    margin: 10rem auto;
}

.box-answer {
    border: 1px solid goldenrod;
    height: 70px;

}
</style>