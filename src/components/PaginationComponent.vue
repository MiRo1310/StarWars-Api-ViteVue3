<script setup>
import { ref } from 'vue';
const emits = defineEmits(['update:modelValue', 'paginate'])
const props = defineProps(['modelValue', 'records', 'perPage',])
const side = ref(props.modelValue)
console.log(props.modelValue)

const activeSide = (page) => {
    if (side.value == page) {
        return "active"
    }
}
const changePage = (page) => {
    side.value = page
    // emits('update:modelValue', page)
}
</script>

<template>
    <nav class="ml-4">
        <ul class="VuePagination__pagination pagination">
            <li class="VuePagination__pagination-item disabled ">
                <button type="button" class="page-link" disabled="">&lt;&lt;</button>
            </li>
            <li class="VuePagination__pagination-item   VuePagination__pagination-item-prev-page page-item disabled">
                <button type="button" class="page-link">&lt;</button>
            </li>
            <li v-for="page in 10" class="VuePagination__pagination-item page-item " :class="activeSide(page, side)">
                <button class="page-link " :class="activeSide(page)" @click="changePage(page)">{{
                    page
                }}</button>
            </li>
            <li
                class="VuePagination__pagination-item  page-item   VuePagination__pagination-item-next-page VuePagination__pagination-item-next-page ">
                <button type="button" class="page-link">&gt;</button>
            </li>
            <li
                class="VuePagination__pagination-item  page-item VuePagination__pagination-item-next-page page-item  VuePagination__pagination-item-next-chunk disabled">
                <button type="button" class="page-link" disabled="">&gt;&gt;</button>
            </li>
        </ul>
        <p class="VuePagination__count">Showing 1 to 10 of {{ props.records }} records</p>
    </nav>

</template>