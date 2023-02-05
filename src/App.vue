<script setup>
import StarWarsInfo from './components/StarWarsInfo.vue'
import DropDownConfig from './components/DropDownConfig.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import SearchValueVue from './components/SearchValue.vue'
import NavBar from './components/NavBar.vue'
import MobilNavBar from './components/MobilNavBar.vue'
import NavBarHeader from './components/NavBarHeader.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import Utils from "./assets/js/Utils";

const apiURL = "https://swapi.py4e.com/api/";
const title = "star wars"
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

  const savedValue = await Utils.loadLocalStorage("starwars")
  if (!savedValue || Object.keys(savedValue.data).length == 0) {
    console.log('There is no data in "LocalStorage", it will be load from the API!')
    getData(apiURL)
  } else {
    console.log("Data is loaded from LocalStorage!")
    switchDarkLightMode(savedValue.darkMode)
    console.log("DarkMode wird auf " + savedValue.darkMode + " gesetzt!")
    itemsPerPage.value = savedValue.itemsPerPage
    response = savedValue;
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
    Utils.saveToLocalStorage(response, "starwars")
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
  const result = await Utils.getDataFromApi(url)
  console.log(result)
  if (result) {
    response.data = result
    Utils.saveToLocalStorage(response, "starwars");
  } else {
    errorLoadPage.value = true
  }
  setTimeout(() => {
    reloaded.value = false
  }, 3000)
  loading.value = false;
  console.log(response)
}

const getCategory = (url) => {
  let element = url.replace(apiURL, "")
  return element.slice(0, element.indexOf("/"))
}

let nameOfInfo = ref(null)

const loadInfo = (url) => {
  start.value = false
  itemInfoPage.value = response.data[getCategory(url)].data.find((element) => element.url == url)
  nameOfInfo.value = itemInfoPage.value.name || itemInfoPage.value.title
  pageName.value = getCategory(url)
  let arrayOfItem = response.data[getCategory(url)].data
  generatePaginationList(getCategory(url), Math.ceil((arrayOfItem.indexOf(arrayOfItem.find((element) => element.url == itemInfoPage.value.url)) + 1) / itemsPerPage.value)
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
const showLoadingText = computed(() => {
  return loading.value === true
})

let dropDown = ref(false);
const dropDownConfig = (val) => {
  if (val == "switch") { dropDown.value = !dropDown.value }
  else { dropDown.value = val }
};

const reloaded = ref(false);
const reloadData = () => {
  reloaded.value = true
  getData(apiURL)
  console.log("Data will be reloaded!")
}

const displaySmall = computed(() => {
  return (displayWidth.value < 768)
});

function switchDarkLightMode(val) {
  response.darkMode = Utils.switchDarkLightMode(val, response.darkMode)
  Utils.saveToLocalStorage(response, "starwars")
}

const showDialogConfirm = ref(false)
const showConfirm = computed(() => {
  return showDialogConfirm.value
})

const confirm = (val) => {
  showDialogConfirm.value = false
  if (val) reloadData()
}
const confirmReload = () => {
  console.log("Show Confirm Dialog")
  showDialogConfirm.value = true
}

const positionSearch = computed(() => {
  if (start.value) return "bottom-0"
  else return "bottom-1"
})
const header = computed(() => {
  if (start.value) return "lg:h-48 md:h-44 h-40"
})

</script>

<template>
  <header
    class="bgHeader fontColorGlobal border-b-4 dark:border-yellow-400 border-yellow-600 border-double pb-4 fixed w-full pt-0 top-0 p-10 text-center"
    :class="header">
    <h1 class="lg:text-5xl  md:text-3xl sm:text-xl xxs:text-xl text-center md:m-3 inline-block rounded-md">
      <span class="cursor-pointer" v-on:click="loadSide()">{{
        title.toLocaleUpperCase()
      }}</span>
    </h1>
    <p v-if="showLoadingText">Loading...</p>
    <p v-if="reloaded" class="animate-fade">Data will be
      reloaded!</p>

    <nav class="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-3 underline-offset-4 justify-center ">
      <NavBarHeader :response="response" :pageName="pageName" @loadNav="loadNav" />
    </nav>

    <p v-if="start == false" class="lg:text-xl  md:text-sm sm:text-xl xxs:text-xs md:p-2 md:mb-3 mb-4  text-center">
      {{
        response.data[pageName].count
      }} {{
  Utils.firstLetterToUpperCase(pageName)
}} of the
      Star Wars Universe</p>

    <div class="absolute top-2 right-2 text-right" @mouseleave="dropDownConfig(false)">
      <button data-button="buttonFontAwesome" type="button" @click="dropDownConfig('switch')"
        @mouseenter="dropDownConfig(true)" title="Config">
        <font-awesome-icon icon="fa-solid fa-gear" class="iconFontAwesome" />
      </button>
      <DropDownConfig v-if="dropDown" class="absolute right-0 xs:w-56 w-40 bg-gray-400 " @confirmReload="confirmReload"
        @switchDarkLightMode="switchDarkLightMode" />
    </div>
  </header>

  <main class="lg:pt-60 md:pt-48 pt-40">
    <div class="grid md:grid-cols-4 grid-cols-1 w-full">

      <NavBar v-if="(!start && !errorLoadPage && !displaySmall)" @generatePaginationList="generatePaginationList"
        @paginate="paginate" @loadInfo="loadInfo" :paginationListtoShow="paginationListtoShow" :nameOfInfo="nameOfInfo"
        :records="records" :itemsPerPage="itemsPerPage" />

      <div class="col-span-3 w-full" v-if="start == false && itemInfoPage != null">
        <div class="md:w-3/4 md:mx-auto ml-2 w-full  lg:top-60 md:top-48 fixed">
          <StarWarsInfo class="scrollbar " :response.data="response.data" :page="pageName" :itemInfoPage="itemInfoPage"
            :apiURL="apiURL" @loadInfo="loadInfo" />
        </div>
      </div>

      <ConfirmDialog v-if="showConfirm" class="fixed md:left-1/3 left-10  " @confirm="confirm" />

      <div class="fixed md:right-14 right-2 top-32 md:top-32 lg:top-40" :class="positionSearch">
        <SearchValueVue :response.data="response.data" :apiURL="apiURL" @loadInfo="loadInfo" />
      </div>

      <MobilNavBar v-if="displaySmall && !start" @generatePaginationList="generatePaginationList" @paginate="paginate"
        @loadInfo="loadInfo" :paginationListtoShow="paginationListtoShow" :nameOfInfo="nameOfInfo" :records="records"
        :itemsPerPage="itemsPerPage" />

      <div>
        <div class=" col-span-3 fixed -z-10  text-center mt-5 md:w-3/4 w-full ">
          <img v-if="start == false && itemInfoPage == null"
            class="md:w-10/12 lg:px-24 xxs:w-3/4  xxs:mx-auto mx-auto lg:my-0 my-10 -z-10 " :src="selectPic"
            :alt="selectAltAttributePicture">
        </div>
      </div>
    </div>
    <p v-if="errorLoadPage" class="fontColorGlobal text-center lg:text-3xl  md:text-xl sm:text-xs xxs:text-xs">
      Error on loading page the data
      from
      the API !!! Please retry
      later!</p>
    <div class="fontColorGlobal" v-if="start == true">
      <h2 class="text-center mt-2 lg:text-4xl  md:text-3xl sm:text-xl xxs:text-xs">Welcome to my
        project!!!</h2>
      <p class="lg:text-3xl md:text-xl sm:text-xl xxs:text-xs mx-5 text-center">This is a project to visualize data of
        the
        <span class="text-yellow-700 ">"SWAPI
          The Star Wars API"</span>. I´m using: Vite with Vue.js 3, Tailwind and AXIOS
      </p>

      <img class="lg:w-1/2 w-3/4 m-auto mt-8" src="./assets/img/star-wars-main.jpg" alt="Darth Vader">
    </div>
  </main>
  <footer class="fixed bottom-0 w-full bg-slate-700">
    <p class="text-center py-1 md:text-sm text-xs text-yellow-500 ">Favicon by <a href="https://icons8.de/"
        target="_blank">icons8.de</a></p>
  </footer>
</template>
<style>
.scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.scrollbar::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: #f7f4ed;
}

.scrollbar::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 100vh;
  border: 2px solid #f6f7ed;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>

