<script setup>
import { ref } from '@vue/reactivity';
const props = defineProps(["records", "perPage"])
const emit = defineEmits(["generatePaginationList", "paginate"])
const pagePagination = ref(1);
let perPage = ref(props.perPage)
const pag = (event) => {
    emit('paginate', event)
}
</script>
<template>

    <pagination v-model="pagePagination" :records="props.records" :perPage="perPage" @paginate="pag($event)" />

    <select name="select1" class="mx-4 mt-2 mb-5 bg--PaginationSelect" v-model.number="perPage"
        v-on:change="emit('generatePaginationList', null, null, perPage)">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
    </select>
</template>
