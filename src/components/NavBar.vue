<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';

import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import Utils from '../lib/Utils';
const store = useStore()
const { paginationData } = storeToRefs(store)

const emit = defineEmits(["generatePaginationList"])

</script>
<template>
    <nav class="mt-2 mb-10">
        <ul class="mx-4">
            <StarWarsNav v-for="elementOfListToShow in paginationData.paginationListtoShow "
                :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow" @loadInfo="Utils.loadInfo($event)" />
        </ul>
        <PaginationVue />
    </nav>
</template>