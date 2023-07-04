<script>
import { questions } from "../data";
import SingleAnswer from './SingleAnswer.vue';
export default {
    name: "AnswersGame",
    components: { SingleAnswer },
    props: {
        answers: Array,
        isExactly: Boolean,
        isWrong: Boolean,
        isClicked: Boolean,
        disabledRadio: Boolean,
        disabledButton: Boolean,
        finishTime: Boolean,
        singleAnswerWin: Number,
        questionsUndone: Array,
        gameOver: Boolean,
        userLose: Array
    },

    data() {
        return {
            questions
        }
    },

    methods: {
        passUserChoose(userAnswer) {
            this.$emit('user-choose', userAnswer)
        }
    },


    emits: ['user-choose', 'continue-game', 'game-over'],

}
</script>

<template>
    <div>
        <ul class="row justify-content-center align-items-center p-0">

            <!-- giro sull'array delle opzioni di risposta alla domanda e le stampo in pagina -->
            <li v-for="answer in answers" :key="answer.answer" class="col-12 col-sm-5 list-group-item text-center p-2">

                <!-- controllo la risposta e assegno al blocco un colore diverso a seconda che sia giusta o meno -->
                <div :class="{ 'bg-success': answer.isclicked && isExactly || isClicked && answer.rightAnswer, 'bg-danger': answer.isclicked && !answer.rightAnswer && isWrong }"
                    class="box-answer g-2 p-0 answer">

                    <single-answer :answer="answer" :disabledRadio="disabledRadio"
                        @user-choose="passUserChoose"></single-answer>
                </div>
            </li>
        </ul>

        <!-- alert che dà un feedback in caso di risposta sbagliata -->
        <div v-if="!isExactly && isClicked"
            class="d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-center fs-3"
            role="alert" :class="[finishTime ? 'alert alert-warning' : 'alert alert-danger']">
            <p v-if="finishTime">Attenzione..Tempo scaduto!!</p>
            <p v-else>Risposta errata!</p>
            <button type="button" class="btn btn-outline-secondary" @click="$emit('game-over')">Vai al punteggio</button>
        </div>
        <!-- alert che dà un feedback sulla vincita relativa alla risposta esatta -->
        <div v-else-if="isExactly && isClicked"
            class="alert alert-success d-flex flex-column flex-sm-row justify-content-center justify-content-sm-between align-items-center fs-3"
            role="alert">
            <p>Risposta corretta!
                <span v-if="questionsUndone.length !== questions.length - 1">Hai aggiunto ${{ singleAnswerWin }}
                    alla tua vincita</span>
                <span v-else>Hai vinto i primi ${{ singleAnswerWin }}</span>
            </p>
            <button v-if="gameOver" type="button" class="btn btn-outline-secondary" @click="$emit('game-over')">Vai al
                punteggio</button>
            <button v-else type="button" class="btn btn-warning mt-2" :disabled="!disabledButton"
                @click="$emit('continue-game')">Continua</button>

        </div>
    </div>
</template>

<style scoped lang="scss">
.box-answer {
    border: 2px solid goldenrod;
    height: 70px;
    border-radius: 20px;

}

.answer:hover {
    background-color: dodgerblue;
}
</style>