<script setup>
import DisplaySearch from './DisplaySearch.vue';
import stringJs from "../lib/string"
import Utils from '../lib/Utils';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { response } = storeToRefs(store)
</script>

<template>
    <form @submit="Utils.searchForUserInput()" class="mb-1">
        <select @change="Utils.searchForUserInput()" @click="store.showSearch()" id="selectItem" name="searchItem"
            class="search--input" value="global" title="In which Category you want to search?">
            <option value="global">Global</option>
            <option v-for="item of Object.keys(response.data)" :value=item>{{ stringJs.firstLetterToUpperCase(item) }}
            </option>
        </select>
        <input @keyup="Utils.searchForUserInput()" @click="store.showSearch()" @change="Utils.searchForUserInput()"
            type="text" id="searchedText" autocomplete="on" placeholder="Type in" class="search--input "
            title="What are you looking for?" spellcheck="false">
        <button @click="[store.hideSearch(), store.setSearchData('', 'searchedText')]"
            class="button--primary ml-1 px-1 no-underline md:text-sm text-xxs md:h-6 h-4" type="reset">Reset</button>
    </form>
    <DisplaySearch />
</template>