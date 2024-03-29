<script setup>
import { computed } from 'vue'
import Utils from "../lib/Utils";
import JediUtils from "../lib/jedi"
import stringJs from "../lib/string"
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { pageData, response } = storeToRefs(store)

const itemTitle = computed(() => {
  return pageData.value.itemInfoPage.name || pageData.value.itemInfoPage.title || "Not defined"
})

const textKeyPosition = (value, key) => {
  if (!(JediUtils.isArray(value) || JediUtils.checkTextForCharacters(value, "https") || key === "opening_crawl")) {
    return ["text-start"]
  }
}
</script>
<template>
  <div
    class="relative bg--main font--primary text-center py-8 border-2 ml-0  m-4  rounded-lg overflow-auto lg:h-[62vh]  md:h-[79vh]  h-[53vh]">
    <h2 class=" lg:text-3xl  md:text-xl sm:text-sm text-sm  underline underline-offset-4">{{
      itemTitle
    }}</h2>
    <br>
    <ul class="dark:text-white text-black font-medium lg:text-xl  md:text-sm sm:text-xs xxs:text-xs ">
      <li v-for="(value, key, index) in pageData.itemInfoPage" :key="index">
        <p class="lg:text-sm inline-block  md:w-48 w-32" :class="textKeyPosition(value, key)"> {{
          stringJs.firstLetterToUpperCase(stringJs.delUnderscore(key))
        }} :</p>
        <!-- Eine Liste aus einem Array -->
        <template v-if="JediUtils.isArray(value)">
          <template v-if="value.length != 0">
            <ul class="mb-2">
              <li v-for="val in value" v-bind:key="val" class="inline-block mx-4 md:my-0 my-1">
                <a class="button--link text--underline lg:text-sm text-xs font--primary my-6" @click="Utils.loadInfo(val)"
                  href="#">
                  {{
                    JediUtils.getNameOrTitle(val, pageData.apiURL, response.data)
                  }}
                </a>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="lg:text-sm text-xs text--underline font--primary my-2">Not
              defined</p>
          </template>
        </template>
        <!-- Link ohne Array ausser url-->
        <template v-else-if="JediUtils.checkTextForCharacters(value, 'https')">
          <ul class="mb-2 text--underline">
            <li v-if="key != 'url'">
              <a @click="Utils.loadInfo(value)" class=" lg:text-sm button--link font--primary my-6 mb-2" href="#">
                {{ JediUtils.getNameOrTitle(value, pageData.apiURL, response.data) }}
              </a>
            </li>
            <li v-else>
              <a class=" lg:text-sm font--primary my-6 mb-2" :href="value" target="_blank">
                {{ value }}
              </a>
            </li>
          </ul>
        </template>
        <template v-else-if="(['created', 'edited', 'release_date'].includes(key))">
          <p class="lg:text-sm inline-block w-48 text-end">{{ Utils.getDate(value) }}</p>
        </template>
        <template v-else-if="(key === 'episode_id')">
          <p class="lg:text-sm inline-block w-48 text-end">{{ value }}</p>
        </template>
        <template v-else-if="(key === 'opening_crawl')">
          <p class="lg:text-sm block text-justify mx-10 my-5 p-5 border border-white rounded-lg">{{ value }}</p>
        </template>
        <p v-else class="lg:text-sm inline-block w-48 text-end">{{ stringJs.firstLetterToUpperCase(value) }}</p>
      </li>
    </ul>
  </div>
</template>