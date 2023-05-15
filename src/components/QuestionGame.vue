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
    <div class="content-quiz">
        <div class="row justify-content-center">
            <div class="col-12">
                <img src="../assets/img/millionaire.jpg" class="img-fluid" alt="millionaire">
                <div class="question-content">
                    <h2 class="text-center text-white my-5">{{ getItemRandom.question }}</h2>
                    <ul class="row justify-content-center align-items-center p-0">
                        <li v-for="answer in getAnswers" :key="answer.answer"
                            class="col-12 col-sm-5 list-group-item text-center p-2">
                            <div
                                class="row justify-content-center justify-content-md-start align-items-center box-answer g-2 p-0 answer">
                                <input type="radio" class="col-12 col-md-6 mx-md-4 mx-1" id="city" name="city">
                                <div class="col-12 col-md-6">
                                    <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                                        <p class="m-0 fs-6 text-white">{{ answer.answer.toUpperCase() }}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content-quiz {
    max-width: 1200px;
    min-height: 700px;
    border: 2px solid darkgrey;
}

.question-content {
    padding: 2rem;
    background-color: darkblue;
}

.box-answer {
    border: 2px solid goldenrod;
    height: 70px;
    border-radius: 20px;

}

#city {
    width: 25px;
    height: 25px;
    border-radius: 50%;
}

.answer:hover {
    background-color: dodgerblue;
}
</style>