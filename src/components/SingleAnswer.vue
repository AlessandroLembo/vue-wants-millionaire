<script>

export default {
    name: "SingleAnswer",
    props: {
        answer: Object,
        disabledRadio: Boolean,
    },
    data() {
        return {
            userAnswer: ''
        }
    },

    computed: {
        getA() {
            console.log(this.userAnswer);
            return this.answer
        }
    },

    emits: ['user-choose'],


}
</script>

<template>
    <!-- tramite prop ricevo l'oggetto answer generato dal giro sull'array e stampo la risposta in pagina -->
    <div class="row justify-content-center justify-content-md-start align-items-center h-100">
        <input type="radio" class="col-12 col-md-6 mx-md-4 mx-1 choose-user" :id="answer.answer" :value="answer.answer"
            v-model="userAnswer" name="city" @change="$emit('user-choose', userAnswer)" :disabled="disabledRadio">
        <label :for="answer.answer" class="col-12 col-md-6">
            <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                <p class="m-0 fs-6 city-option">{{ answer.answer.toUpperCase() }}</p>
            </div>
        </label>
    </div>
</template>

<style scoped lang="scss">
.choose-user {
    width: 25px;
    height: 25px;
    border-radius: 50%;
}

.city-option {
    color: white;
}
</style>