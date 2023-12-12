<script setup>
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { search } = storeToRefs(store)
</script>

<template>
    <p v-if="store.searchedRecords && search.showSearch && store.searchedRecords != 0"
        class=" inline-block text-right px-8">{{
            store.searchedRecords
        }} Results</p>
    <p v-else v-if="search.showSearch && store.isSearchedText" class=" inline-block text-right px-8">No
        Results</p>
    <button v-if="search.showSearch && store.isSearchedText" @click="store.hideSearch()"
        class="button button--hide fixed md:right-16 right-3 lg:top-48 md:top-40 top-36 " type="button">X</button>
</template>