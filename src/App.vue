<script setup>
import StarWarsInfo from './components/StarWarsInfo.vue'
import SearchVue from './components/SearchVue.vue'
import NavBar from './components/NavBar.vue'
import MobilNavBar from './components/MobilNavBar.vue'
import ConfirmDialog from './components/confirmDialog.vue'
import footerVue from './components/footer.vue'
import headerVue from './components/header.vue'
import WelcomeVue from './components/welcome.vue'

import { computed, onMounted, watch } from 'vue'
import dataJs from "./lib/data";

import { useResponsive } from "./composables/useResponsive"
const { isMobile } = useResponsive()

import { storeToRefs } from 'pinia'
import { useStore } from "./store/store"
const store = useStore()
const { pageData } = storeToRefs(store)

watch(
  () => store.pageData.darkMode,
  (val) => {
    dataJs.saveToLocalStorage(val, "starwars_darkMode");
    store.setValuePageData(false, "dropdown");
    const htmlTag = document.querySelector("html");
    if (val) htmlTag.classList.add("dark");
    else htmlTag.classList.remove("dark");
  }
);

onMounted(async () => {
  const savedValue = await dataJs.loadLocalStorage("starwars")
  const savedDarkMode = await dataJs.loadLocalStorage("starwars_darkMode")
  if (!savedValue || Object.keys(savedValue.data).length == 0) {
    console.log('There is no data in "LocalStorage", it will be load from the API!')
    dataJs.getData(pageData.value.apiURL)
  } else {
    console.log("Data is loaded from LocalStorage!")
    store.setResponse(savedValue);
    store.setValuePageData(false, "isLoading")
  }
  if (savedDarkMode) store.setValuePageData(savedDarkMode, "darkMode")
  console.log("DarkMode wird auf " + store.pageData.darkMode + " gesetzt!")
})

const selectPic = computed(() => {
  return `/img/${pageData.value.actualCategory}.jpg`
})

const selectAltAttributePicture = computed(() => {
  return pageData.value.actualCategory
})

const positionSearch = computed(() => {
  if (pageData.value.isStarting) return "bottom-0"
  else return "bottom-1"
})
</script>

<template>
  <headerVue />
  <main class="lg:pt-60 md:pt-48 pt-40">
    <div class="grid md:grid-cols-4 grid-cols-1 w-full">
      <NavBar v-if="(!pageData.isStarting && !pageData.errorLoadPage && !isMobile)" />
      <div class="col-span-3 w-full" v-if="!pageData.isStarting && pageData.itemInfoPage != null">
        <div class="md:w-3/4 md:mx-auto ml-2 w-full  lg:top-60 md:top-48 top-36 fixed">
          <StarWarsInfo class="scrollbar" />
        </div>
      </div>
      <div class="fixed md:right-14 right-2 top-28 md:top-32 lg:top-40" :class="positionSearch">
        <SearchVue />
      </div>
      <MobilNavBar v-if="isMobile && !pageData.isStarting" />
      <div>
        <div class=" col-span-3 fixed -z-10  text-center mt-5 md:w-3/4 w-full ">
          <img v-if="!pageData.isStarting && pageData.itemInfoPage == null"
            class="md:w-10/12 lg:px-24 xxs:w-3/4  xxs:mx-auto mx-auto lg:my-0 my-10 -z-10 " :src="selectPic"
            :alt="selectAltAttributePicture">
        </div>
      </div>
    </div>
    <ConfirmDialog v-if="pageData.showDialogConfirm" class="fixed md:left-1/3 left-10 top-48" />
    <WelcomeVue />
  </main>
  <footerVue />
</template>
<style>
@import "./assets/tailwind.css";
@import "./assets/css/main.css";
@import "./assets/css/scrollbar.css";
@import "./assets/css/pagination.css";
</style>