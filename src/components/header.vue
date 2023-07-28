<script setup>
import NavBarHeader from './NavBarHeader.vue'
import DropDownConfig from './DropDownConfig.vue'
import stringJs from '../lib/string';
import { computed, ref, watch } from 'vue';

const props = defineProps(["start", "response", "pageName", "loading", "reloaded", "dropDown"])
const emit = defineEmits(["loadSide", "loadNav", "switchDarkLightMode", "showDialogConfirm", "dropDown"])

let showDialogConfirm = ref()

const confirmReload = () => {
    emit('showDialogConfirm', true)
    showDialogConfirm.value = true
    emit('dropDown', false)
    dropDown.value = false
}

const header = computed(() => {
    if (props.start) return "lg:h-48 md:h-44 h-40"
})

let loading = ref(true)
let reloaded = ref()
watch(() => props.reloaded, () => {
    reloaded.value = props.reloaded
})
watch(() => props.loading, () => {
    loading.value = props.loading
})
const showLoadingText = computed(() => {
    return loading.value === true
})

let dropDown = ref(false);
const dropDownConfig = (val) => {
    if (val == "switch") { dropDown.value = !dropDown.value }
    else { dropDown.value = val }
};
</script>
<template>
    <header class="bg--header  border-b-4 border--header border-double pb-4 fixed w-full pt-0 top-0 p-10 text-center"
        :class="header">
        <h1 class="lg:text-5xl font--primary md:text-3xl sm:text-xl xxs:text-xl text-center md:m-3 inline-block rounded-md">
            <span class="cursor-pointer" v-on:click="emit('loadSide')">Star Wars
            </span>
        </h1>
        <p v-if="showLoadingText">Loading...</p>
        <p v-if="reloaded" class="font--primary animate-fade">Data will be
            reloaded!</p>

        <nav class="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-3 justify-center ">
            <NavBarHeader :response="props.response" :pageName="props.pageName"
                @loadNav="emit('loadNav', $event[0], $event[1])" />
        </nav>

        <p v-if="!start"
            class="font--primary lg:text-xl md:text-sm sm:text-xl xxs:text-xs md:p-2 md:mb-3 mb-4  text-center">
            {{
                props.response.data[pageName].count
            }} {{
    stringJs.firstLetterToUpperCase(pageName)
}} of the
            Star Wars Universe</p>

        <div class="absolute top-2 right-2 text-right" @mouseleave="dropDownConfig(false)">
            <button class="button--icon" type="button" @click="dropDownConfig('switch')" @mouseenter="dropDownConfig(true)"
                title="Config">
                <font-awesome-icon icon="fa-solid fa-gear" class="icon--fontAwesome" />
            </button>
            <DropDownConfig v-if="dropDown" class="bg--dropdown absolute right-0 xs:w-56 w-40"
                @confirmReload="confirmReload()" @switchDarkLightMode="emit('switchDarkLightMode')" />
        </div>
    </header>
</template>