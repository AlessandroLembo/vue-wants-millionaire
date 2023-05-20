<script>
import { questions } from "../data";

export default {
    name: "QuestionGame",
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
        filterAnswer() {
            const rightAns = [];
            this.getAnswers.filter(ans => {
                if (ans.rightAnswer) rightAns.push(ans.answer);
            })
            const [rigAns] = rightAns; // prendo dall'array la stringa e la salvo in una variabile
            return rigAns;
        }

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
            let choose = {};

            if (this.getAnswers[i].answer === this.userAnswer && this.getAnswers[i].rightAnswer) {
                this.isExactly = true;
                choose = {
                    question: this.getItemRandom.question,
                    userAnswer: this.userAnswer,
                }
                this.userWin.push(choose);

                // risposta sbagliata da parte dell'utente
            } else if (this.getAnswers[i].answer === this.userAnswer && !this.getAnswers[i].rightAnswer) {
                this.isExactly = false;
                this.isWrong = true;
                choose = {
                    question: this.getItemRandom.question,
                    userAnswer: this.userAnswer,
                    rightAnswer: this.filterAnswer // valore restituito dalla computed è la risposta giusta a ogni domanda
                };
                this.userLose.push(choose);
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
    <div class="content-quiz">
        <div class="row justify-content-center">
            <div class="col-12">
                <img src="../assets/img/millionaire.jpg" class="img-fluid" alt="millionaire">
                <div class="question-content">
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
                                            <span v-if="userWin.length === 1">domanda</span>
                                            <span v-else>domande</span>
                                        </h3>

                                        <ul v-for="choose in userWin" :key="choose.userAnswer">
                                            <li class="list-group-item m-0">Alla domanda {{ `"${choose.question}"`
                                            }} hai
                                                risposto con <span class="text-success">{{ choose.userAnswer
                                                }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <!-- caso in cui l'utente dà tutte le risposte sbagliate -->
                                    <h3 v-if="!userWin.length">Brutto risultato!!! Purtroppo ha sbagliato tutte e {{
                                        userLose.length }} le risposte.</h3>

                                    <!-- almeno una risposta esatta... ma anche almeno una sbagliata... -->
                                    <div v-else-if="userWin.length && userLose.length">
                                        <h3 v-if="userLose.length === 1">Buona prova, hai sbagliato solo {{ userLose.length
                                        }}
                                            risposta</h3>
                                        <h3 v-else>Purtroppo hai sbagliato {{ userLose.length }} risposte</h3>

                                    </div>

                                    <!-- mostro le risposte sbagliate e l'opzione che sarebbe stata giusta -->
                                    <ul v-for="choose in userLose" :key="choose.userAnswer">
                                        <li class="list-group-item m-0">Alla domanda {{ `"${choose.question}"` }} hai
                                            risposto
                                            <span class="text-danger">{{ choose.userAnswer }}. </span>
                                            <span>La risposta corretta era <span class="text-success">{{
                                                choose.rightAnswer }}</span></span>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ...altrimenti vado avanti col gioco -->
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


                            <!-- alert che da un feedback in caso di risposta sbagliata -->
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

.result {
    background-color: aliceblue;
    min-height: 100px;
    border: 10px solid darkgoldenrod;
    padding: 1rem;
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