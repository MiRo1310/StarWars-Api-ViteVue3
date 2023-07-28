<script setup>
const props = defineProps(["elementOfListToShow", "nameOfInfo"])
const emit = defineEmits(["loadInfo"])

const activeItem = () => {
    if (props.nameOfInfo === (props.elementOfListToShow.name || props.elementOfListToShow.title)) {
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



