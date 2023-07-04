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
        choose: Object
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
                    <h2 class="text-danger size-text">Non hai fatto in tempo a rispondere</h2>
                </div>

                <!-- caso in cui l'utemte dà tutte le risposte esatte -->
                <h3 v-if="!userLose.length" class="size-text">Complimenti, hai vinto!!! Hai risposto esattamente a
                    tutte e {{ userWin.length }} le domande. Porti a casa ${{ userSumWin }}</h3>

                <!-- caso in cui l'utente sbaglia al primo colpo -->
                <h3 v-else-if="!userWin.length" class="size-text">Brutto risultato!!! Purtroppo il tuo gioco si ferma al {{
                    userLose.length }}° step.</h3>

                <!-- caso in cui l'utente sbaglia l'ultima domanda -->
                <h3 v-else-if="userLose.length && userWin.length === questions.length - 1" class="size-text">
                    Peccato, eri a un passo dalla vittoria, ti
                    sei fermato all'ultimo scalino!!
                </h3>

                <!-- l'utente risponde esattamente ad almeno una domanda ma si ferma almeno a due risposte dalla fine -->
                <div v-else-if="userLose.length && userWin.length < questions.length - 1">
                    <h3 class="size-text">
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
                            <h3 class="size-text">La tua scalata si è fermata qui:</h3>
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