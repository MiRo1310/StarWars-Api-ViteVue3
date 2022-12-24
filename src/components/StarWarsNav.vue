<script setup>
const props = defineProps(["elementOfListToShow", "nameOfInfo"])
const emit = defineEmits(["loadInfo"])

const activeItem = () => {
    if (props.nameOfInfo === (props.elementOfListToShow.name || props.elementOfListToShow.title)) {
        return "bg-blue-900 text-white border-yellow-400 border-2"
    }
    else { return "bg-slate-700" }
}

const setInfoNumber = (val) => {
    emit("loadInfo", val)
}    
</script>


<template>
    <li @click="setInfoNumber(props.elementOfListToShow.url)"
        class="py-2 my-2 text-yellow-400 lg:text-sm  md:text-xs sm:text-xs text-[0.6rem] underline underline-offset-4 cursor-pointer  p-2 rounded-lg"
        :class="activeItem()">
        <a href="javascript:void(0)">
            {{ props.elementOfListToShow.name
            }} {{ props.elementOfListToShow.title }}
        </a>
    </li>
</template>



