<script setup>
import { watch, ref } from 'vue';
const props = defineProps(["errorLoadPage", "start"])
let errorLoadPage = ref(false)
let start = ref(true)
watch(() => props.start, () => {
    start.value = props.start
})
watch(() => props.errorLoadPage, () => {
    errorLoadPage.value = props.errorLoadPage
})
</script>
<template>
    <p v-if="errorLoadPage" class="font--primary text-center lg:text-3xl  md:text-xl sm:text-xs xxs:text-xs">
        Error on loading page the data
        from
        the API !!! Please retry
        later!</p>
    <div class="font--primary" v-if="start">
        <h2 class="text-center mt-2 lg:text-4xl  md:text-3xl sm:text-xl xxs:text-xs">Welcome to my
            project!!!</h2>
        <p class="lg:text-3xl md:text-xl sm:text-xl xxs:text-xs mx-5 text-center">This is a project to visualize data of
            the
            <span class="text-yellow-700 ">"SWAPI
                The Star Wars API"</span>. I´m using: Vite with Vue.js 3, Tailwind and AXIOS
        </p>

        <img class="lg:w-1/2 w-3/4 m-auto mt-8" src="../assets/img/star-wars-main.jpg" alt="Darth Vader">
    </div>
</template>