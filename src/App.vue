<template >
  <header
    class=" bg-gray-800 text-yellow-400 text-center border-b-4 border-yellow-400 border-double pb-4 fixed w-full pt-0 top-0 p-10">
    <h1 class="  lg:text-6xl p-5 sm:text-4xl "> <span class="cursor-pointer" v-on:click="enterTheSide()">{{
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
    <p v-if="start == false" class="text-xl p-2 my-2">{{ this.response[pageName].count }} {{
        firstLetterToUpperCase(this.pageName)
    }} of the
      Star Wars Universe</p>
    <!-- TODO verlinken nach Swapi -->
  </header>
  <main class="pt-[232px]">
    <div class="grid grid-cols-4">
      <nav v-if="(start == false && errorLoadPage === false)" class="mt-2">
        <ul>
          <!-- Nav Links -->
          <StarWarsNav v-for="(element) in this.paginationListtoShow" :element="element" :item="changeItem"
            :key="element" :nameOfInfo="this.nameOfInfo" @loadInfo="loadInfo" />

        </ul>
        <!-- //ANCHOR - pagination -->
        <pagination v-model="pagePagination" :records="this.response[pageName].count" :per-page="this.itemsPerPage"
          @paginate="paginate($event)" />

        <select name="select1" class="mx-4 mt-2 mb-5 bg-slate-700 text-yellow-400" v-model.number="itemsPerPage"
          v-on:change="this.generatePaginationList()">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </nav>


      <div class="col-span-3 " v-if="start == false && this.itemInfoPage != null">
        <div class="fixed  w-3/4 top-[232px] ">
          <!-- TODO höhe anpassen by error-->
          <div class="">
            <StarWarsInfo :response="this.response" :page="this.pageName" :itemInfoPage="this.itemInfoPage"
              @loadInfo="loadInfo" />
          </div>

        </div>

      </div>
      <div>
        <div class=" col-span-3 text-center mt-5 fixed w-3/4">
          <!-- Bild-Info-Feld -->
          <img v-if="start == false && this.itemInfoPage == null" class="w-10/12 px-24 mx-auto my-10" :src="selectPic"
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


export default {
  name: 'App',
  components: {
    StarWarsNav, StarWarsInfo
  },
  data() {
    return {
      title: "Star Wars",
      response: {},
      records: 100,
      itemsPerPage: 10,
      apiURL: "https://swapi.py4e.com/api/",
      pageName: "",
      actualPage: null,
      item: "",
      start: true,
      loading: true,
      errorLoadPage: false,
      pagePagination: 1,
      paginationListtoShow: [],
      itemInfoPage: null,
      nameOfInfo: "",


    }
  },
  mounted() {
    this.getData(this.apiURL)
  },
  computed: {

    getlength() {
      return this.response[this.pageName].length
    },

    selectPic() {
      return `./src/assets/img/${this.pageName}.jpg`
    },
    selectAltAttributePicture() {
      return this.pageName
    },
    changeItem() {
      return this.item
    },
    showLoadingText() {
      return this.loading === true
    }
  },

  methods: {
    paginate(pageNumber) {
      this.pagePagination = pageNumber
      this.generatePaginationList()

    },
    loadSide() {
      this.start = true
      this.pageName = ""
    },
    activeLink(key) {
      if (key === this.pageName)
        return "bg-blue-900 text-white border-yellow-400 border-2"

    },
    generatePaginationList() {
      this.paginationListtoShow = this.response[this.pageName].data.slice(0 + (this.pagePagination - 1) * this.itemsPerPage, this.itemsPerPage * this.pagePagination)
    },
    loadNav(pageName, pageNumber) {
      this.pageName = pageName
      this.actualPage = null
      this.start = false
      this.generatePaginationList(pageName, pageNumber)
      this.itemInfoPage = null
    },
    async getData(url) {
      const result = await this.getApiData(url)

      if (result) {
        // Einmal durchlaufen um die erste Seite zu laden mit Count
        for (let item in result) {
          let data = await this.getApiData(result[item], true)

          this.response[item] = {
            data: data.results,
            count: data.count
          }
        }
        for (let item in result) {
          let pages = Math.ceil(this.response[item].count / 10)
          for (let page = 2; page <= pages; page++) {
            let data = await this.getApiData(`${this.apiURL}${[item]}/?page=${page}`, true)
            data.results.forEach(element => {
              this.response[item].data.push(element)

            });
          }
        }
      }

      this.loading = false;
      console.log(this.response)
    },
    /**
     * 
     * @param {string} url Url
     * @param {boolean} getData If true you get.data else .data.results 
     */
    async getApiData(url, getData) {
      try {
        const response = await this.axios.get(url)
        if (response.data.results && !getData) {
          return response.data.results
        } else if (response.data) {
          return response.data
        }
        this.errorLoadPage = false
      } catch (err) {
        this.errorLoadPage = true
        console.log(err)
      }
    },

    firstLetterToUpperCase(name) {
      return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
    },

    getCategory(url) {
      let element = url.replace(this.apiURL, "")
      return element.slice(0, element.indexOf("/"))

    },
    getNumberOfUrl(url) {
      let element = url.replace("https://swapi.py4e.com/api/", "")
      return Number(element.slice(element.indexOf("/") + 1, element.length).replace("/", ""))
    },

    loadInfo(url) {
      this.itemInfoPage = this.response[this.getCategory(url)].data.find((element) => element.url == url)
      this.nameOfInfo = this.itemInfoPage.name || this.itemInfoPage.title
      this.pageName = this.getCategory(url)
      this.generatePaginationList(this.getCategory(url), Math.ceil((this.response[this.getCategory(url)].data.indexOf(this.itemInfoPage) + 1) / 10))
    },
  },
}
</script>

<style>
.mr_pic {
  width: 50%;
}
</style>

