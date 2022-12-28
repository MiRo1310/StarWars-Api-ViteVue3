<script setup>
import { ref, computed } from 'vue'

const props = defineProps(["response"])
const emit = defineEmits(["loadInfo"])
// import {firstLetterToUpperCase} from '../'


const filteredElements = ref([])
const response = props.response

const firstLetterToUpperCase = (name) => {
    return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
}

const extractSearchFromText = (text, searchFor) => {
    let lengthOfSearch;
    let textToLowerCase
    let array = []
    if (text && searchFor) {
        lengthOfSearch = searchFor.length
        textToLowerCase = text.toLowerCase()
        searchFor = searchFor.toLowerCase()
        let position;
        let positionBefor = 0;
        while (textToLowerCase.includes(searchFor)) {
            position = textToLowerCase.indexOf(searchFor)
            let placeholder = "/".repeat(lengthOfSearch)
            textToLowerCase = textToLowerCase.replace(searchFor, placeholder)
            if (text.slice(positionBefor, position) != "") array.push(text.slice(positionBefor, position))
            array.push(text.slice(position, position + lengthOfSearch))
            positionBefor = position + lengthOfSearch
        }
        array.push(text.slice(positionBefor, text.length))
    }

    if (array.length > 0) return array
    else return text
}
const showSearch = ref(false)
const searchDisplayed = computed(() => {
    return showSearch.value
})
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
    response.data[category].data.forEach(element => {
        const array = Object.values(element);
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
    // console.log(filteredElements)
    return filteredElements
}

let searchedText = ref("")

const search = () => {
    showSearch.value = true
    filteredElements.value = []
    let searchedCategory = document.getElementById("selectItem").value
    searchedText.value = document.getElementById("searchedText").value
    if (searchedText.value != "") {
        if (searchedCategory === "global") {
            for (let element in response.data) {
                findItem(element, searchedText.value).forEach(element => filteredElements.value.push(element))
            }
        }
        else {
            filteredElements.value = findItem(searchedCategory, searchedText.value)
        }
    }
    // console.log(filteredElements.value)
}


</script>

<template>
    <form @submit="search()">
        <select @change="search()" @click="showSearch = true" id="selectItem" name="searchItem"
            class="searchFieldsHeader" value="global">
            <!-- <option value="" selected disabled hidden>Choose here</option> -->
            <option value="global">Global</option>
            <option v-for="item of Object.keys(response.data)" :value=item>{{ firstLetterToUpperCase(item) }}
            </option>
        </select>
        <input @keyup="search()" @click="showSearch = true" type="text" id="searchedText" placeholder="Type in"
            class="searchFieldsHeader ">
        <button
            class="border-[1px] dark:border-yellow-400 border-blue-400 dark:text-yellow-400 text-blue-400 searchFieldsHeader"
            type="submit">Search</button>
    </form>
    <ul v-if="searchDisplayed"
        class="bg-white absolute px-1 text-black right-0 text-right pr-4 py-1 max-h-96 overflow-scroll">
        <li v-if="resultsFound">{{ results }} Results</li>
        <li v-if="!resultsFound && noValueToSearch">No Results</li>
        <li v-for="item in filteredElements" class="font-bold my-2 mx-1">
            <a href="#" @click="loadInfo(item.url)">
                <template v-for="item in extractSearchFromText(item.name, searchedText)">
                    <span v-if="item.toLowerCase() != searchedText.toLowerCase() && item != ''">{{ item }}</span>
                    <span v-else class="span-search">{{ item }}</span>
                </template>
                <ul>
                    <li v-if="resultsFound">
                        <p class="font-normal text-xs">Category: {{ item.category }}
                        </p>
                    </li>
                    <!-- <li>
                <span>{{ item.search }}</span>
                <template v-for="item in extractSearchFromText(item.search, searchedText)">
                  <span v-if="item.toLowerCase() != searchedText.toLowerCase() && item != ''">{{ item }}</span>
                  <span v-else class="span-search">{{ item }}</span>
                </template>
              </li> -->
                </ul>
            </a>
        </li>
    </ul>
</template>