<script setup>
import DisplaySearch from './DisplaySearch.vue';
import { ref, computed } from 'vue'
import Utils from "../lib/Utils";
import stringJs from "../lib/string"
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { response } = storeToRefs(store)

const filteredElements = ref([])

const results = ref(0)
const resultsFound = computed(() => {
    results.value = filteredElements.value.length
    return filteredElements.value.length > 0
})

const noValueToSearch = computed(() => {
    return searchedText.value != ""
})

let searchedText = ref("")

const search = () => {
    store.showSearch()
    filteredElements.value = []
    let searchedCategory = document.getElementById("selectItem").value
    searchedText.value = document.getElementById("searchedText").value
    if (searchedText.value != "") {
        // Globale Abfrage
        if (searchedCategory === "global") {
            for (let element in response.value.data) {
                Utils.findItem(element, searchedText.value).forEach(element => {
                    filteredElements.value.push(element)
                })
            }
        }
        // Abfrage eines bestimmten Items
        else {
            filteredElements.value = Utils.findItem(searchedCategory, searchedText.value)
        }

    } else {
        store.hideSearch()
    }
}

</script>

<template>
    <form @submit="search()" class="mb-1">
        <select @change="search()" @click="store.showSearch()" id="selectItem" name="searchItem" class="search--input"
            value="global" title="In which Category you want to search?">
            <option value="global">Global</option>
            <option v-for="item of Object.keys(response.data)" :value=item>{{ stringJs.firstLetterToUpperCase(item) }}
            </option>
        </select>
        <input @keyup="search()" @click="store.showSearch()" @change="search()" type="text" id="searchedText"
            autocomplete="on" placeholder="Type in" class="search--input " title="What are you looking for?"
            spellcheck="false">
        <button @click="[store.hideSearch(), searchedText = '', results = 0]"
            class="button--primary ml-1 px-1 no-underline md:text-sm text-xxs md:h-6 h-4" type="reset">Reset</button>
    </form>
    <DisplaySearch @displaySearch="displaySearch" :resultsFound="resultsFound" :results="results" :showSearch="showSearch"
        :noValueToSearch="noValueToSearch" :filteredElements="filteredElements" :searchedText="searchedText" />
</template>