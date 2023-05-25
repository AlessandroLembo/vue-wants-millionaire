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
            start: false,
            gameOver: false,
            lastQuestion: false,
            result: false,
            userWin: [],
            userLose: [],
        }
    },
    computed: {
        // ottenere una domanda random dall'array questions
        getItemRandom() {
            const item = questions[Math.floor(Math.random() * questions.length)];
            const index = questions.indexOf(item);

            if (!this.start) { // Appena iniziato il gioco gestisco i movimenti negli array delle domande fatte e non fatte
                this.questionsDone.push(item);
                questions.splice(index, 1);
            } else if (questions.length >= 1) {
                this.start = false; // con il booleano gestiso il cambio domanda passando alla successiva
                this.questionsDone.push(item);
                questions.splice(index, 1);
            } else {
                this.lastQuestion = true;
            }

            if (this.lastQuestion) this.gameOver = true; // ..dopo aver risposto all'ultima domanda
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

            // giro sull'aarray di risposte e controllo...
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

    }
};
</script>

<template>
    <div class="content-quiz h-100">
        <div class="box-image">
            <img src="../assets/img/millionaire.jpg" class="img-fluid" alt="millionaire">
        </div>
        <div class="question-content">
            <div class="container">
                <!-- Se il gioco è finito mostro i risultati -->
                <div v-if="gameOver" class="d-flex justify-content-center">

                    <!-- button pe mostrare il punteggio -->
                    <!-- TODO: FARLO DIVENTARE UN ROUTER LINK CHE PORTA ALLA PAGINA DEI RISULTATI -->
                    <button v-if="!result" type="button" class="btn btn-secondary mt-2" @click="showResult()">Vai al
                        punteggio
                    </button>

                    <!-- resoconto della partita -->
                    <div v-else>
                        <div class="result">
                            <div class="me-3">
                                <!-- caso in cui l'utemte dà tutte le risposte esatte -->
                                <h3 v-if="!userLose.length">Complimenti!!! Hai risposto esattamente a
                                    tutte e {{ userWin.length }} le domande.</h3>

                                <!-- almeno una risposta esatta... ma anche almeno una sbagliata... -->
                                <div v-else-if="userWin.length && userLose.length">
                                    <h3>Hai risposto esattamente a {{ userWin.length }}
                                        <span v-if="userWin.length === 1">sola domanda</span>
                                        <span v-else>domande</span>
                                    </h3>

                                    <ul v-for="choose in userWin" :key="choose.userChoose">
                                        <li class="list-group-item">Alla domanda {{ `"${choose.question}"`
                                        }} hai
                                            risposto con <span class="text-success">{{ choose.userChoose
                                            }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- caso in cui l'utente dà tutte le risposte sbagliate -->
                                <h3 v-if="!userWin.length">Brutto risultato!!! Purtroppo ha sbagliato tutte e {{
                                    userLose.length }} le risposte.</h3>

                                <!-- almeno una risposta esatta... ma anche almeno una sbagliata... -->
                                <div v-else-if="userWin.length && userLose.length">
                                    <h3 v-if="userLose.length === 1">Buona prova, hai sbagliato solo {{
                                        userLose.length
                                    }}
                                        risposta</h3>
                                    <h3 v-else>Purtroppo hai sbagliato {{ userLose.length }} risposte</h3>

                                </div>

                                <!-- mostro le risposte sbagliate e l'opzione che sarebbe stata giusta -->
                                <ul v-for="choose in userLose" :key="choose.userAnswer">
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

                <!-- ...altrimenti vado avanti col gioco -->
                <div v-else>
                    <question-game :question="getItemRandom"></question-game>

                    <answers-game :answers="getAnswers" :isExactly="isExactly" :isClicked="isClicked" :isWrong="isWrong"
                        :disabledRadio="disabledRadio" :disabledButton="disabledButton" @user-choose="getUserAnswer"
                        @continue-game="playAgain"></answers-game>
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

.result {
    background-color: aliceblue;
    min-height: 100px;
    border: 10px solid darkgoldenrod;
    padding: 1rem;
}
</style>