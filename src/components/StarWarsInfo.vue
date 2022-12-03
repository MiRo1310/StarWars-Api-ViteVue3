<template>
  <div class="bg-slate-700 text-center py-8 border-2 ml-0 border-yellow-400 m-4 rounded-lg overflow-auto  h-[69vh]">
    <!-- Überschrift -->
    <h2 class="text-yellow-400 text-3xl underline underline-offset-4">{{ itemTitle
    }}</h2>
    <br>
    <ul class="text-white text-xl ">

      <li v-for="(value, key, index) in response[page][pageNumber]" :key="index">
        <p class="lg:text-sm inline-block  w-20" :class="textKeyPosition(value)"> {{
            firstLetterToUpperCase(key)
        }} :</p>
        <!-- Eine Liste aus einem Array -->
        <template v-if="generateList(value)">
          <template v-if="value.length != 0">
            <ul class="mb-2">
              <li v-for="val in value" v-bind:key="val" class="inline-block mx-4">
                <a class="underline underline-offset-4 lg:text-sm text-yellow-400 my-6" @click="loadInfo(val)"
                  href="#">{{
                      loadNameOrTitle(val)
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
          <p class="lg:text-sm inline-block w-32 text-end">{{ getDate(value) }}</p>
        </template>

        <p v-else class="lg:text-sm inline-block w-28 text-end">{{ firstLetterToUpperCase(value) }}</p>

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

    };
  },
  computed: {

    itemTitle() {
      let value = "";
      let property = this.response[this.page][this.pageNumber]
      if (property.name) {
        value = property.name
      } else if (property.title) {
        value = property.title
      }
      return value;
    },


  },

  methods: {
    getDate(value) {
      let date = new Date(value)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    },
    textKeyPosition(value) {
      if (!(this.generateList(value) || this.checkValue(value))) {
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
        if (value.indexOf('https') >= 0) {
          return true
        }
      }
    },

    loadNameOrTitle(url) {
      let element = url.replace("https://swapi.dev/api/", "")

      let page = element.slice(0, element.indexOf("/"))
      this.pageToGo = page
      try {
        let item = this.response[page].find(element => element.url == url)


        if (item != undefined) {
          if (item.name) { return item.name }
          else if (item.title) { return item.title }
          else { return "" }
        }

      } catch (error) {
        console.log(error)
      }



    },

    firstLetterToUpperCase(name) {
      if (typeof (name) == "string") {
        return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
      }

    },

  },
  props: ["response", "page", "pageNumber"],

}
</script>
