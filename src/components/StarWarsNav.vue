<script setup>
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
const store = useStore()
const { pageData } = storeToRefs(store)

const props = defineProps(["elementOfListToShow"])
const emit = defineEmits(["loadInfo"])


const activeItem = () => {
    if (pageData.value.actualItem === (props.elementOfListToShow.name || props.elementOfListToShow.title)) {
        return "button--primary-active"
    }
    else { return "button--primary " }
}

</script>


<template>
    <li @click="emit('loadInfo', props.elementOfListToShow.url)"
        class="button button--link my-2 font-medium lg:text-sm  md:text-xs sm:text-xs text-xxs cursor-pointer rounded-lg"
        :class="activeItem()">
        <a href="javascript:void(0)">
            {{
                props.elementOfListToShow.name
            }} {{ props.elementOfListToShow.title }}
        </a>
    </li>
</template>



