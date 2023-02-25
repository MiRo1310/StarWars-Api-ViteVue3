<script setup>
import { computed, ref, watch } from 'vue';
const emits = defineEmits(['update:modelValue', 'paginate'])
const props = defineProps(['modelValue', 'records', 'perPage'])

let itemsPerPagination = 10

const startOfList = computed(() => {
    return side.value * perPage.value - (perPage.value - 1)
})
const endOfList = computed(() => {
    if (props.modelValue * perPage.value > props.records) return props.records
    else return props.modelValue * perPage.value
})
const showPagination = computed(() => {
    if (props.records > perPage.value) return true
})
// factorChunk 0 starts with page 1 to itemsPerPagination faktorChunk itemsPerPagination to +=
let faktorChunk = ref(0);
const lastSideOfList = computed(() => {
    if ((faktorChunk.value + 1) * itemsPerPagination * perPage.value > props.records) return Math.ceil(props.records / perPage.value) - 10 * faktorChunk.value
    else return 10
})

let side = ref(1)
const active = (page) => {
    if (side.value == (page + itemsPerPagination * faktorChunk.value)) {
        return "active"
    }
}
const changeByNumberClick = (page) => {
    newPage(page + itemsPerPagination * faktorChunk.value)
}
const newPage = (page) => {
    emits('paginate', page)
}
const moveSide = (val) => {
    newPage(side.value + val)
}
const pageNumber = (page) => {
    return page + itemsPerPagination * faktorChunk.value
}
const nextPreviousChunk = (val) => {
    faktorChunk.value += val
}
const disabled = (val) => {
    let value = null
    if (val == "buttonPreviusChunk") {
        value = 0
    }
    else if (val == "buttonNextChunk") {
        value = Math.ceil(props.records / props.perPage / itemsPerPagination) - 1
    }
    if (value >= 0 && value == faktorChunk.value) {
        return "disabled"
    }
    if (val == "buttonPreviousItem") {
        value = 1
    }
    else if (val == "buttonNextItem") {
        value = Math.ceil(props.records / props.perPage)
    }
    if (value && value == side.value) {
        return "disabled"
    }
}

watch(() => side.value, () => {
    if (side.value) faktorChunk.value = Math.floor(side.value / itemsPerPagination - 0.1)
})
let perPage = ref(props.perPage)
watch(() => props.perPage, () => {
    newPage(1)
    perPage.value = props.perPage
})
watch(() => props.modelValue, () => {
    side.value = props.modelValue
})

</script>

<template>
    <nav class="mx-4">
        <ul v-if="showPagination" class="VuePagination__pagination pagination">
            <li class="VuePagination__pagination-item ">
                <button type="button" class="page-link" @click="nextPreviousChunk(-1)"
                    :disabled="disabled('buttonPreviusChunk')" :class="disabled('buttonPreviusChunk')">&lt;&lt;</button>
            </li>
            <li class="VuePagination__pagination-item VuePagination__pagination-item-prev-page page-item">
                <button type="button" class="page-link" @click="moveSide(-1)" :disabled="disabled('buttonPreviousItem')"
                    :class="disabled('buttonPreviousItem')">&lt;</button>
            </li>
            <li v-for="page in lastSideOfList" class="VuePagination__pagination-item page-item " :class="active(page)">
                <button class="page-link " :class="active(page)" @click="changeByNumberClick(page)">{{
                    pageNumber(page)
                }}</button>
            </li>
            <li class="VuePagination__pagination-item  page-item   VuePagination__pagination-item-next-page">
                <button type="button" class="page-link" @click="moveSide(1)" :disabled="disabled('buttonNextItem')"
                    :class="disabled('buttonNextItem')">&gt;</button>
            </li>
            <li
                class="VuePagination__pagination-item  VuePagination__pagination-item-next-page page-item  VuePagination__pagination-item-next-chunk">
                <button type="button" class="page-link" @click="nextPreviousChunk(1)"
                    :disabled="disabled('buttonNextChunk')" :class="disabled('buttonNextChunk')">&gt;&gt;</button>
            </li>
        </ul>
        <p class="VuePagination__count">Showing {{ startOfList }} to {{
            endOfList }} of {{ props.records }} records
        </p>
    </nav>
</template>