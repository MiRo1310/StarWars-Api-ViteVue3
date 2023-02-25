<script setup>
import { ref, watch } from 'vue';
import PaginationComponent from './PaginationComponent.vue';
const props = defineProps(["records", "perPage", "pagePagination"])
const emit = defineEmits(["generatePaginationList", "paginate"])
let perPage = ref(props.perPage)
let page = ref(1)
watch(() => props.pagePagination, (val) => {
    page.value = val
})
</script>
<template>
    <pagination-component v-model="page" :records="props.records" :perPage="props.perPage"
        @paginate="emit('paginate', $event)" />

    <select name="select1" class="mx-4 mt-2 mb-5 bg--PaginationSelect" v-model.number="perPage"
        v-on:change="emit('generatePaginationList', null, null, perPage)">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
    </select>
</template>
