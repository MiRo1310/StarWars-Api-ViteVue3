<script setup>
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const props = defineProps(["start"])
const pageData = storeToRefs(store).pageData

</script>
<template>
    <p v-if="pageData.errorLoadPage" class="font--primary text-center lg:text-3xl  md:text-xl sm:text-xs xxs:text-xs">
        Error on loading page the data
        from
        the API !!! Please retry
        later!</p>
    <div class="font--primary" v-if="pageData.isStarting">
        <h2 class="text-center mt-2 lg:text-4xl  md:text-3xl sm:text-xl xxs:text-xs">Welcome to my
            project!!!</h2>
        <p class="lg:text-3xl md:text-xl sm:text-xl xxs:text-xs mx-5 text-center">This is a project to visualize data of
            the
            <span class="text-yellow-700 ">"SWAPI
                The Star Wars API"</span>. I´m using: Vite with Vue.js 3, Tailwind, Pinia-Store and AXIOS
        </p>
        <img class="lg:w-1/2 w-3/4 m-auto mt-8" src="../assets/img/star-wars-main.jpg" alt="Darth Vader">
    </div>
</template>