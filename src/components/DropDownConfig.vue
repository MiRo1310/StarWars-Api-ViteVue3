<script setup>
const emit = defineEmits(["reloadData"])


</script>

<template>
    <ul class="p-1 text-left text-yellow-400 lg:text-sm xxs:text-xs h-52">
        <li class="mr_dropDown" @click="$emit('reloadData')">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            <p class="mr_dropDownText">Reload Data</p>
        </li>
        <li class="mr_dropDown">
            <font-awesome-icon icon="fa-solid fa-droplet" />
            <p class="mr_dropDownText">Light-Mode/Dark-Mode</p>
        </li>
        <li class="mr_dropDown"></li>
    </ul>
</template>