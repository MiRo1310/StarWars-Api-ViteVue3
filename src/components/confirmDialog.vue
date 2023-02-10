<script setup>
const emit = defineEmits(["confirm"])

</script>
<template>
    <div class="bg--color-confirm md:w-[30%] w-[80%] h-40 text-center">
        <h1 class="mt-4 font-bold p-2">Do you really want to reload Data from API?</h1>
        <button @click="emit('confirm', true)" type="button" class="button--confirm">OK</button>
        <button @click="emit('confirm', false)" type="button" class="button--confirm">Abort</button>
    </div>
</template>