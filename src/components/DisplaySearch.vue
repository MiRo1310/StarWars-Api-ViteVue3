<script setup>
import DisplaySearchHeader from './DisplaySearchHeader.vue';
import stringJs from '../lib/string';
import Utils from '../lib/Utils';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { search } = storeToRefs(store)

const props = defineProps(["resultsFound",])

const loadInfo = (url) => {
    Utils.loadInfo(url)
    store.hideSearch()
}
</script>
<template>
    <div class="text-right search--result">
        <DisplaySearchHeader />
        <ul v-if="search.showSearch && store.searchedRecords && store.isSearchedText"
            class="search--result absolute px-1  right-0   text-right scrollbar pr-4 lg:max-h-[700px] md:max-h-[800px] max-h-96 min-w-[160px] lg:max-w-[500px] md:max-w-[350px] max-w-[200px] overflow-scroll border-black border-[1px]">
            <li class="mx-1"></li>
            <template v-if="search.showSearch && store.isSearchedText && store.searchedRecords"
                v-for="item in    search.filteredElements">
                <li class="font-bold my-2 mx-1">
                    <a href="#" @click="loadInfo(item.url)">
                        <template v-for="item in     stringJs.extractSearchFromText(item.name, search.searchedText)">
                            <span v-if="item.toLowerCase() != search.searchedText.toLowerCase() && item != ''">{{
                                item
                            }}</span>
                            <span v-else class="search--searchedText">{{ item }}</span>
                        </template>
                        <ul>
                            <li v-if="store.searchedRecords">
                                <p class="font-normal text-xs">Category: {{ item.category }}
                                </p>
                            </li>
                            <li class="text-xxs">
                                <template
                                    v-for="item in     stringJs.extractSearchFromText(item.search, search.searchedText)">
                                    <span v-if="item.toLowerCase() != search.searchedText.toLowerCase() && item != ''">{{
                                        item
                                    }}</span>
                                    <span v-else class="search--searchedText">{{ item }}</span>
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