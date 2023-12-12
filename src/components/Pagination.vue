<script setup>
import { ref } from '@vue/reactivity';
import { useStore } from '../store/store';
import Utils from "../lib/Utils";
const store = useStore()
const pagePagination = ref(1);
let perPage = ref(store.paginationData.itemsPerPage)
const paginate = (page) => {
    Utils.generatePaginationList(null, page, null)
}
</script>
<template>
    <pagination v-model="pagePagination" :records="store.records" :perPage="perPage" @paginate="paginate" />

    <select name="select1" class="mx-4 mt-2 mb-5 bg--PaginationSelect" v-model.number="perPage"
        v-on:change="Utils.generatePaginationList(null, null, perPage)">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
    </select>
</template>
