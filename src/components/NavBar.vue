<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';

import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { paginationData } = storeToRefs(store)

const emit = defineEmits(["generatePaginationList"])

</script>
<template>
    <nav class="mt-2 mb-10">
        <ul class="mx-4">
            <StarWarsNav v-for="elementOfListToShow in paginationData.paginationListtoShow "
                :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow" />
        </ul>
        <PaginationVue :records="props.records" :perPage="props.itemsPerPage" :pagePagination="props.pagePagination"
            @generatePaginationList="generatePagList" @paginate="emit('paginate', $event)" />
    </nav>
</template>