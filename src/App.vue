<template >
  <header
    class=" bg-gray-800 text-yellow-400 text-center border-b-4 border-yellow-400 border-double pb-4 fixed w-full pt-0 top-0 p-10">
    <h1 class="  lg:text-6xl p-5 sm:text-4xl "> <span class="cursor-pointer" v-on:click="loadSide()">{{
        title.toLocaleUpperCase()
    }}</span>
    </h1>
    <!-- Loading -->
    <p v-if="showLoadingText">Loading...</p>
    <!-- Navigation -->
    <nav class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 underline-offset-4 justify-center ">

      <!-- Nav Header -->
      <template v-for="(item, key) in response" :key="key.item">
        <a class="mr_hyperlink bg-gray-600 mx-4 pb-3 pt-1 sm:text-xs sm:px-2 rounded-lg md:text-xl lg:text4xl m-1"
          href="#" v-on:click="loadNav(key, 1)" :class="activeLink(key)">{{
              firstLetterToUpperCase(key)
          }}
        </a>
      </template>
    </nav>
    <!-- Info Field -->
    <p v-if="start == false" class="text-xl p-2 my-2">{{ response[pageName].count }} {{
        firstLetterToUpperCase(pageName)
    }} of the
      Star Wars Universe</p>
  </header>
  <main class="pt-[232px]">
    <div class="grid grid-cols-4">
      <nav v-if="(start == false && errorLoadPage === false)" class="mt-2">
        <ul>
          <!-- Nav Links -->
          <StarWarsNav v-for="(element) in paginationListtoShow" :element="element" :item="changeItem" :key="element"
            :nameOfInfo="nameOfInfo" @loadInfo="loadInfo" />
        </ul>
        <!-- //ANCHOR - pagination -->
        <pagination v-model="pagePagination" :records="records" :per-page="itemsPerPage" @paginate="paginate($event)" />

        <select name="select1" class="mx-4 mt-2 mb-5 bg-slate-700 text-yellow-400" v-model.number="itemsPerPage"
          v-on:change="generatePaginationList()">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </nav>


      <div class="col-span-3 " v-if="start == false && itemInfoPage != null">
        <div class="fixed  w-3/4 top-[232px] ">
          <!-- TODO höhe anpassen by error-->
          <div class="">
            <StarWarsInfo :response="response" :page="pageName" :itemInfoPage="itemInfoPage" @loadInfo="loadInfo" />
          </div>

        </div>

      </div>
      <div>
        <div class=" col-span-3 text-center mt-5 fixed w-3/4">
          <!-- Bild-Info-Feld -->
          <img v-if="start == false && itemInfoPage == null" class="w-10/12 px-24 mx-auto my-10" :src="selectPic"
            :alt="selectAltAttributePicture">
        </div>
      </div>


    </div>
    <p v-if="errorLoadPage === true" class="text-yellow-400 text-center text-2xl">Error on loading page the data from
      the API !!! Please retry
      later!</p>
    <div v-if="start == true">
      <h2 class="text-yellow-400 text-center mt-2 text-3xl">Welcome to my project!!!
        <br>
        <span class="text-xl">This is a project to visualize data of the <span class="text-yellow-700 ">"SWAPI
            The Star Wars API"</span>. I´m using: Vite with Vue.js 3, Tailwind and AXIOS</span>
      </h2>
      <img class="mr_pic m-auto mt-8" src="./assets/img/star-wars-main.jpg" alt="Darth Vader">
    </div>
  </main>

</template>

<script>
import StarWarsInfo from './components/StarWarsInfo.vue'
import StarWarsNav from './components/StarWarsNav.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const apiURL = "https://swapi.py4e.com/api/";
    onMounted(() => {
      getData(apiURL)
    })
    // Pagination
    let pagePagination = ref(1);
    const paginate = (pageNumber) => {
      pagePagination.value = pageNumber
      generatePaginationList(pageName.value, pageNumber)


    }
    let response = reactive({});
    const records = computed(() => {
      return response[pageName.value].count
    })

    const getlength = computed(() => {
      return response[pageName.value].length
    })

    let start = ref(true);
    const loadSide = () => {
      start.value = true
      pageName.value = ""
    }

    const activeLink = (key) => {
      if (key === pageName.value)
        return "bg-blue-900 text-white border-yellow-400 border-2"

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
      paginationListtoShow.value = response[cat].data.slice(0 + (pagePagination.value - 1) * itemsPerPage.value, itemsPerPage.value * pagePagination.value)

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
    const getData = async (url) => {
      const result = await getApiData(url)

      if (result) {
        // Einmal durchlaufen um die erste Seite zu laden mit Count
        for (let item in result) {

          let data = await getApiData(result[item], true)
          response[item] = {
            data: data.results,
            count: data.count
          }
          let nextPage = data.next;
          while (nextPage !== null) {
            let data = await getApiData(nextPage, true)
            data.results.forEach(element => {
              response[item].data.push(element)

            });
            nextPage = data.next
          }
        }
        // for (let item in result) {
        //   let pages = Math.ceil(response[item].count / 10)
        //   for (let page = 2; page <= pages; page++) {
        //     let data = await getApiData(`${apiURL}${[item]}/?page=${page}`, true)
        //     data.results.forEach(element => {
        //       response[item].data.push(element)

        //     });
        //   }
        // }
      }

      loading.value = false;
      console.log(response)
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
    const getNumberOfUrl = (url) => {
      let element = url.replace("https://swapi.py4e.com/api/", "")
      return Number(element.slice(element.indexOf("/") + 1, element.length).replace("/", ""))
    }
    let nameOfInfo = ref(null)
    const loadInfo = (url) => {
      itemInfoPage.value = response[getCategory(url)].data.find((element) => element.url == url)
      nameOfInfo.value = itemInfoPage.value.name || itemInfoPage.value.title
      pageName.value = getCategory(url)
      generatePaginationList(getCategory(url), Math.ceil((response[getCategory(url)].data.indexOf(itemInfoPage.value) + 1) / itemsPerPage.value))
    }

    const selectPic = computed(() => {
      return `./public/${pageName.value}.jpg`
    })
    let pageName = ref("");
    const selectAltAttributePicture = computed(() => {
      return pageName.value
    })
    let item = ref("");
    const changeItem = computed(() => {
      return item.value
    })
    let loading = ref(true)
    const showLoadingText = computed(() => {
      return loading.value === true
    })

    //ANCHOR - Data
    return {
      title: "Star Wars",
      itemsPerPage,
      getlength,
      selectPic,
      selectAltAttributePicture,
      changeItem,
      showLoadingText,
      loading,
      response,
      records,
      pageName,
      actualPage,
      item,
      start,
      errorLoadPage,
      pagePagination,
      paginationListtoShow,
      itemInfoPage,
      nameOfInfo,
      paginate,
      loadInfo,
      loadSide,
      activeLink,
      loadNav,
      firstLetterToUpperCase,
      getNumberOfUrl,
      generatePaginationList,


    }
  },
  components: {
    StarWarsNav, StarWarsInfo
  },



}
</script>

<style>
.mr_pic {
  width: 50%;
}
</style>

