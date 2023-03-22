<script setup>
import StarWarsInfo from './components/StarWarsInfo.vue'
import SearchVue from './components/SearchVue.vue'
import NavBar from './components/NavBar.vue'
import MobilNavBar from './components/MobilNavBar.vue'
import ConfirmDialog from './components/confirmDialog.vue'
import footerVue from './components/footer.vue'
import headerVue from './components/header.vue'
import WelcomeVue from './components/welcome.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import Utils from "./lib/Utils";
import dataJs from "./lib/data";
import JediUtils from "./lib/jedi"


const apiURL = "https://swapi.py4e.com/api/";
const displayWidth = ref(0)

let response = reactive({
  data: {},
  darkMode: true,
  itemsPerPage: 10
});

onMounted(async () => {
  displayWidth.value = window.innerWidth
  window.addEventListener("resize", () => {
    displayWidth.value = window.innerWidth
  });

  const savedValue = await dataJs.loadLocalStorage("starwars")
  if (!savedValue || Object.keys(savedValue.data).length == 0) {
    console.log('There is no data in "LocalStorage", it will be load from the API!')
    getData(apiURL)
  } else {
    console.log("Data is loaded from LocalStorage!")
    switchDarkLightMode(savedValue.darkMode)
    console.log("DarkMode wird auf " + savedValue.darkMode + " gesetzt!")
    itemsPerPage.value = savedValue.itemsPerPage
    response = savedValue;
    dataJs.saveToLocalStorage(response, "starwars")
    loading.value = false;
    console.log(response);
  }
})

let pagePagination = ref(1);
const paginate = (pageNumber) => {
  pagePagination.value = pageNumber
  generatePaginationList(pageName.value, pageNumber)
}

const records = computed(() => {
  return response.data[pageName.value].count
})

let start = ref(true);
const loadSide = () => {
  console.log("loadSide")
  start.value = true
  pageName.value = null
  nameOfInfo.value = null
}

let itemsPerPage = ref(10);
let paginationListtoShow = ref([]);
let cat

const generatePaginationList = (category, page, itemsPerPageFromComponet) => {
  if (itemsPerPageFromComponet) {
    itemsPerPage.value = itemsPerPageFromComponet
    response.itemsPerPage = itemsPerPageFromComponet
    dataJs.saveToLocalStorage(response, "starwars")
  }
  if (page) {
    pagePagination.value = page
    cat = category
  }
  paginationListtoShow.value = response.data[cat].data.slice(0 + (pagePagination.value - 1) * itemsPerPage.value, itemsPerPage.value * pagePagination.value)
}

let actualPage = ref(null);
let itemInfoPage = ref(null);
const loadNav = (pName, pageNumber) => {
  pageName.value = pName
  actualPage.value = null
  start.value = false
  generatePaginationList(pName, pageNumber)
  itemInfoPage.value = null
}

let errorLoadPage = ref(false);
const getData = async (url) => {
  try {
    const result = await dataJs.inizializeDataFetching(url)
    if (result) {
      response.data = result
      dataJs.saveToLocalStorage(response, "starwars");
    } else {
      errorLoadPage.value = true
    }
    setTimeout(() => {
      reloaded.value = false
    }, 3000)
    loading.value = false;
    console.log(response)

  } catch (e) {
    console.log(e)
  }
}
let nameOfInfo = ref(null)
const loadInfo = (url) => {
  console.log("loadinfo")

  start.value = false
  const category = JediUtils.getCategory(url, apiURL)
  itemInfoPage.value = response.data[category].data.find((element) => element.url == url)
  nameOfInfo.value = itemInfoPage.value.name || itemInfoPage.value.title
  pageName.value = category
  let arrayOfItem = response.data[category].data
  generatePaginationList(category, Math.ceil((arrayOfItem.indexOf(arrayOfItem.find((element) => element.url == itemInfoPage.value.url)) + 1) / itemsPerPage.value)
  )
}

const selectPic = computed(() => {
  return `/img/${pageName.value}.jpg`
})

let pageName = ref("");
const selectAltAttributePicture = computed(() => {
  return pageName.value
})

let loading = ref(true)

const reloaded = ref(false);
const reloadData = () => {
  reloaded.value = true
  getData(apiURL)
  console.log("Data will be reloaded!")
}

const displaySmall = computed(() => {
  return (displayWidth.value < 768)
});
const dropDownVar = ref();
const dropDown = (val) => {
  dropDownVar.val = val
}
function switchDarkLightMode(val) {
  response.darkMode = Utils.switchDarkLightMode(val, response)
  dataJs.saveToLocalStorage(response, "starwars")
  dropDownVar.value = false
}


const showDialogConfirmVar = ref(false)
const showDialogConfirm = (val) => {
  showDialogConfirmVar.value = val
}
const showConfirm = computed(() => {
  return showDialogConfirmVar.value
})

const confirm = (val) => {
  showDialogConfirmVar.value = false
  if (val) reloadData()
}
const positionSearch = computed(() => {
  if (start.value) return "bottom-0"
  else return "bottom-1"
})
</script>

<template>
  <headerVue :start="start" :response="response" :loading="loading" :pageName="pageName" :reloaded="reloaded"
    @loadSide="loadSide" @loadNav="loadNav" @switchDarkLightMode="switchDarkLightMode"
    @showDialogConfirm="showDialogConfirm" @dropDown="dropDown" />

  <main class="lg:pt-60 md:pt-48 pt-40">
    <div class="grid md:grid-cols-4 grid-cols-1 w-full">

      <NavBar v-if="(!start && !errorLoadPage && !displaySmall)" @generatePaginationList="generatePaginationList"
        @paginate="paginate" @loadInfo="loadInfo" :paginationListtoShow="paginationListtoShow" :nameOfInfo="nameOfInfo"
        :records="records" :itemsPerPage="itemsPerPage" />

      <div class="col-span-3 w-full" v-if="!start && itemInfoPage != null">
        <div class="md:w-3/4 md:mx-auto ml-2 w-full  lg:top-60 md:top-48 top-36 fixed">
          <StarWarsInfo class="scrollbar" :response="response.data" :page="pageName" :itemInfoPage="itemInfoPage"
            :apiURL="apiURL" @loadInfo="loadInfo" />
        </div>
      </div>

      <div class="fixed md:right-14 right-2 top-28 md:top-32 lg:top-40" :class="positionSearch">
        <SearchVue :response.data="response.data" :apiURL="apiURL" @loadInfo="loadInfo" />
      </div>

      <MobilNavBar v-if="displaySmall && !start" @generatePaginationList="generatePaginationList" @paginate="paginate"
        @loadInfo="loadInfo" :paginationListtoShow="paginationListtoShow" :nameOfInfo="nameOfInfo" :records="records"
        :itemsPerPage="itemsPerPage" />

      <div>
        <div class=" col-span-3 fixed -z-10  text-center mt-5 md:w-3/4 w-full ">
          <img v-if="!start && itemInfoPage == null"
            class="md:w-10/12 lg:px-24 xxs:w-3/4  xxs:mx-auto mx-auto lg:my-0 my-10 -z-10 " :src="selectPic"
            :alt="selectAltAttributePicture">
        </div>
      </div>
    </div>
    <ConfirmDialog v-if="showConfirm" class="fixed md:left-1/3 left-10 top-48" @confirm="confirm" />
    <WelcomeVue :error-load-page="errorLoadPage" :start="start" />
  </main>
  <footerVue />
</template>
<style>
@import "./assets/tailwind.css";
@import "./assets/css/main.css";
@import "./assets/css/scrollbar.css";
@import "./assets/css/pagination.css";
</style>

