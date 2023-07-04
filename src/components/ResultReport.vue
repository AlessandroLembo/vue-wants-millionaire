<script>
import { questions } from "../data";
export default {
    name: "ResultReport",
    props: {
        finishTime: Boolean,
        userLose: Array,
        userWin: Array,
        userSumWin: Number,
        singleAnswerWin: Number,
        choose: Object,
        withdraw: Boolean
    },
    data() {
        return {
            questions,
        }
    },


}
</script>

<template>
    <div>
        <h1 class="text-center result-text mt-5">PUNTEGGIO TOTALE</h1>
        <div class="result container mt-5">
            <div class="me-3 text-center">

                <!-- partita persa per mancata risposta dell'utente -->
                <div v-if="finishTime">
                    <p class="text-danger size-text">Non hai fatto in tempo a rispondere</p>
                </div>

                <!-- caso in cui l'utente decide di ritirarsi dal gioco -->
                <div v-if="withdraw">
                    <p class="size-text text-success">Hai deciso di ritirarti dal gioco..Porti a casa ${{ userSumWin }}</p>
                </div>

                <!-- caso in cui l'utemte dà tutte le risposte esatte -->
                <p v-if="!userLose.length && !withdraw" class="size-text text-success">Complimenti, hai vinto!!! Hai
                    risposto
                    esattamente a
                    tutte e {{ userWin.length }} le domande. Porti a casa ${{ userSumWin }}</p>

                <!-- caso in cui l'utente sbaglia al primo colpo -->
                <p v-else-if="!userWin.length" class="size-text">Brutto risultato!!! Purtroppo il tuo gioco si ferma al {{
                    userLose.length }}° step.</p>

                <!-- caso in cui l'utente sbaglia l'ultima domanda -->
                <p v-else-if="userLose.length && userWin.length === questions.length - 1" class="size-text">
                    Peccato, eri a un passo dalla vittoria, ti
                    sei fermato all'ultimo scalino!!
                </p>

                <!-- l'utente risponde esattamente ad almeno una domanda ma si ferma almeno a due risposte dalla fine -->
                <div v-else-if="userLose.length && userWin.length < questions.length - 1">
                    <p class="size-text">
                        Hai risposto esattamente a {{
                            userWin.length }}
                        <span v-if="userWin.length === 1">sola domanda</span>
                        <span v-else>domande</span>
                    </p>
                </div>

                <!-- mostro la risposta sbagliata e l'opzione che sarebbe stata giusta -->
                <div v-if="!finishTime">
                    <ul v-for="choose in userLose" :key="choose.userAnswer">
                        <li v-if="userWin.length < questions.length - 1" class="list-group-item">
                            <p class="size-text">La tua scalata si è fermata qui:</p>
                        </li>
                        <li class="list-group-item size-text">Alla domanda {{ `"${choose.question}"` }} hai
                            risposto
                            <span class="text-danger">{{ choose.userChoose }}. </span>
                            <span>La risposta corretta era <span class="text-success">{{
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
</template>

<style scoped lang="scss">
.result-text {
    color: darkgoldenrod;
    font-size: 60px;
    font-weight: bold;
}

.size-text {
    font-size: 40px;
}

.result {
    background-color: aliceblue;
    min-height: 100px;
    border: 10px solid darkgoldenrod;
    padding: 1rem;

}
</style>