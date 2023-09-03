<script setup>
import PaginationVue from './Pagination.vue';
import StarWarsNav from './StarWarsNav.vue';
import Utils from '../lib/Utils';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { paginationData, pageData } = storeToRefs(store)
// import { ref } from 'vue';

// const mobilNav = ref(false)
const showMobilNav = (val) => {
    if (val == "switch") { store.setValuePageData(!pageData.value.showMobilNav, "showMobilNav") }
    else { store.setValuePageData(val, "showMobilNav") }
}
const loadInfoAndHideNav = (val) => {
    store.setValuePageData(false, "showMobilNav")
    // mobilNav.value = false;
    Utils.loadInfo(val)
}
</script>
<template>
    <nav @mouseleave="showMobilNav(false)" class="fixed top-24 left-2 ">
        <button class="button--icon" type="button" title="Navigation" @click="showMobilNav('switch')"
            @mouseenter="showMobilNav(true)">
            <font-awesome-icon icon="fa-solid fa-bars" class="icon--fontAwesome" />
        </button>

        <div class="absolute top-8 w-56 h-96 text-left overflow-y-auto scrollbar bg--main rounded-md "
            v-if="pageData.showMobilNav">
            <ul>
                <StarWarsNav class="mx-4" v-for="elementOfListToShow in paginationData.paginationListtoShow "
                    :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow" @loadInfo="loadInfoAndHideNav" />
            </ul>
            <PaginationVue />
        </div>
    </nav>
</template>