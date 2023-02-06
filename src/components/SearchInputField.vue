<script setup>
import Utils from '../assets/js/Utils';
const emit = defineEmits(["search", "showsearch", ""])
const props = defineProps(["response"])

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
</template>