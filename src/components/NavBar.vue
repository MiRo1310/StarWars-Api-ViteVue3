<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';

import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { paginationData } = storeToRefs(store)

const emit = defineEmits(["generatePaginationList", "loadInfo"])



</script>
<template>
    <nav class="mt-2 mb-10">
        <ul class="mx-4">
            <StarWarsNav v-for="elementOfListToShow in paginationData.paginationListtoShow "
                :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow"
                @loadInfo="emit('loadInfo', $event)" />
        </ul>
        <PaginationVue />
    </nav>
</template>