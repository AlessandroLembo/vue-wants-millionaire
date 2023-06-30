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
            timer: null,
            reactionTime: 15,
            finishTime: false,
            choose: {},
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

            // disabilito i radios e dichiaro che è stat selezionata una risposta
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
                        <question-game :question="getItemRandom"></question-game>

                        <div class="content-options">
                            <answers-game :answers="getAnswers" :isExactly="isExactly" :isClicked="isClicked"
                                :isWrong="isWrong" :disabledRadio="disabledRadio" :disabledButton="disabledButton"
                                :finishTime="finishTime" @user-choose="getUserAnswer" @continue-game="playAgain"
                                @game-over="showResult"></answers-game>

                            <div v-if="!isClicked" class="text-white timer">
                                <div
                                    class="d-flex flex-column align-items-center justify-content-center box-time text-primary">
                                    <h5>Time</h5>
                                    <div class="d-flex align-items-center justify-content-center mt-2">
                                        <i class="fa-solid fa-hourglass-half fa-beat-fade fa-2x me-2"></i>
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
            <h1 class="text-center result-text mt-5">PUNTEGGIO TOTALE</h1>
            <div class="result container mt-5">
                <div class="me-3 text-center">

                    <!-- partita persa per mancata risposta dell'utente -->
                    <div v-if="finishTime">
                        <h2 class="text-danger">Non hai fatto in tempo a rispondere</h2>
                    </div>

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

                    <!-- mostro la risposta sbagliata e l'opzione che sarebbe stata giusta -->
                    <div v-if="!finishTime">
                        <ul v-for="choose in userLose" :key="choose.userAnswer">
                            <li v-if="userWin.length < questions.length - 1" class="list-group-item">
                                <h4>La tua scalata si è fermata qui:</h4>
                            </li>
                            <li class="list-group-item">Alla domanda {{ `"${choose.question}"` }} hai
                                risposto
                                <span class="text-danger fs-3">{{ choose.userChoose }}. </span>
                                <span>La risposta corretta era <span class="text-success fs-3">{{
                                    choose.rightAnswer }}</span></span>
                            </li>
                        </ul>
                    </div>

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
#content-quiz {
    height: 100%;
}

#question-content {
    padding: 2rem;
    background-color: darkblue;
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

@media screen and (max-width: 992px) {
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