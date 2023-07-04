<script>
import { questions, moneyJackpot } from "../data";
import QuestionGame from "./QuestionGame.vue";
import AnswersGame from "./AnswersGame.vue";
import ResultReport from "./ResultReport.vue";
export default {
    name: "ContainerGame",
    components: { QuestionGame, AnswersGame, ResultReport },
    data() {
        return {
            questions,
            moneyJackpot,
            userAnswer: '',
            isExactly: false,
            isWrong: false,
            isClicked: false,
            disabledRadio: false,
            disabledButton: false,
            questionsDone: [],
            questionsUndone: [],
            start: false,
            gameOver: false,
            result: false,
            userWin: [],
            userLose: [],
            timer: null,
            reactionTime: 15,
            finishTime: false,
            choose: {},
            singleAnswerWin: 0,
            userSumWin: 0
        }
    },
    computed: {
        // ottenere una domanda random dall'array questions
        getItemRandom() {
            const item = this.questionsUndone[Math.floor(Math.random() * this.questionsUndone.length)];
            const index = this.questionsUndone.indexOf(item);

            if (!this.start) { // Appena iniziato il gioco gestisco i movimenti negli array delle domande fatte e non fatte
                this.questionsDone.push(item);
                this.questionsUndone.splice(index, 1);
            } else if (this.questionsUndone.length >= 1) {
                this.start = false; // con il booleano gestiso il cambio domanda passando alla successiva
                this.questionsDone.push(item);
                this.questionsUndone.splice(index, 1);
            } else {
                this.gameOver = true;
            }

            return item;

        },

        // prendere dall'oggetto randomizzato solo l'array answers
        getAnswers() {
            return this.getItemRandom?.answers; // col punto interrogativo evito di andare in errore nel caso non ci sia l'elemento randomico
        },

        // prendo dall'array di risposte solo quella giusta
        filterRightAnswer() {
            const rightAns = [];
            this.getAnswers?.filter(ans => {
                if (ans.rightAnswer) rightAns.push(ans.answer);
            })

            const [rigAns] = rightAns; // prendo dall'array la stringa e la salvo in una variabile
            return rigAns;
        },

    },

    methods: {

        // metodo per attivare il countdown ogni volta che si cambia domanda
        startTimer() {
            this.timer = setInterval(() => {
                this.reactionTime = this.reactionTime - 1;
                if (this.reactionTime <= 0) {
                    clearInterval(this.timer); // stoppo il countdown quando scade il tempo
                    this.isClicked = true;
                    this.finishTime = true;
                    this.disabledRadio = true;
                    this.userLose.push('tempo scaduto'); // gestiscp il caso in cui l'utente non risponde in tempo alla prima domanda
                }
            }, 1000);

            return this.reactionTime;
        },

        getUserAnswer(userAnswer) {

            // stoppo il tempo quando l'utente seleziona una risposta
            clearInterval(this.timer);

            // inizializzo il flag che utlizzo nel template con valore false
            this.isExactly = false;

            // disabilito i radios e dichiaro che è stata selezionata una risposta
            this.isClicked = true;
            this.disabledRadio = true;

            // Gestico l'attivazione del button continua 
            if (userAnswer) this.disabledButton = true;

            // giro sull'array di risposte e controllo...
            this.getAnswers.forEach(ans => {

                //...se la risposta equivale alla scelta dell'utente e la risposta è quella giusta..
                if (ans.answer === userAnswer && ans.rightAnswer) {
                    this.isExactly = true;
                    this.choose = {
                        question: this.getItemRandom.question,
                        userChoose: userAnswer
                    }
                    this.userWin.push(this.choose);
                    let firstValue = this.moneyJackpot.shift(); // elimino il primo elemento dall'array e lo salvo in variabile
                    this.singleAnswerWin = firstValue.value; // salvo il valore della vincita della risposta
                    this.userSumWin += this.singleAnswerWin; // aggiorno la somma vinta dall'utente

                    //...se la risposta equivale alla scelta dell'utente ma è sbagliata..
                } else if (ans.answer === userAnswer && !ans.rightAnswer) {
                    this.isExactly = false;
                    this.isWrong = true;
                    this.choose = {
                        question: this.getItemRandom.question,
                        userChoose: userAnswer,
                        rightAnswer: this.filterRightAnswer // raccolgo in una variabile la risposta esatta
                    };
                    this.userLose.push(this.choose);
                    this.gameOver = true;
                }
            })

            this.userAnswer = userAnswer; // assegno alla stringa userAnswer la risposta dell'utente proveniente dal componente figlio

            this.cleanRadios();
        },

        cleanRadios() {
            // giro sull'array di risposte e le dichiaro non cliccate
            this.getAnswers.map(ans => {
                ans.isclicked = false;
                if (this.userAnswer === ans.answer) {

                    // cambio la proprietà 'isClicked' solo alla risposta selezionata
                    return ans.isclicked = true;
                }
            })

        },

        playAgain() {
            this.start = true; // booleano che mi permette di entrare nell'else della computed e far cambiare domanda
            this.getAnswers?.map(ans => { // col punto interrogativo evito di andare in errore nel caso non ci sia l'elemento randomico
                return ans.isclicked = false;
            })
            this.disabledRadio = false;
            this.disabledButton = false;
            this.isClicked = false;
            this.userAnswer = '';
            this.isExactly = false;
            this.isWrong = false;
            this.reactionTime = 15; // al cambio domanda imposto nuovamente il timer 
            if (!this.gameOver) this.startTimer(); // faccio partire il timer se la partita non è finita

        },

        // metodo per mostrare il risultato
        showResult() {
            this.result = true;
        },

    },

    created() {
        this.questionsUndone = [...questions]; // alla visualizzazione della pagina faccio una copia dell'array questions
        this.startTimer(); // faccio partire il timer alla visualizzazione della domanda
    }
};
</script>

<template>
    <div id="content-quiz h-100">
        <div v-if="!result">
            <div class="d-flex justify-content-center align-items-center mt-4">
                <figure>
                    <img src="../assets/img/mill.png" alt="millionaire">
                </figure>
            </div>

            <section id="question-content">

                <div class="container">
                    <!-- Se il gioco è finito mostro i risultati -->
                    <div v-if="gameOver && !userLose.length" class="d-flex justify-content-center">

                        <!-- button pe mostrare il punteggio -->
                        <div>
                            <button type="button" class="btn btn-secondary mt-2" @click="showResult()">Vai al
                                punteggio
                            </button>
                        </div>
                    </div>

                    <!-- ...altrimenti vado avanti col gioco -->
                    <div v-else>
                        <div class="content-question">
                            <question-game :question="getItemRandom"></question-game>

                            <!-- mostro il jackpot solo se il tempo non è scaduto e se l'utente non sbaglia risposta -->
                            <div v-if="(!finishTime && !disabledRadio) || (isExactly && isClicked)"
                                class="jackpot d-flex flex-column align-items-center">
                                <h5>Jackpot</h5>
                                <p><span v-if="userSumWin">$</span>{{ userSumWin }}</p>
                            </div>
                        </div>

                        <div class="content-options">
                            <answers-game :answers="getAnswers" :isExactly="isExactly" :isClicked="isClicked"
                                :isWrong="isWrong" :disabledRadio="disabledRadio" :disabledButton="disabledButton"
                                :finishTime="finishTime" :singleAnswerWin="singleAnswerWin"
                                :questionsUndone="questionsUndone" @user-choose="getUserAnswer" @continue-game="playAgain"
                                @game-over="showResult"></answers-game>

                            <div v-if="!finishTime" class="text-white timer">
                                <div
                                    class="d-flex flex-column align-items-center justify-content-center box-time text-primary">
                                    <h5>Time</h5>
                                    <div class="d-flex align-items-center justify-content-center mt-2">
                                        <i v-if="!isClicked" class="fa-solid fa-hourglass-half fa-beat-fade fa-2x me-2"></i>
                                        <h2>{{ reactionTime }}s </h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>

        <!-- resoconto della partita -->
        <div v-else>
            <result-report :finishTime="finishTime" :userLose="userLose" :userWin="userWin" :userSumWin="userSumWin"
                :singleAnswerWin="singleAnswerWin" :choose="choose"></result-report>
        </div>
    </div>
</template>

<style scoped lang="scss">
#content-quiz {
    height: 100%;
}

#question-content {
    padding: 2rem;
    background-color: darkblue;
}

.content-question {
    position: relative;

    .jackpot {
        width: 170px;
        height: 70px;
        background-color: goldenrod;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 2px 2px darkgray;

        position: absolute;
        right: -2rem;
        bottom: 0;
    }
}


.content-options {
    position: relative;

    .timer {
        position: absolute;
        right: -2rem;
        bottom: 6rem;
    }
}

.box-time {
    width: 100px;
    height: 100px;
    background-color: whitesmoke;
    padding: 10px;
    box-shadow: 2px 2px darkgray;
    border-radius: 5px;
}


@media screen and (max-width: 992px) {
    .content-question {
        position: relative;

        .jackpot {
            width: 140px;
            height: 70px;
            position: absolute;
            left: -2rem;
            bottom: -30rem;
        }

    }

    .content-options {
        position: relative;

        .timer {
            position: absolute;
            right: -3rem;
            bottom: -3rem;
        }
    }
}
</style>