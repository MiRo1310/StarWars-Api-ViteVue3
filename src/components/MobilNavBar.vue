<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';
import { ref } from 'vue';

const emit = defineEmits(["generatePaginationList", "paginate", "loadInfo"])
const props = defineProps(["paginationListtoShow", "nameOfInfo",])

const mobilNav = ref(false)
const showMobilNav = (val) => {
    if (val == "switch") { mobilNav.value = !mobilNav.value }
    else { mobilNav.value = val }
}
let generatePagList = (a, b, c) => {
    emit('generatePaginationList', a, b, c)
}
const loadInfoAndHideNav = (val) => {
    mobilNav.value = false;
    emit('loadInfo', val)
}
</script>
<template>
    <nav @mouseleave="showMobilNav(false)" class="fixed top-24 left-2 ">
        <button class="button--icon" type="button" title="Navigation" @click="showMobilNav('switch')"
            @mouseenter="showMobilNav(true)">
            <font-awesome-icon icon="fa-solid fa-bars" class="icon--fontAwesome" />
        </button>

        <div class="absolute top-8 w-56 h-96 text-left overflow-y-auto scrollbar bg--main rounded-md " v-if="mobilNav">
            <ul>
                <StarWarsNav class="mx-4" v-for="elementOfListToShow in paginationListtoShow"
                    :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow" :nameOfInfo="props.nameOfInfo"
                    @loadInfo="loadInfoAndHideNav" />
            </ul>
            <PaginationVue @generatePaginationList="generatePagList" @paginate="emit('paginate', $event)" />
        </div>
    </nav>
</template>