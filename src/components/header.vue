<script setup>
import NavBarHeader from './NavBarHeader.vue'
import DropDownConfig from './DropDownConfig.vue'
import stringJs from '../lib/string';
import { computed } from 'vue';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';

const store = useStore()
const pageData = storeToRefs(store).pageData

const emit = defineEmits(["dropDown"])

const confirmReload = () => {
    store.setValuePageData(true, "showDialogConfirm")
    store.setValuePageData(false, "dropdown")
}

const header = computed(() => {
    if (pageData.value.isStarting) return "lg:h-48 md:h-44 h-40"
})

const showLoadingText = computed(() => {
    return pageData.value.isLoading === true
})

const dropDownConfig = (val) => {
    if (val == "switch") {
        store.pageData.dropdown = !store.pageData.dropdown
    }
    else { store.pageData.dropdown = val }
};
const loadSide = () => {
    store.setValuePageData(true, "isStarting")
    store.setValuePageData(null, "actualCategory")
    store.setValuePageData(null, "actualItem")
}

</script>
<template>
    <header class="bg--header  border-b-4 border--header border-double pb-4 fixed w-full pt-0 top-0 p-10 text-center"
        :class="header">
        <h1 class="lg:text-5xl font--primary md:text-3xl sm:text-xl xxs:text-xl text-center md:m-3 inline-block rounded-md">
            <span class="cursor-pointer" v-on:click="loadSide">Star Wars
            </span>
        </h1>
        <p v-if="showLoadingText">Loading...</p>
        <p v-if="pageData.isReloading" class="font--primary animate-fade">Data will be
            reloaded!</p>

        <nav class="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-3 justify-center ">
            <NavBarHeader />
        </nav>

        <p v-if="!pageData.isStarting"
            class="font--primary lg:text-xl md:text-sm sm:text-xl xxs:text-xs md:p-2 md:mb-3 mb-4  text-center">
            {{
                store.records
            }} {{
    stringJs.firstLetterToUpperCase(pageData.actualCategory)
}} of the
            Star Wars Universe</p>

        <div class="absolute top-2 right-2 text-right" @mouseleave="dropDownConfig(false)">
            <button class="button--icon" type="button" @click="dropDownConfig('switch')" @mouseenter="dropDownConfig(true)"
                title="Config">
                <font-awesome-icon icon="fa-solid fa-gear" class="icon--fontAwesome" />
            </button>
            <DropDownConfig v-if="pageData.dropdown" class="bg--dropdown absolute right-0 xs:w-56 w-40"
                @confirmReload="confirmReload()" />
        </div>
    </header>
</template>