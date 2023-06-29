<script>
import { questions } from "../data";
import QuestionGame from "./QuestionGame.vue";
import AnswersGame from "./AnswersGame.vue";
export default {
    name: "ContainerGame",
    components: { QuestionGame, AnswersGame },
    data() {
        return {
            questions,
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
            this.getAnswers.filter(ans => {
                if (ans.rightAnswer) rightAns.push(ans.answer);
            })
            const [rigAns] = rightAns; // prendo dall'array la stringa e la salvo in una variabile
            return rigAns;
        }

    },

    methods: {
        getUserAnswer(userAnswer) {

            // inizializzo il flag che utlizzo nel template con valore false
            this.isExactly = false;

            // disabilito i radios e dichiaro che è stat selezionata una risposta
            this.isClicked = true;
            this.disabledRadio = true;

            // Gestico l'attivazione del button continua 
            if (userAnswer) this.disabledButton = true;

            let choose = {};

            // giro sull'array di risposte e controllo...
            this.getAnswers.forEach(ans => {

                //...se la risposta equivale alla scelta dell'utente e la risposta è quella giusta..
                if (ans.answer === userAnswer && ans.rightAnswer) {
                    this.isExactly = true;
                    choose = {
                        question: this.getItemRandom.question,
                        userChoose: userAnswer
                    }
                    this.userWin.push(choose);

                    //...se la risposta equivale alla scelta dell'utente ma è sbagliata..
                } else if (ans.answer === userAnswer && !ans.rightAnswer) {
                    this.isExactly = false;
                    this.isWrong = true;
                    choose = {
                        question: this.getItemRandom.question,
                        userChoose: userAnswer,
                        rightAnswer: this.filterRightAnswer // raccolgo in una variabile la risposta esatta
                    };
                    this.userLose.push(choose);
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

        },

        // metodo per mostrare il risultato
        showResult() {
            this.result = true;
        }

    },

    created() {
        this.questionsUndone = [...questions]; // alla visualizzazione della pagina faccio una copia dell'array questions
    }
};
</script>

<template>
    <div class="content-quiz h-100">
        <div v-if="!result">
            <div class="box-image">
                <img src="../assets/img/millionaire.jpg" class="img-fluid" alt="millionaire">
            </div>
            <div class="question-content">
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
                        <div class="row flex-column flex-sm-row align-items-center justify-content-center">
                            <div class="col-sm-11">
                                <question-game :question="getItemRandom"></question-game>

                                <answers-game :answers="getAnswers" :isExactly="isExactly" :isClicked="isClicked"
                                    :isWrong="isWrong" :disabledRadio="disabledRadio" :disabledButton="disabledButton"
                                    @user-choose="getUserAnswer" @continue-game="playAgain"
                                    @game-over="showResult"></answers-game>
                            </div>
                            <div class="col-sm-1 text-white mt-2 d-flex justify-content-center">
                                <h3 @continue-game="playAgain">10</h3>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- resoconto della partita -->
        <div v-else>
            <h1 class="text-center result-text mt-5">PUNTEGGIO TOTALE</h1>
            <div class="result container mt-5">
                <div class="me-3">
                    <!-- caso in cui l'utemte dà tutte le risposte esatte -->
                    <h3 v-if="!userLose.length">Complimenti, hai vinto!!! Hai risposto esattamente a
                        tutte e {{ userWin.length }} le domande.</h3>

                    <!-- caso in cui l'utente sbaglia al primo colpo -->
                    <h3 v-else-if="!userWin.length">Brutto risultato!!! Purtroppo il tuo gioco si ferma al {{
                        userLose.length }}° step.</h3>

                    <!-- caso in cui l'utente sbaglia l'ultima domanda -->
                    <h3 v-else-if="userLose.length && userWin.length === questions.length - 1">
                        Peccato, eri a un passo dalla vittoria, ti
                        sei fermato all'ultimo scalino!!
                    </h3>

                    <!-- l'utente risponde esattamente ad almeno una domanda ma si ferma almeno a due risposte dalla fine -->
                    <div v-else-if="userLose.length && userWin.length < questions.length - 1">
                        <h3>
                            Hai risposto esattamente a {{
                                userWin.length }}
                            <span v-if="userWin.length === 1">sola domanda</span>
                            <span v-else>domande</span>
                        </h3>
                    </div>

                    <!-- mostro le risposte sbagliate e l'opzione che sarebbe stata giusta -->
                    <ul v-for="choose in userLose" :key="choose.userAnswer">
                        <li v-if="userWin.length < questions.length - 1" class="list-group-item">
                            <h4>La tua scalata si è fermata qui:</h4>
                        </li>
                        <li class="list-group-item">Alla domanda {{ `"${choose.question}"` }} hai
                            risposto
                            <span class="text-danger">{{ choose.userChoose }}. </span>
                            <span>La risposta corretta era <span class="text-success">{{
                                choose.rightAnswer }}</span></span>
                        </li>
                    </ul>

                </div>
                <div class="d-flex justify-content-end">
                    <a href="http://localhost:8080/"><button type="button" class="btn btn-warning">Nuova
                            partita</button></a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content-quiz {
    height: 100%;
}

.question-content {
    padding: 2rem;
    background-color: darkblue;
}

.result-text {
    color: darkgoldenrod;
    font-size: 60px;
    font-weight: bold;
}

.result {
    background-color: aliceblue;
    min-height: 100px;
    border: 10px solid darkgoldenrod;
    padding: 1rem;
}
</style>