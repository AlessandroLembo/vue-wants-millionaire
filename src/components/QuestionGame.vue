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
                <div id="jumbo-millionaire"></div>
                <div class="question-content">
                    <h2 class="text-center my-5">{{ getItemRandom.question }}</h2>
                    <ul class="row">
                        <li v-for="answer in getAnswers" :key="answer.answer"
                            class="col-12 col-sm-6 list-group-item text-center p-2">
                            <div class="d-flex justify-content-start align-items-center box-answer px-5">
                                <input type="radio" class="me-4" id="city" name="city">
                                <div class="d-flex align-items-center">
                                    <p class="m-0">{{ answer.answer }}</p>
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
    width: 1200px;
    min-height: 700px;
    border: 2px solid darkgrey;
}

#jumbo-millionaire {
    height: 600px;
    background-image: url('../assets/img/millionaire.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.question-content {
    padding: 2rem;
}

.box-answer {
    border: 2px solid goldenrod;
    height: 70px;

}

#city {
    width: 25px;
    height: 25px;
    border-radius: 50%;
}
</style>