<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { paginationData } = storeToRefs(store)

const emit = defineEmits(["generatePaginationList", "paginate", "loadInfo"])


let generatePagList = (a, b, c) => {
    emit('generatePaginationList', a, b, c)
}
</script>
<template>
    <nav class="mt-2 mb-10">
        <ul class="mx-4">
            <StarWarsNav v-for="elementOfListToShow in paginationData.paginationListtoShow "
                :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow"
                @loadInfo="emit('loadInfo', $event)" />
        </ul>
        <PaginationVue @generatePaginationList="generatePagList" @paginate="emit('paginate', $event)" />
    </nav>
</template>