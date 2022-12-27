<script setup>
import StarWarsInfo from './components/StarWarsInfo.vue'
import StarWarsNav from './components/StarWarsNav.vue'
import DropDownConfig from './components/DropDownConfig.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
const apiURL = "https://swapi.py4e.com/api/";
const title = "star wars"
const displayWidth = ref(0)
const darkMode = ref(null);

//ANCHOR - On Mounted
onMounted(async () => {
  displayWidth.value = window.innerWidth
  window.addEventListener("resize", () => {
    displayWidth.value = window.innerWidth
  });

  const savedValue = await loadLocalStorage()
  if (!savedValue) {
    console.log('There is no data in "LocalStorage", it will be load from the API!')
    getData(apiURL)
  } else {
    console.log("Data is loaded from LocalStorage!")
    switchDarkLightMode(savedValue.darkMode)
    console.log("DarkMode wird auf " + savedValue.darkMode + " gesetzt!")
    response = savedValue;
    loading.value = false;
    console.log(response);
  }

})
//ANCHOR - Pagination
let pagePagination = ref(1);
const paginate = (pageNumber) => {
  pagePagination.value = pageNumber
  generatePaginationList(pageName.value, pageNumber)


}
let response = reactive({
  data: {},
  darkMode: true
});
const records = computed(() => {
  return response.data[pageName.value].count
})

let start = ref(true);
const loadSide = () => {
  start.value = true
  pageName.value = ""
}

// ANCHOR activeLink
const activeLink = (key) => {
  if (key === pageName.value)
    return "mr_colorButtonActive "
  else {
    return "mr_colorButton"
  }

}
let itemsPerPage = ref(10);
let paginationListtoShow = ref([]);
let cat
//ANCHOR - GeneratePaginationList
const generatePaginationList = (category, page) => {
  if (page) {
    pagePagination.value = page
    cat = category
  }
  // console.log(category, page)
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
//ANCHOR - getData
const getData = async (url) => {
  const result = await getApiData(url)

  if (result) {
    // Einmal durchlaufen um die erste Seite zu laden mit Count
    for (let item in result) {

      let data = await getApiData(result[item], true)
      response.data[item] = {
        data: data.results,
        count: data.count
      }
      let nextPage = data.next;
      while (nextPage !== null) {
        let data = await getApiData(nextPage, true)
        data.results.forEach(element => {
          response.data[item].data.push(element)

        });
        nextPage = data.next
      }
    }
    saveToLocalStorage(response);
  }
  setTimeout(() => {
    reloaded.value = false
  }, 3000)
  loading.value = false;
  console.log(response)
}
const saveToLocalStorage = (response) => {
  localStorage.setItem("starwars", JSON.stringify(response))
  console.log("Data Saved")
}
const loadLocalStorage = async () => {
  const savedValue = localStorage.getItem("starwars")
  if (savedValue) return JSON.parse(savedValue);
  else return null;
}

/**
 * 
 * @param {string} url Url
 * @param {boolean} getData If true you get.data else .data.results 
 */
let errorLoadPage = ref(false);
const getApiData = async (url, getData) => {
  try {
    const response = await axios.get(url)
    if (response.data.results && !getData) {
      return response.data.results
    } else if (response.data) {
      return response.data
    }
    errorLoadPage.value = false
  } catch (err) {
    errorLoadPage.value = true
    console.log(err)
  }
}

const firstLetterToUpperCase = (name) => {
  return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
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
  mobilNav.value = false
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

const mobilNav = ref(false)
const showMobilNav = (val) => {
  if (val == "switch") { mobilNav.value = !mobilNav.value }
  else { mobilNav.value = val }
}


switchDarkLightMode(response.darkMode)
function switchDarkLightMode(val) {
  dropDown.value = false
  const htmlTag = document.querySelector("html")
  if (val == undefined) {
    darkMode.value = !darkMode.value
    if (darkMode.value == true) htmlTag.classList.add("dark")
    else htmlTag.classList.remove("dark")
    response.darkMode = darkMode.value
    saveToLocalStorage(response)
  }
  else {
    darkMode.value = val
    if (val) htmlTag.classList.add("dark")
    else htmlTag.classList.remove("dark")
  }
}

const positionSearch = computed(() => {
  if (start.value) return "bottom-[0]"
  else return "bottom-1"
})
const header = computed(() => {
  if (start.value) return "md:h-48 h-32"

})


const findItem = (category, text) => {
  let filteredElements = []
  response.data[category].data.forEach(element => {
    const array = Object.values(element);
    let filteredElementsOfOneArray = array.filter(value => {
      if (value) return value.toString().toLowerCase().indexOf(text.toLowerCase()) != -1
    })
    if (filteredElementsOfOneArray.length != 0) {
      filteredElements.push({
        search: filteredElementsOfOneArray.join(" "),
        name: element.name || element.title,
        url: element.url,
        category: category
      })
    }
  })
  return filteredElements
}
let searchedText = ref("")
let filteredElements = ref([])
const search = () => {
  showSearch.value = true
  filteredElements.value = []
  let searchedCategory = document.getElementById("selectItem").value
  searchedText.value = document.getElementById("searchedText").value
  if (searchedCategory === "global") {
    for (let element in response.data) {
      findItem(element, searchedText.value).forEach(element => filteredElements.value.push(element))
    }
  }
  else {
    filteredElements.value = findItem(searchedCategory, searchedText.value)
  }
  // console.log(filteredElements.value)
}

const extractSearchFromText = (text, searchFor) => {
  let lengthOfSearch;
  let textToLowerCase
  let array = []
  if (text && searchFor) {
    lengthOfSearch = searchFor.length
    textToLowerCase = text.toLowerCase()
    searchFor = searchFor.toLowerCase()
    let position;
    let positionBefor = 0;
    while (textToLowerCase.includes(searchFor)) {
      position = textToLowerCase.indexOf(searchFor)
      let placeholder = "/".repeat(lengthOfSearch)
      textToLowerCase = textToLowerCase.replace(searchFor, placeholder)
      if (text.slice(positionBefor, position) != "") array.push(text.slice(positionBefor, position))
      array.push(text.slice(position, position + lengthOfSearch))
      positionBefor = position + lengthOfSearch
    }
    array.push(text.slice(positionBefor, text.length))
  }

  if (array.length > 0) return array
  else return text
}
const showSearch = ref(false)
const searchDisplayed = computed(() => {
  if (showSearch.value) return true
})
</script>

<template >
  <header
    class="mr_bgHeader mr_fontGlobal border-b-4 dark:border-yellow-400 border-yellow-600 border-double pb-4 fixed w-[100vW] pt-0 top-0 p-10 text-center"
    :class="header">
    <h1 class="lg:text-5xl  md:text-3xl sm:text-xl xxs:text-xl text-center md:m-3 inline-block rounded-md">
      <span class="cursor-pointer" v-on:click="loadSide()">{{
          title.toLocaleUpperCase()
      }}</span>
    </h1>
    <!--//ANCHOR - Text Loading -->
    <p v-if="showLoadingText">Loading...</p>
    <p v-if="reloaded" class="animate-fade">Data will be
      reloaded!</p>
    <!--//ANCHOR -  Navigation -->
    <nav class="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-3 underline-offset-4 justify-center ">
      <template v-for="(item, key) in response.data" :key="key.item">
        <a class="mx-4 pt-1 lg:text-3xl lg:pb-3 md:text-xs md:px-1 md:pb-2 sm:text-xl text-[0.5rem] px-1 pb-2 sm:px-2 rounded-lg my-1"
          href="#" v-on:click="loadNav(key, 1)" :class="activeLink(key)">{{
              firstLetterToUpperCase(key)
          }}
        </a>
      </template>
    </nav>
    <!--//ANCHOR -  Info Field -->
    <p v-if="start == false" class="lg:text-xl  md:text-sm sm:text-xl xxs:text-xs md:p-2 md:mb-3 mb-4  text-center">
      {{
          response.data[pageName].count
      }} {{
    firstLetterToUpperCase(pageName)
}} of the
      Star Wars Universe</p>
    <!--//ANCHOR -  DropDowm Config -->
    <div class="absolute top-2 right-2 text-right" @mouseleave="dropDownConfig(false)">
      <button data-button="buttonFontAwesome" type="button" @click="dropDownConfig('switch')"
        @mouseenter="dropDownConfig(true)" title="Config">
        <font-awesome-icon icon="fa-solid fa-gear" class="mr_buttonFontAwesome" />
      </button>
      <DropDownConfig v-if="dropDown" class="absolute right-0 xs:w-56 xxs:w-32 bg-gray-400 " @reload-data="reloadData"
        @switchDarkLightMode="switchDarkLightMode" />
    </div>
    <!--//ANCHOR -  Hamburger Menu -->
    <div v-if="displaySmall && !start" @mouseleave="showMobilNav(false)" class="absolute left-2 bottom-2  ">
      <button data-button="buttonFontAwesome" type="button" title="Navigation" @click="showMobilNav('switch')"
        @mouseenter="showMobilNav(true)">
        <font-awesome-icon icon="fa-solid fa-bars" class="mr_buttonFontAwesome" />
      </button>

      <div class="absolute top-9 rounded-lg w-56 h-[60vH] text-left mr_bgMain overflow-y-auto scrollbar"
        v-if="mobilNav">
        <ul>
          <!--//ANCHOR -  Nav Left -->
          <StarWarsNav class="mx-4" v-for="elementOfListToShow in paginationListtoShow"
            :elementOfListToShow="elementOfListToShow" :key="elementOfListToShow" :nameOfInfo="nameOfInfo"
            @loadInfo="loadInfo" />
        </ul>
        <!-- //ANCHOR - pagination -->
        <pagination v-model="pagePagination" :records="records" :per-page="itemsPerPage" @paginate="paginate($event)" />

        <select name="select1" class="mx-4 mt-2 mb-5 mr_bgSelect" v-model.number="itemsPerPage"
          v-on:change="generatePaginationList()">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
    <!--//ANCHOR - Search Field -->
    <div class="absolute right-2 z-20" :class="positionSearch">
      <select @change="search()" id="selectItem" name="searchItem" class="searchFieldsHeader" value="global">
        <!-- <option value="" selected disabled hidden>Choose here</option> -->
        <option value="global">Global</option>
        <option v-for="item of Object.keys(response.data)" :value=item>{{ firstLetterToUpperCase(item) }}</option>
      </select>
      <input @keyup="search()" type="text" id="searchedText" placeholder="Type in" class="searchFieldsHeader ">
      <!-- <button
        class="border-[1px] dark:border-yellow-400 border-blue-400 dark:text-yellow-400 text-blue-400 searchFieldsHeader"
        type="submit">Search</button> -->

      <ul v-if="searchDisplayed" class="bg-white absolute px-1 text-black right-0 text-right">
        <li v-for="item in filteredElements" class="font-bold my-2 mx-1">
          <a href="#" @click="loadInfo(item.url)">
            <template v-for="item in extractSearchFromText(item.name, searchedText)">
              <span v-if="item.toLowerCase() != searchedText.toLowerCase() && item != ''">{{ item }}</span>
              <span v-else class="span-search">{{ item }}</span>
            </template>
            <ul>
              <li>
                <p class="font-normal text-xs">Category: {{ item.category }}</p>
              </li>
              <!-- <li>
                <span>{{ item.search }}</span>
                <template v-for="item in extractSearchFromText(item.search, searchedText)">
                  <span v-if="item.toLowerCase() != searchedText.toLowerCase() && item != ''">{{ item }}</span>
                  <span v-else class="span-search">{{ item }}</span>
                </template>
              </li> -->
            </ul>
          </a>
        </li>
      </ul>
    </div>
  </header>
  <!-- //ANCHOR - Main -->
  <main class="lg:pt-[232px] md:pt-[190px] pt-[165px]">
    <div class="grid md:grid-cols-4 grid-cols-1 w-full">
      <nav v-if="(!start && !errorLoadPage && !displaySmall)" class="mt-2 mb-10">
        <ul class="mx-4">
          <!-- Nav Links -->
          <StarWarsNav v-for="elementOfListToShow in paginationListtoShow" :elementOfListToShow="elementOfListToShow"
            :key="elementOfListToShow" :nameOfInfo="nameOfInfo" @loadInfo="loadInfo" />
        </ul>
        <!-- //ANCHOR - pagination -->
        <pagination v-model="pagePagination" :records="records" :per-page="itemsPerPage" @paginate="paginate($event)" />

        <select name="select1" class="mx-4 mt-2 mb-5 mr_bgSelect" v-model.number="itemsPerPage"
          v-on:change="generatePaginationList()">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </nav>


      <div class="col-span-3 w-full -z-0" v-if="start == false && itemInfoPage != null">
        <div class="md:w-3/4  md:mx-auto ml-2 w-full  lg:top-[232px] md:top-[190px] fixed">

          <StarWarsInfo class="scrollbar z-10" :response.data="response.data" :page="pageName"
            :itemInfoPage="itemInfoPage" :apiURL="apiURL" @loadInfo="loadInfo" />

        </div>
      </div>
      <div>
        <div class=" col-span-3 absolute -z-10  text-center mt-5 md:w-3/4 w-full ">
          <!-- Bild-Info-Feld -->
          <img v-if="start == false && itemInfoPage == null"
            class="md:w-10/12 lg:px-24 xxs:w-3/4  xxs:mx-auto mx-auto lg:my-0 my-10 -z-10 " :src="selectPic"
            :alt="selectAltAttributePicture">
        </div>
      </div>


    </div>
    <p v-if="errorLoadPage" class="mr_fontGlobal text-center lg:text-3xl  md:text-xl sm:text-xs xxs:text-xs">
      Error on loading page the data
      from
      the API !!! Please retry
      later!</p>
    <div class="mr_fontGlobal" v-if="start == true">
      <h2 class="text-center mt-2 lg:text-4xl  md:text-3xl sm:text-xl xxs:text-xs">Welcome to my
        project!!!</h2>
      <p class="lg:text-3xl md:text-xl sm:text-xl xxs:text-xs mx-5 text-center">This is a project to visualize data of
        the
        <span class="text-yellow-700 ">"SWAPI
          The Star Wars API"</span>. I´m using: Vite with Vue.js 3, Tailwind and AXIOS
      </p>

      <img class="md:w-1/3 w-3/4  m-auto mt-8" src="./assets/img/star-wars-main.jpg" alt="Darth Vader">
    </div>
  </main>

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

