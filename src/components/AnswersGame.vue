<script>

export default {
    name: "AnswersGame",
    props: {
        answers: Array,
        isExactly: Boolean,
        isWrong: Boolean,
        isClicked: Boolean,
        disabledRadio: Boolean,
        disabledButton: Boolean
    },
    data() {
        return {
            userAnswer: ''
        }
    },
    computed: {

    },

    emits: ['user-choose', 'continue-game'],

}
</script>

<template>
    <div>
        <ul class="row justify-content-center align-items-center p-0">

            <!-- giro sull'array delle opzioni di risposta alla domanda e le stampo in pagina -->
            <li v-for="answer in answers" :key="answer.answer" class="col-12 col-sm-5 list-group-item text-center p-2">

                <!-- controllo la risposta e assegno al blocco un colore diverso a seconda che sia giusta o meno -->
                <div :class="{ 'bg-success': answer.isclicked && isExactly || isClicked && answer.rightAnswer, 'bg-danger': answer.isclicked && !answer.rightAnswer && isWrong }"
                    class="row justify-content-center justify-content-md-start align-items-center box-answer g-2 p-0 answer">
                    <input type="radio" class="col-12 col-md-6 mx-md-4 mx-1 choose-user" :id="answer.answer"
                        :value="answer.answer" v-model="userAnswer" name="city" @change="$emit('user-choose', userAnswer)"
                        :disabled="disabledRadio">
                    <label :for="answer.answer" class="col-12 col-md-6">
                        <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                            <p class="m-0 fs-6 city-option">{{ answer.answer.toUpperCase() }}</p>
                        </div>
                    </label>
                </div>
            </li>
        </ul>

        <!-- alert che da un feedback in caso di risposta sbagliata -->
        <div v-if="!isExactly && isClicked"
            class="alert alert-danger d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-center fs-3"
            role="alert">
            Risposta errata! Vai alla prossima domanda..
            <button type="button" class="btn btn-outline-secondary"
                @click="$emit('continue-game', userAnswer)">Continua</button>
        </div>
        <div v-else-if="!isClicked || isExactly"
            class="d-flex justify-content-center justify-content-sm-end align-items-center">
            <button type="button" class="btn btn-warning mt-2" :disabled="!disabledButton"
                @click="$emit('continue-game', userAnswer)">Continua</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.box-answer {
    border: 2px solid goldenrod;
    height: 70px;
    border-radius: 20px;

}

.choose-user {
    width: 25px;
    height: 25px;
    border-radius: 50%;
}

.answer:hover {
    background-color: dodgerblue;
}

.city-option {
    color: white;
}
</style>