<script setup>
import stringJs from '../lib/string';
import Utils from '../lib/Utils';
import { useStore } from '../store/store';
const store = useStore()

const props = defineProps(["resultsFound", "results", "noValueToSearch", "filteredElements", "searchedText"])

const loadInfo = (url) => {
    Utils.loadInfo(url)
    store.hideSearch()
}
</script>
<template>
    <div class="text-right search--result">
        <p v-if="props.resultsFound && store.pageData.showSearch && props.results != 0"
            class=" inline-block text-right px-8">{{
                results
            }} Results</p>
        <p v-else v-if="store.pageData.showSearch && props.searchedText != ''" class=" inline-block text-right px-8">No
            Results</p>
        <button v-if="store.pageData.showSearch && props.searchedText != ''" @click="store.hideSearch()"
            class="button button--hide fixed md:right-16 right-3 lg:top-48 md:top-40 top-36 " type="button">X</button>
        <ul v-if="store.pageData.showSearch && props.resultsFound && props.searchedText != ''"
            class="search--result absolute px-1  right-0   text-right scrollbar pr-4 lg:max-h-[700px] md:max-h-[800px] max-h-96 min-w-[160px] lg:max-w-[500px] md:max-w-[350px] max-w-[200px] overflow-scroll border-black border-[1px]">

            <li class="mx-1"></li>
            <template v-if="store.pageData.showSearch && props.noValueToSearch && props.resultsFound"
                v-for="item in     props.filteredElements">
                <li class="font-bold my-2 mx-1">
                    <a href="#" @click="loadInfo(item.url)">
                        <template v-for="item in     stringJs.extractSearchFromText(item.name, props.searchedText)">
                            <span v-if="item.toLowerCase() != props.searchedText.toLowerCase() && item != ''">{{
                                item
                            }}</span>
                            <span v-else class="search--searchedText">{{ item }}</span>
                        </template>
                        <ul>
                            <li v-if="props.resultsFound">
                                <p class="font-normal text-xs">Category: {{ item.category }}
                                </p>
                            </li>
                            <li class="text-xxs">
                                <template
                                    v-for="item in     stringJs.extractSearchFromText(item.search, props.searchedText)">
                                    <span v-if="item.toLowerCase() != props.searchedText.toLowerCase() && item != ''">{{
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