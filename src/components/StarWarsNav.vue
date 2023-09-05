<script setup>
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import { useResponsive } from "../composables/useResponsive"
import Utils from "../lib/Utils"
const { isMobile } = useResponsive()
const store = useStore()
const { pageData } = storeToRefs(store)

const props = defineProps(["elementOfListToShow"])

const activeItem = () => {
    if (pageData.value.actualItem === (props.elementOfListToShow.name || props.elementOfListToShow.title)) return "button--primary-active"
    else return "button--primary "
}
const loadInfo = (val) => {
    Utils.loadInfo(val)
    if (isMobile) store.setValuePageData(false, "showMobilNav")
}
</script>

<template>
    <li @click="loadInfo(props.elementOfListToShow.url)"
        class="button button--link my-2 font-medium lg:text-sm  md:text-xs sm:text-xs text-xxs cursor-pointer rounded-lg"
        :class="activeItem()">
        <a href="javascript:void(0)">
            {{ props.elementOfListToShow.name }} {{ props.elementOfListToShow.title }}
        </a>
    </li>
</template>



