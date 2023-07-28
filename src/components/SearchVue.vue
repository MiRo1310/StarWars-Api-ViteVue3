<script setup>
import DisplaySearch from './DisplaySearch.vue';
import { ref, computed, toRef } from 'vue'
import Utils from "../lib/Utils";
import JediUtils from "../lib/jedi"
import stringJs from "../lib/string"

const props = defineProps(["response", "apiURL"])
const emit = defineEmits(["loadInfo"])

const filteredElements = ref([])
const response = toRef(props, 'response')

const showSearch = ref(false)

const results = ref(0)
const resultsFound = computed(() => {
    results.value = filteredElements.value.length
    return filteredElements.value.length > 0
})

const noValueToSearch = computed(() => {
    return searchedText.value != ""
})

const loadInfo = (url) => {
    emit("loadInfo", url)
    showSearch.value = false
}

const findItem = (category, text) => {
    let filteredElements = []
    response.value[category].data.forEach(element => {
        const array = Object.entries(element);
        // Wenn das Element eine Array ist soll es als Text definert werden
        array.forEach((element) => {
            if (Array.isArray(element[1])) {
                let intermediateValue = []
                element[1].forEach(element => {
                    intermediateValue.push(JediUtils.getNameorTitle(element, props.apiURL, props.response))
                });
                array[array.indexOf(element)][1] = intermediateValue.join(" , ")
            }
            else if (element[1] != null && typeof element[1] !== "number" && element[1].includes("https")) {
                array[array.indexOf(element)] = JediUtils.getNameorTitle(element[1], props.apiURL, props.response)
            }
            else if (["created", "edited", "release_date"].includes(element[0])) {
                array[array.indexOf(element)][1] = Utils.getDate(element[1])
            }
        })
        array.forEach(element => {
            if (Array.isArray(element)) array[array.indexOf(element)] = element.join(" : ")
        });
        let filteredElementsOfOneArray = array.filter(value => {
            if (value) return value.toString().toLowerCase().indexOf(text.toLowerCase()) != -1
        })
        if (filteredElementsOfOneArray.length != 0) {
            filteredElements.push({
                search: filteredElementsOfOneArray.join(" "),
                name: element.name || element.title,
                url: element.url,
                category: category
            })
        }
    })
    return filteredElements
}

let searchedText = ref("")

const search = () => {
    showSearch.value = true
    filteredElements.value = []
    let searchedCategory = document.getElementById("selectItem").value
    searchedText.value = document.getElementById("searchedText").value
    if (searchedText.value != "") {
        // Globale Abfrage
        if (searchedCategory === "global") {
            for (let element in response.value) {
                findItem(element, searchedText.value).forEach(element => {
                    filteredElements.value.push(element)
                })
            }
        }
        // Abfrage eines bestimmten Items
        else {
            filteredElements.value = findItem(searchedCategory, searchedText.value)
        }

    } else {
        showSearch.value = false
    }
}

const displaySearch = (val) => {
    showSearch.value = val
}
</script>

<template>
    <form @submit="search()" class="mb-1">
        <select @change="search()" @click="showSearch = true" id="selectItem" name="searchItem" class="search--input"
            value="global" title="In which Category you want to search?">
            <option value="global">Global</option>
            <option v-for="item of Object.keys(response)" :value=item>{{ stringJs.firstLetterToUpperCase(item) }}
            </option>
        </select>
        <input @keyup="search()" @click="[showSearch = true]" @change="search()" type="text" id="searchedText"
            autocomplete="on" placeholder="Type in" class="search--input " title="What are you looking for?"
            spellcheck="false">
        <button @click="[showSearch = false, searchedText = '', results = 0]"
            class="button--primary ml-1 px-1 no-underline md:text-sm text-xxs md:h-6 h-4" type="reset">Reset</button>
    </form>
    <DisplaySearch @loadInfo="loadInfo" @displaySearch="displaySearch" :resultsFound="resultsFound" :results="results"
        :showSearch="showSearch" :noValueToSearch="noValueToSearch" :filteredElements="filteredElements"
        :searchedText="searchedText" />
</template>