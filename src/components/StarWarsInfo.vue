<template>
  <div class="bg-slate-700 text-center py-8 border-2 ml-0 border-yellow-400 m-4 rounded-lg overflow-auto  h-[69vh]">
    <!-- Überschrift -->
    <h2 class="text-yellow-400 text-3xl underline underline-offset-4">{{ itemTitle
    }}</h2>
    <br>
    <ul class="text-white text-xl ">

      <li v-for="(value, key, index) in this.itemInfoPage" :key="index">
        <p class="lg:text-sm inline-block  w-48" :class="textKeyPosition(value, key)"> {{
            firstLetterToUpperCase(key)
        }} :</p>
        <!-- Eine Liste aus einem Array -->
        <template v-if="generateList(value)">
          <template v-if="value.length != 0">
            <ul class="mb-2">
              <li v-for="val in value" v-bind:key="val" class="inline-block mx-4">
                <a class="underline underline-offset-4 lg:text-sm text-yellow-400 my-6" @click="loadInfo(val)" href="#">
                  {{ loadNameOrTitle(val)
                  }}
                </a>
              </li>
            </ul>
          </template>
          <template v-else>
            <!-- Text not defiend -->
            <p class="lg:text-sm underline-offset-4 text-yellow-400 my-2">Not
              defined</p>
          </template>
        </template>
        <!-- Link ohne Array ausser url-->
        <template v-else-if="checkValue(value)">
          <ul class="mb-2">
            <li v-if="key != 'url'">
              <a @click="loadInfo(value)" class="underline underline-offset-4 lg:text-sm text-yellow-400 my-6 mb-2"
                href="#">
                {{ loadNameOrTitle(value) }}
              </a>
            </li>
            <li v-else>
              <a class="underline underline-offset-4 lg:text-sm text-yellow-400 my-6 mb-2" :href="value"
                target="_blank">
                {{ value }}
              </a>
            </li>
          </ul>
        </template>
        <template v-else-if="(key === 'created' || key === 'edited')">
          <p class="lg:text-sm inline-block w-48 text-end">{{ getDate(value) }}</p>
        </template>
        <template v-else-if="(key === 'episode_id')">
          <p class="lg:text-sm inline-block w-48 text-end">{{ value }}</p>
        </template>
        <template v-else-if="(key === 'opening_crawl')">
          <p class="lg:text-sm block text-center mx-4">{{ value }}</p>
        </template>

        <p v-else class="lg:text-sm inline-block w-48 text-end">{{ firstLetterToUpperCase(value) }}</p>

      </li>

    </ul>

  </div>
</template>

<script>

export default {
  name: "StarWarsInfo",
  components: {

  },
  data() {
    return {
      title: "",
      item: {}

    };
  },
  computed: {


    itemTitle() {
      let value = "";
      if (this.itemInfoPage.name) {
        value = this.itemInfoPage.name
      } else if (this.itemInfoPage.title) {
        value = this.itemInfoPage.title
      }
      return value;
    },


  },

  methods: {

    getDate(value) {
      let date = new Date(value)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    },
    textKeyPosition(value, key) {
      if (!(this.generateList(value) || this.checkValue(value) || key === "opening_crawl")) {
        return ["text-start"]
      }
    },
    generateList(value) {
      return Array.isArray(value)
    },
    arrayLength(array) {
      console.log(array)
      if (array.length != 0) return true
      else return false
    },
    loadInfo(val) {
      this.$emit("loadInfo", val)
    },
    checkValue(value) {
      if (this.page != "films") {

        if (value && value.indexOf('https') >= 0) {
          return true
        }
      }
    },
    getCategory(url) {
      let element = url.replace("https://swapi.py4e.com/api/", "")
      return element.slice(0, element.indexOf("/"))

    },
    getNumberOfUrl(url) {
      let element = url.replace("https://swapi.py4e.com/api/", "")
      return Number(element.slice(element.indexOf("/") + 1, element.length).replace("/", ""))
    },


    loadNameOrTitle(url) {
      let nameOrTitle = "";
      let item = "";
      item = this.response[this.getCategory(url)].data.find((element) => element.url == url)

      if (item.name) nameOrTitle = item.name
      if (item.title) nameOrTitle = item.title
      return nameOrTitle
    },


    firstLetterToUpperCase(name) {
      if (typeof (name) == "string") {
        return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
      }

    },

  },
  props: ["response", "page", "itemInfoPage"],

}
</script>
