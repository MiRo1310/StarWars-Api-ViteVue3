<script setup>
import { ref, watch } from 'vue';
import { useStore } from '../store/store';
import Utils from "../lib/Utils";
import PaginationComponent from './PaginationComponent.vue';
const store = useStore()

let perPage = ref(store.itemsPerPage)
</script>
<template>
    <pagination-component />

    <select name="select1" class="mx-4 mt-2 mb-5 bg--PaginationSelect" v-model="perPage"
        v-on:change="Utils.generatePaginationList(null, null, $event.target.value)">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
    </select>
</template>
