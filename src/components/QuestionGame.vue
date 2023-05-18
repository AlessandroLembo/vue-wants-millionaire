<script>
import { questions } from "../data";

export default {
    name: "QuestionGame",
    data() {
        return {
            questions,
            userAnswer: '',
            currentIndex: 0,
            isExactly: false,
            isWrong: false,
            isClicked: false,
            disabledRadio: false,
            disabledButton: false,
            questionsDone: [],
            start: false,
            gameOver: false,
            lastQuestion: false,
            result: false,
            userAnswer: [],
            errorAnswer: [],
        }
    },
    computed: {
        // ottenere una domanda random dall'array questions
        getItemRandom() {
            const item = questions[Math.floor(Math.random() * questions.length)];
            const index = questions.indexOf(item);

            if (!this.start) {
                this.questionsDone.push(item);
                questions.splice(index, 1);
            } else if (questions.length >= 1) {
                this.start = false;
                this.questionsDone.push(item);
                questions.splice(index, 1);
            } else {
                this.lastQuestion = true;
            }

            if (this.lastQuestion) this.gameOver = true;
            return item;

        },

        // prendere dall'oggetto randomizzato solo l'array answers
        getAnswers() {
            return this.getItemRandom?.answers;
        },

    },

    methods: {
        getUserAnswer(i) {
            // inizializzo il flag che utlizzo nel template con valore false
            this.isExactly = false;
            this.isClicked = true;
            this.disabledRadio = true;

            // Gestico l'attivazione del button continua 
            if (this.userAnswer) this.disabledButton = true;

            // controllo se la risposta singola corrisponde alla risposta dell'utente e se la risposta è giusta
            if (this.getAnswers[i].answer === this.userAnswer && this.getAnswers[i].rightAnswer) {
                this.isExactly = true;

                // risposta sbagliata da parte dell'utente
            } else if (this.getAnswers[i].answer === this.userAnswer && !this.getAnswers[i].rightAnswer) {
                this.isExactly = false;
                this.isWrong = true;
            }

            this.cleanRadios(i);
        },

        cleanRadios(i) {
            // giro sull'array di risposte e le dichiaro non cliccate
            this.getAnswers.map(ans => {
                return ans.isclicked = false;
            })

            // cambio la proprietà 'isClicked' solo alla risposta selezionata
            return this.getAnswers[i].isclicked = true;
        },

        playAgain() {
            this.start = true;
            this.getAnswers?.map(ans => {
                return ans.isclicked = false;
            })
            this.disabledRadio = false;
            this.disabledButton = false;
            this.isClicked = false;
            this.userAnswer = '';
            this.isExactly = false;
            this.isWrong = false;

        },

        showResult() {
            this.result = true;
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
                    <div v-if="gameOver" class="d-flex justify-content-center">
                        <button v-if="!result" type="button" class="btn btn-secondary mt-2" @click="showResult()">Vai al
                            punteggio
                        </button>
                        <div v-else>
                            <div></div>
                        </div>
                    </div>
                    <div v-else>
                        <h2 class="text-center text-white my-5">{{ getItemRandom.question }}</h2>
                        <ul class="row justify-content-center align-items-center p-0">

                            <!-- giro sull'array delle opzioni di risposta alla domanda e le stampo in pagina -->
                            <li v-for="(answer, i) in getAnswers" :key="answer.answer"
                                class="col-12 col-sm-5 list-group-item text-center p-2">

                                <!-- controllo la risposta e assegno al blocco un colore diverso a seconda che sia giusta o meno -->
                                <div :class="{ 'bg-success': answer.isclicked && isExactly || isClicked && answer.rightAnswer, 'bg-danger': answer.isclicked && !answer.rightAnswer && isWrong }"
                                    class="row justify-content-center justify-content-md-start align-items-center box-answer g-2 p-0 answer">
                                    <input type="radio" class="col-12 col-md-6 mx-md-4 mx-1 choose-user" :id="answer.answer"
                                        :value="answer.answer" v-model="userAnswer" name="city" @change="getUserAnswer(i)"
                                        :disabled="disabledRadio">
                                    <label :for="answer.answer" class="col-12 col-md-6">
                                        <div
                                            class="d-flex align-items-center justify-content-center justify-content-md-start">
                                            <p class="m-0 fs-6 city-option">{{ answer.answer.toUpperCase() }}</p>
                                        </div>
                                    </label>
                                </div>
                            </li>


                            <!-- alerts che danno un feedback sull'esito della risposta -->
                            <div v-if="!isExactly && isClicked"
                                class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                                Risposta errata! Ritenta con la prossima domanda
                                <button type="button" class="btn btn-outline-secondary"
                                    @click="playAgain()">Continua</button>
                            </div>
                            <div v-else-if="!isClicked || isExactly" class="d-flex justify-content-end align-items-center">
                                <button type="button" class="btn btn-warning mt-2" :disabled="!disabledButton"
                                    @click="playAgain()">Continua</button>
                            </div>
                        </ul>
                    </div>
                    <!-- stampo la domanda -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content-quiz {
    max-width: 1500px;
    min-height: 600px;
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