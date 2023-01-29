<script setup>
const emit = defineEmits(["confirm"])

const confirm = (val) => {
    emit("confirm", val)
}
</script>
<template>
    <div class="bg-gray-200 md:w-[30%] w-[90%] h-40 text-center">
        <h1 class="mt-4 font-bold">Do you really want to reload Data from API?</h1>
        <button @click="confirm(true)" type="button" class="buttonConfirmDialog">OK</button>
        <button @click="confirm(false)" type="button" class="buttonConfirmDialog">Abort</button>
    </div>
</template>