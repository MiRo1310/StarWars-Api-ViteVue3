<template>
    <li @click="setInfoNumber(this.value.url)"
        class="py-2 my-2 text-yellow-400 text-sm lg:text-sm underline underline-offset-4 cursor-pointer  p-2  mx-4 rounded-lg"
        :class="activeItem()">
        <a href="javascript:void(0)">
            {{ value.name
            }} {{ value.title }}

        </a>
    </li>
</template>

<script>
export default {
    name: "StarWarsNav",
    data() {
        return {
            value: this.element,
            itemActive: this.item
        }
    },
    computed: {

    },
    methods: {
        activeItem() {

            if (this.nameOfInfo === this.value.name || this.nameOfInfo === this.value.title) {
                return "bg-blue-900 text-white border-yellow-400 border-2"
            }
            else { return "bg-slate-700" }
        },
        setInfoNumber(val) {
            this.$emit("loadInfo", val)

        },
    },
    props: ["element", "nameOfInfo", "item"]

}
</script>

