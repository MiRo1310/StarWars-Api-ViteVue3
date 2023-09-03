<script setup>
import StarWarsInfo from './components/StarWarsInfo.vue'
import SearchVue from './components/SearchVue.vue'
import NavBar from './components/NavBar.vue'
import MobilNavBar from './components/MobilNavBar.vue'
import ConfirmDialog from './components/confirmDialog.vue'
import footerVue from './components/footer.vue'
import headerVue from './components/header.vue'
import WelcomeVue from './components/welcome.vue'

import { ref, computed, onMounted, watch } from 'vue'
import Utils from "./lib/Utils";
import dataJs from "./lib/data";
import JediUtils from "./lib/jedi"

import { useResponsive } from "./composables/useResponsive"
const { isMobile } = useResponsive()

import { storeToRefs } from 'pinia'
import { useStore } from "./store/store"
const store = useStore()
const { pageData } = storeToRefs(store)

let response = storeToRefs(store).response;
let paginationData = storeToRefs(store).paginationData;

const apiURL = pageData.value.apiURL;

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
    getData(apiURL)
  } else {
    console.log("Data is loaded from LocalStorage!")
    console.log(savedValue)
    store.setResponse(savedValue);
    store.setValuePageData(false, "isLoading")
  }
  if (savedDarkMode) store.setValuePageData(savedDarkMode, "darkMode")
  console.log("DarkMode wird auf " + store.pageData.darkMode + " gesetzt!")
})

const paginate = (pageNumber) => {
  store.setPaginationData(pageNumber, "pagePagination")
  Utils.generatePaginationList(pageData.value.actualCategory, pageNumber)
}

const loadSide = () => {
  console.log("loadSide")
  store.setValuePageData(true, "isStarting")
  store.setValuePageData(null, "actualCategory")
  nameOfInfo.value = null
}

let actualPage = ref(null);
// let itemInfoPage = ref(null);
const loadNav = (pName, pageNumber) => {
  store.setValuePageData(pName, "actualCategory")
  actualPage.value = null
  store.setValuePageData(false, "isStarting")
  Utils.generatePaginationList(pName, pageNumber)
  store.setValuePageData(null, "itemInfoPage")
  // itemInfoPage.value = null
}

const getData = async (url) => {
  try {
    const result = await dataJs.inizializeDataFetching(url)
    if (result) {
      console.log(result)
      store.setResponse(result, "data")
      dataJs.saveToLocalStorage(response.value, "starwars");
    } else {
      store.setValuePageData(true, "errorLoadPage")
    }
    setTimeout(() => {
      store.setValuePageData(false, "isReloading")
    }, 3000)
    store.setValuePageData(false, "isLoading")
  } catch (e) {
    console.log(e)
  }
}
let nameOfInfo = ref(null)
const loadInfo = (url) => {
  store.setValuePageData(false, "isStarting")
  const category = JediUtils.getCategory(url, apiURL)
  store.setValuePageData(response.value.data[category].data.find((element) => element.url == url), "itemInfoPage")
  // itemInfoPage.value = 
  nameOfInfo.value = pageData.value.itemInfoPage.name || pageData.value.itemInfoPage.title
  store.setValuePageData(category, "actualCategory")
  let arrayOfItem = response.value.data[category].data
  Utils.generatePaginationList(category, Math.ceil((arrayOfItem.indexOf(arrayOfItem.find((element) => element.url == pageData.value.itemInfoPage.url)) + 1) / paginationData.value.itemsPerPage)
  )
}

const selectPic = computed(() => {
  return `/img/${pageData.value.actualCategory}.jpg`
})

const selectAltAttributePicture = computed(() => {
  return pageData.value.actualCategory
})

const reloadData = () => {
  store.setValuePageData(true, "isReloading")
  getData(apiURL)
  console.log("Data will be reloaded!")
}

const dropDownVar = ref();
const dropDown = (val) => {
  dropDownVar.val = val
}

const confirm = (val) => {
  store.setValuePageData(false, "showDialogConfirm")
  if (val) reloadData()
}
const positionSearch = computed(() => {
  if (pageData.value.isStarting) return "bottom-0"
  else return "bottom-1"
})
</script>

<template>
  <headerVue @loadSide="loadSide" @loadNav="loadNav" @dropDown="dropDown" />
  <main class="lg:pt-60 md:pt-48 pt-40">
    <div class="grid md:grid-cols-4 grid-cols-1 w-full">
      <NavBar v-if="(!pageData.isStarting && !pageData.errorLoadPage && !isMobile)"
        @generatePaginationList="Utils.generatePaginationList" @paginate="paginate" @loadInfo="loadInfo"
        :paginationListtoShow="paginationData.paginationListtoShow" :nameOfInfo="nameOfInfo" />
      <div class="col-span-3 w-full" v-if="!pageData.isStarting && pageData.itemInfoPage != null">
        <div class="md:w-3/4 md:mx-auto ml-2 w-full  lg:top-60 md:top-48 top-36 fixed">
          <StarWarsInfo class="scrollbar" @loadInfo="loadInfo" />
        </div>
      </div>
      <div class="fixed md:right-14 right-2 top-28 md:top-32 lg:top-40" :class="positionSearch">
        <SearchVue @loadInfo="loadInfo" />
      </div>
      <MobilNavBar v-if="isMobile && !pageData.isStarting" @generatePaginationList="Utils.generatePaginationList"
        @paginate="paginate" @loadInfo="loadInfo" :paginationListtoShow="paginationData.paginationListtoShow"
        :nameOfInfo="nameOfInfo" />
      <div>
        <div class=" col-span-3 fixed -z-10  text-center mt-5 md:w-3/4 w-full ">
          <img v-if="!pageData.isStarting && pageData.itemInfoPage == null"
            class="md:w-10/12 lg:px-24 xxs:w-3/4  xxs:mx-auto mx-auto lg:my-0 my-10 -z-10 " :src="selectPic"
            :alt="selectAltAttributePicture">
        </div>
      </div>
    </div>
    <ConfirmDialog v-if="pageData.showDialogConfirm" class="fixed md:left-1/3 left-10 top-48" @confirm="confirm" />
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