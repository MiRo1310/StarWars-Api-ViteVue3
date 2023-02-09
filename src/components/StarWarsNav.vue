<script setup>
const props = defineProps(["elementOfListToShow", "nameOfInfo"])
const emit = defineEmits(["loadInfo"])

const activeItem = () => {
    if (props.nameOfInfo === (props.elementOfListToShow.name || props.elementOfListToShow.title)) {
        return "button--blueYellow-active"
    }
    else { return "button--grayYellow " }
}

</script>


<template>
    <li @click="emit('loadInfo', props.elementOfListToShow.url)"
        class="py-2 my-2 font-medium lg:text-sm  md:text-xs sm:text-xs text-xxs cursor-pointer  p-2 rounded-lg"
        :class="activeItem()">
        <a href="javascript:void(0)">
            {{
                props.elementOfListToShow.name
            }} {{ props.elementOfListToShow.title }}
        </a>
    </li>
</template>



