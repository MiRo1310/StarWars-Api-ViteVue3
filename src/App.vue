<template >
  <header
    class=" bg-gray-800 text-yellow-400 text-center border-b-4 border-yellow-400 border-double pb-4 fixed w-full pt-0 top-0 p-10">
    <h1 class="  lg:text-6xl p-5 sm:text-4xl "> <span class="cursor-pointer" v-on:click="loadSide()">{{
        title.toLocaleUpperCase()
    }}</span>
    </h1>
    <!-- Loading -->
    <p v-if="showLoading">Loading...</p>
    <!-- Navigation -->
    <nav class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 underline-offset-4 justify-center ">

      <!-- Nav Header -->
      <template v-for="(item, key) in response" :key="key.item">
        <p class="mr_hyperlink bg-gray-600 mx-4 pb-3 pt-1 sm:text-xs sm:px-2 rounded-lg md:text-xl lg:text4xl m-1"
          v-on:click="loadPage(key)" :class="activeLink(key)">{{
              firstLetterToUpperCase(key)
          }}
        </p>
      </template>
    </nav>
    <!-- Info Field -->
    <p v-if="start == false" class="text-xl p-2 my-2">{{ getlength }} {{
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
          <StarWarsNav v-for="(element) in this.response[this.pageName]" :element="element" :item="changeItem"
            :pageNumber="this.pageNumber" :key="element" @loadInfo="loadInfo" />

        </ul>

        <pagination v-model="page" :records="500" :per-page="25" @paginate="myCallback" />


      </nav>


      <div class="col-span-3 " v-if="start == false && pageNumber != null">
        <div class="fixed  w-3/4 top-[232px] ">
          <!-- TODO höhe anpassen by error-->
          <div class="">
            <StarWarsInfo :response="this.response" :page="this.pageName" :pageNumber="this.pageNumber"
              @loadInfo="loadInfo" />
          </div>

        </div>

      </div>
      <div>
        <div class=" col-span-3 text-center mt-5 fixed w-3/4">
          <!-- Bild-Info-Feld -->
          <img v-if="start == false && pageNumber == null" class="w-10/12 px-24 mx-auto my-10" :src="selectPic"
            :alt="selectAlt">
        </div>
      </div>


    </div>
    <p v-if="errorLoadPage === true" class="text-yellow-400 text-center text-2xl">Error on loading page the data from
      the API !!! Please retry
      later!</p>
    <div v-if="start == true">
      <h2 class="text-yellow-400 text-center mt-2 text-3xl">Welcome to my project!!!
        <br>
        <span class="text-xl">This is a project to visualizedata of the <span class="text-yellow-700 ">"SWAPI
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
      apiURL: "https://swapi.py4e.com/api/",
      pageName: "",
      pageNumber: null,
      item: "",
      start: true,
      loading: true,
      errorLoadPage: false,
      page: 1
    }
  },
  mounted() {
    this.getData(this.apiURL)
  },
  computed: {
    myCallback() {
      return 1
    },
    getlength() {
      return this.response[this.pageName].length
    },

    selectPic() {
      return `./src/assets/img/${this.pageName}.jpg`
    },
    selectAlt() {
      return this.pageName
    },
    changeItem() {
      return this.item
    },
    showLoading() {
      return this.loading === true
    }
  },

  methods: {
    loadSide() {
      this.start = true
      this.pageName = ""
    },
    activeLink(key) {
      if (key === this.pageName)
        return "bg-blue-900 text-white border-yellow-400 border-2"

    },
    loadPage(key) {
      this.item = ""
      this.start = false
      this.pageName = key
      this.pageNumber = null
    },
    async getApiData(url) {
      try {
        const response = await this.axios.get(url)
        console.log(response)
        if (response.data.results) {
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
    async getData(url) {
      let data = {};
      const result = await this.getApiData(url)

      if (result) {
        for (let item in result) {

          data[item] = await this.getApiData(result[item])
        }
      }
      this.loading = false;
      this.response = data;
      console.log(data)
      // let arrayLinks = [];
      // for (const group in data) {
      //   for (const item in data[group]) {
      //     // console.log(data[group])
      //     // console.log(data[group][element])
      //     for (const entry in data[group][item]) {
      //       const el = data[group][item][entry]
      //       // console.log(el)
      //       if (Array.isArray(el)) {
      //         el.forEach((url) => {
      //           // Wenn dieser Eintag in dem Object gefunden wird soll nichts gemacht werden
      //           if (!(data[this.getCategory(url)].find(entry => entry.url === url))) {
      //             if (arrayLinks.indexOf(url) == -1) {
      //               arrayLinks.push(url)
      //               this.getApiData(url).then((newData) => {
      //                 if (newData) {
      //                   if (!(data[this.getCategory(url)].find(entry => entry === newData))) {
      //                     data[this.getCategory(url)].push(newData);
      //                   }
      //                 }
      //               })
      //             }
      //           }
      //         })
      //       }
      //     }
      //   }
      // }

      console.log(data)

    },
    firstLetterToUpperCase(name) {
      return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
    },

    getCategory(url) {
      let element = url.replace(this.apiURL, "")

      return element.slice(0, element.indexOf("/"))

    },

    loadInfo(val) {
      const category = this.getCategory(val)
      // console.log("Category " + category)
      this.pageName = category;
      let item = this.response[category].find(element => element.url == val)
      this.pageNumber = (this.response[category].indexOf(item))
      // console.log("Pagenumber " + this.pageNumber)
      this.item = this.response[category][this.pageNumber].name || this.response[category][this.pageNumber].title


    },
  },
}
</script>

<style>
.mr_pic {
  width: 50%;
}
</style>

