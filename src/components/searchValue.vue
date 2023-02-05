<script setup>
import { ref, computed, reactive, toRef } from 'vue'
import Utils from "../assets/js/Utils";

const props = defineProps(["response", "apiURL"])
const emit = defineEmits(["loadInfo"])



const filteredElements = ref([])
const response = toRef(props, 'response')

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
const getCategory = (url) => {
    let element = url.replace(props.apiURL, "")
    return element.slice(0, element.indexOf("/"))
}

const loadNameOrTitle = (url) => {
    let nameOrTitle = "";
    let item = "";
    item = response.value[getCategory(url)].data.find((element) => element.url == url)

    if (item.name) nameOrTitle = item.name
    if (item.title) nameOrTitle = item.title

    return nameOrTitle
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
                    intermediateValue.push(loadNameOrTitle(element))
                });
                array[array.indexOf(element)][1] = intermediateValue.join(" , ")
            }

            else if (element[1] != null && typeof element[1] !== "number" && element[1].includes("https")) {
                array[array.indexOf(element)] = loadNameOrTitle(element[1])
            }

            else if (["created", "edited", "release_date"].includes(element[0])) {

                array[array.indexOf(element)][1] = getDate(element[1])
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
const getDate = (value) => {
    let date = new Date(value)
    if (value.includes("T")) return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    else return `${date.toLocaleDateString()}`
}

</script>

<template>
    <form @submit="search()" class="mb-1">
        <select @change="search()" @click="showSearch = true" id="selectItem" name="searchItem"
            class="searchFieldsHeader" value="global" title="In which Category you want to search?">
            <option value="global">Global</option>
            <option v-for="item of Object.keys(response)" :value=item>{{ Utils.firstLetterToUpperCase(item) }}
            </option>
        </select>
        <input @keyup="search()" @click="[showSearch = true]" @change="search()" type="text" id="searchedText"
            autocomplete="on" placeholder="Type in" class="searchFieldsHeader " title="What are you looking for?"
            spellcheck="false">
        <button @click="[showSearch = false, searchedText = '', results = 0]"
            class="coloredButton ml-1 px-1 no-underline md:text-sm text-xxs md:h-6 h-4 border-yellow-100"
            type="reset">Reset</button>
    </form>
    <div class="text-right">
        <p v-if="resultsFound && searchDisplayed && results != 0"
            class="inline-block text-right text-black bg-white px-8">{{
                results
            }} Results</p>
        <p v-else v-if="showSearch && searchedText != ''" class="inline-block text-right text-black bg-white  px-8">No
            Results</p>
        <button v-if="showSearch && searchedText != ''" @click="showSearch = false"
            class="fixed md:right-16 right-5 lg:top-48 md:top-40 top-40 border bg-white  border-black text-black hover:text-yellow-400 hover:border-yellow-400 h-4 w-4 text-xxs"
            type="button">X</button>
        <ul v-if="showSearch && resultsFound"
            class="bg-white absolute px-1 text-black right-0   text-right scrollbar pr-4 lg:max-h-[700px] md:max-h-[800px] max-h-96 min-w-[160px] lg:max-w-[500px] md:max-w-[350px] max-w-[200px] overflow-scroll border-black border-[1px]">

            <li class="mx-1"></li>
            <template v-if="searchDisplayed && noValueToSearch && resultsFound" v-for="item in     filteredElements">
                <li class="font-bold my-2 mx-1">
                    <a href="#" @click="loadInfo(item.url)">
                        <template v-for="item in     extractSearchFromText(item.name, searchedText)">
                            <span v-if="item.toLowerCase() != searchedText.toLowerCase() && item != ''">{{
                                item
                            }}</span>
                            <span v-else class="span-search">{{ item }}</span>
                        </template>
                        <ul>
                            <li v-if="resultsFound">
                                <p class="font-normal text-xs">Category: {{ item.category }}
                                </p>
                            </li>
                            <li class="text-xxs">
                                <template v-for="item in     extractSearchFromText(item.search, searchedText)">
                                    <span v-if="item.toLowerCase() != searchedText.toLowerCase() && item != ''">{{
                                        item
                                    }}</span>
                                    <span v-else class="span-search">{{ item }}</span>
                                </template>
                            </li>
                        </ul>
                    </a>
                </li>
                <li>
                    <hr>
                </li>
            </template>
        </ul>
    </div>

</template>