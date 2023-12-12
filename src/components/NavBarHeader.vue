<script setup>
import stringJs from "../lib/string";
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import Utils from "../lib/Utils";

const store = useStore()
const { pageData } = storeToRefs(store)
let response = storeToRefs(store).response;

const activeLink = (key) => {
    if (key === pageData.value.actualCategory)
        return "button--primary-active"
    else {
        return "button--primary"
    }
}
</script>

<template>
    <template v-for="(item, key) in response.data" :key="key.item">
        <a class="button button--link mx-4 pt-1 lg:text-3xl lg:pb-3 md:text-xs md:px-1 md:pb-2 sm:text-xl text-xxs sm:px-2 rounded-lg my-1"
            href="#" v-on:click="Utils.loadNav(key, 1)" :class="activeLink(key)">{{
                stringJs.firstLetterToUpperCase(key)
            }}
        </a>
    </template>
</template>