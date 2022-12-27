<script setup>

import { computed } from 'vue'
const props = defineProps(["response", "page", "itemInfoPage", "apiURL"])
const emit = defineEmits(["loadInfo"])

const itemTitle = computed(() => {
  let value = "";
  if (props.itemInfoPage.name) {
    value = props.itemInfoPage.name
  } else if (props.itemInfoPage.title) {
    value = props.itemInfoPage.title
  }
  return value;
})

const delUnderscore = (key) => {
  return key.replace("_", " ")
}

const getDate = (value) => {
  let date = new Date(value)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}
const textKeyPosition = (value, key) => {
  if (!(generateList(value) || checkValue(value) || key === "opening_crawl")) {
    return ["text-start"]
  }
}
const generateList = (value) => {
  return Array.isArray(value)
}

const loadInfo = (val) => {
  emit("loadInfo", val)
}

//ANCHOR checkValue
const checkValue = (value) => {
  if (typeof (value) != "number") {
    if (value && value.indexOf('https') >= 0) {
      return true
    }
  }
}
const getCategory = (url) => {
  let element = url.replace(props.apiURL, "")
  return element.slice(0, element.indexOf("/"))
}

const loadNameOrTitle = (url) => {
  let nameOrTitle = "";
  let item = "";
  item = props.response[getCategory(url)].data.find((element) => element.url == url)

  if (item.name) nameOrTitle = item.name
  if (item.title) nameOrTitle = item.title

  return nameOrTitle
}


const firstLetterToUpperCase = (name) => {
  if (typeof (name) == "string") {
    return name.slice(0, 1).toLocaleUpperCase() + name.slice(1)
  }
}


</script>

<template>
  <div
    class="relative mr_bgMain mr_fontGlobal text-center py-8 border-2 ml-0  m-4  rounded-lg overflow-auto lg:h-[62vh]  md:h-[79vh]  h-[65vh]">
    <!-- Überschrift -->
    <h2 class=" lg:text-3xl  md:text-xl sm:text-sm text-sm  underline underline-offset-4">{{ itemTitle
    }}</h2>
    <br>
    <ul class="dark:text-white text-black font-medium lg:text-xl  md:text-sm sm:text-xs xxs:text-xs ">

      <li v-for="(value, key, index) in itemInfoPage" :key="index">
        <p class="lg:text-sm inline-block  md:w-48 w-32" :class="textKeyPosition(value, key)"> {{
            firstLetterToUpperCase(delUnderscore(key))
        }} :</p>
        <!-- Eine Liste aus einem Array -->
        <template v-if="generateList(value)">
          <template v-if="value.length != 0">
            <ul class="mb-2">
              <li v-for="val in value" v-bind:key="val" class="inline-block mx-4 md:my-0 my-1">
                <a class="underline underline-offset-4 lg:text-sm text-xs mr_fontGlobal my-6" @click="loadInfo(val)"
                  href="#">
                  {{ loadNameOrTitle(val)
                  }}
                </a>
              </li>
            </ul>
          </template>
          <template v-else>
            <!-- Text not defiend -->
            <p class="lg:text-sm text-xs underline-offset-4 mr_fontGlobal my-2">Not
              defined</p>
          </template>
        </template>
        <!-- Link ohne Array ausser url-->
        <template v-else-if="checkValue(value)">
          <ul class="mb-2">
            <li v-if="key != 'url'">
              <a @click="loadInfo(value)" class="underline underline-offset-4 lg:text-sm mr_fontGlobal my-6 mb-2"
                href="#">
                {{ loadNameOrTitle(value) }}
              </a>
            </li>
            <li v-else>
              <a class="underline underline-offset-4 lg:text-sm mr_fontGlobal my-6 mb-2" :href="value" target="_blank">
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
          <p class="lg:text-sm block text-justify mx-10 my-5 p-5 border border-white rounded-lg">{{ value }}</p>
        </template>

        <p v-else class="lg:text-sm inline-block w-48 text-end">{{ firstLetterToUpperCase(value) }}</p>

      </li>

    </ul>

  </div>
</template>


