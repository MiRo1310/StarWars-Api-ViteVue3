<template>
    <li @click="setInfoNumber(value.url)"
        class="py-2 my-2 text-yellow-400 text-sm lg:text-sm underline underline-offset-4 cursor-pointer  p-2  mx-4 rounded-lg"
        :class="activeItem()">
        <a href="javascript:void(0)">
            {{ value.name
            }} {{ value.title }}

        </a>
    </li>
</template>

<script>
import { ref } from 'vue'
export default {
    name: "StarWarsNav",
    setup(props, { emit }) {
        const value = ref(props.element)
        const itemActive = ref(props.item)
        const activeItem = () => {


            if (props.nameOfInfo === value.value.name || props.nameOfInfo === value.value.title) {
                return "bg-blue-900 text-white border-yellow-400 border-2"
            }
            else { return "bg-slate-700" }
        }

        const setInfoNumber = (val) => {
            emit("loadInfo", val)

        }

        return {
            value,
            itemActive,
            activeItem,
            setInfoNumber,


        }

    },

    props: ["element", "nameOfInfo", "item"]

}
</script>

