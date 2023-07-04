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
            userSumWin: 0,
            withdraw: false
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

            if (!this.questionsUndone.length) this.gameOver = true;
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

        // metodo per interrompere la partita e ritirare il montepremi
        getJackpot() {
            this.withdraw = true;
            this.showResult();
        },

        // metodo per mostrare il risultato
        showResult() {
            this.result = true;
            clearInterval(this.timer);
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

                    <div>
                        <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center">
                            <question-game :question="getItemRandom"></question-game>

                            <div class="content-info">
                                <!-- mostro il jackpot solo se il tempo non è scaduto e se l'utente non sbaglia risposta -->
                                <div v-if="(!finishTime && !disabledRadio) || (isExactly && isClicked)"
                                    class="jackpot row flex-column flex-xl-row justify-content-center align-items-center m-0 me-2">
                                    <div class="col-7 p-0">
                                        <div class="d-flex flex-column">
                                            <h5 class="fw-bold">JACKPOT</h5>
                                            <p class="fs-4 m-0 sum-win d-flex justify-content-center"
                                                :class="[isExactly ? 'sum-update' : '']"><span v-if="userSumWin">$</span>{{
                                                    userSumWin }}</p>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class="d-flex justify-content-center mt-2">
                                            <button type="button" class="btn btn-outline-primary p-1 fw-bold"
                                                @click="getJackpot()">RITIRA
                                                MONTEPREMI</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- scompare il timer solo quando scade il tempo -->
                                <div v-if="!finishTime"
                                    class="d-flex flex-column align-items-center justify-content-center box-time text-primary">
                                    <h5>Time</h5>
                                    <div class="d-flex align-items-center justify-content-center mt-2">
                                        <i v-if="!isClicked" class="fa-solid fa-hourglass-half fa-beat-fade fa-2x me-2"></i>
                                        <h2>{{ reactionTime }}s </h2>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <answers-game :answers="getAnswers" :isExactly="isExactly" :isClicked="isClicked" :isWrong="isWrong"
                            :disabledRadio="disabledRadio" :disabledButton="disabledButton" :finishTime="finishTime"
                            :singleAnswerWin="singleAnswerWin" :questionsUndone="questionsUndone" :gameOver="gameOver"
                            :userLose="userLose" @user-choose="getUserAnswer" @continue-game="playAgain"
                            @game-over="showResult"></answers-game>

                        <div class="content-options">


                        </div>

                    </div>
                </div>
            </section>

        </div>

        <!-- resoconto della partita -->
        <div v-else>
            <result-report :finishTime="finishTime" :userLose="userLose" :userWin="userWin" :userSumWin="userSumWin"
                :singleAnswerWin="singleAnswerWin" :choose="choose" :withdraw="withdraw"></result-report>
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

.content-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .jackpot {
        background-color: goldenrod;
        padding: 1rem;
        border-radius: 5px;
    }

    .box-time {
        width: 100px;
        background-color: whitesmoke;
        padding: 10px;
        box-shadow: 2px 2px darkgray;
        border-radius: 5px;
    }
}

.sum-win {
    height: 40px;
    width: 110px;
    border: 2px solid darkblue;
    border-radius: 5px;

}

.sum-update {
    animation-name: bump;
    animation-duration: 0.2s;
    animation-iteration-count: 5;
    animation-direction: alternate;
}

@keyframes bump {
    from {
        transform: scale(1);
    }

    to {
        transform: scale(1.2);
    }
}
</style>