<script setup>
import stringJs from "../lib/string";

const emit = defineEmits(["loadNav"])
const props = defineProps(["response", "pageName"])

const activeLink = (key) => {
    if (key === props.pageName)
        return "button--primary-active"
    else {
        return "button--primary"
    }
}

</script>

<template>
    <template v-for="(item, key) in props.response.data" :key="key.item">
        <a class="button button--link mx-4 pt-1 lg:text-3xl lg:pb-3 md:text-xs md:px-1 md:pb-2 sm:text-xl text-xxs sm:px-2 rounded-lg my-1"
            href="#" v-on:click="emit('loadNav', [key, 1])" :class="activeLink(key)">{{
                stringJs.firstLetterToUpperCase(key)
            }}
        </a>
    </template>
</template>