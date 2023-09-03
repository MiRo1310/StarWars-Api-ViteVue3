<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';


const emit = defineEmits(["generatePaginationList", "paginate", "loadInfo"])
const props = defineProps(["paginationListtoShow", "nameOfInfo",])

let generatePagList = (a, b, c) => {
    emit('generatePaginationList', a, b, c)
}
</script>
<template>
    <nav class="mt-2 mb-10">
        <ul class="mx-4">
            <StarWarsNav v-for="elementOfListToShow in paginationListtoShow" :elementOfListToShow="elementOfListToShow"
                :key="elementOfListToShow" :nameOfInfo="props.nameOfInfo" @loadInfo="emit('loadInfo', $event)" />
        </ul>
        <PaginationVue @generatePaginationList="generatePagList" @paginate="emit('paginate', $event)" />
    </nav>
</template>